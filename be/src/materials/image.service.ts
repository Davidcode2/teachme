import { Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { fromPath } from 'pdf2pic';
import { exec } from 'child_process';

export class ImageService {
  public async createPreview(fileInfo: { fileName: string; filePath: string }) {
    fs.mkdir(`assets/previews/${fileInfo.fileName}`);
    const options = this.createOptions(fileInfo.fileName, 'preview');

    Logger.debug(
      `preview options: ${options.savePath}\n${options.saveFilename}`,
    );

    const numberOfPages = await this.getNumberOfPages(fileInfo.filePath);

    try {
      Logger.debug(
        `trying to convert all pages to image, file path: ${fileInfo.filePath}`,
      );
      if (!numberOfPages) {
        throw new Error('Number of pages is 0 or undefined');
      }
      if (numberOfPages === 1) {
        await this.createImageFromOnePage(fileInfo.filePath, options);
      } else {
        await this.createImageFromAllPages(
          fileInfo.filePath,
          options,
          numberOfPages,
        );
      }
      return options.savePath;
    } catch (error) {
      await this.handleError(error, options.savePath);
      throw new Error('Preview creation failed');
    }
  }

  private async handleError(error: Error, path: string) {
    Logger.error(
      `rolling back failed preview...\n 
        deleting file path: ${path}`,
      error,
    );
    await fs.unlink(path);
  }

  private async createImageFromOnePage(path: string, options: object) {
    const convert = fromPath(path, options);
    await convert(1, { responseType: 'image' });
  }

  private async createImageFromAllPages(
    path: string,
    options: object,
    pages: number,
  ) {
    const arr = this.pageNumberArray(pages);
    await fromPath(path, options).bulk(arr, {
      responseType: 'image',
    });
  }

  private pageNumberArray(pages: number) {
    const array: number[] = [];
    for (let i = 1; i <= pages; i++) {
      array.push(i);
    }
    return array;
  }

  public async createThumbnail(fileInfo: {
    fileName: string;
    filePath: string;
  }) {
    const options = this.createOptions(fileInfo.fileName, 'thumbnail');
    Logger.debug(
      `thumbnail options: ${options.savePath}\n saveFilename: ${options.saveFilename}`,
    );
    const convert = fromPath(fileInfo.filePath, options);
    const pageToConvertAsImage = 1;

    try {
      await convert(pageToConvertAsImage, { responseType: 'image' });
      return (
        options.savePath +
        '/' +
        options.saveFilename +
        '.' +
        '1.' +
        options.format
      );
    } catch (error) {
      Logger.error('thumbnail creation failed with error: ', error);
      throw new Error('thumbnail creation failed');
    }
  }

  private async getNumberOfPages(filePath: string): Promise<number> {
    const pdfInfo = exec(`sh -c "pdfinfo ${filePath}"`);
    const pdfPagesPromise = new Promise<number>((resolve, reject) => {
      pdfInfo.stderr.on('data', (data) => {
        Logger.debug('pdfInfo failed: ', data);
        reject(0);
      });
      pdfInfo.stdout.on('data', (metadata) => {
        Logger.debug('pdfInfo succeeded, metadata: ', metadata);
        const pagesString = metadata
          .toString()
          .split('\n')
          .find((line: string) => line.includes('Pages'));
        if (!pagesString) {
          reject(new Error('Pages not found in pdf metadata'));
        }
        const pages = Number(pagesString.split(':')[1].trim());
        resolve(pages);
      });
    });
    return pdfPagesPromise;
  }

  private createOptions(path: string, type: string) {
    let savePath: string;
    console.log(type);
    switch (type) {
      case 'preview':
        savePath = `assets/${type}s/${path}`;
        break;
      case 'thumbnail':
        savePath = `assets/images`;
        break;
      default:
        savePath = `assets/${type}s/${path}`;
    }
    return {
      density: 100,
      saveFilename: `${path}_${type}`,
      savePath: savePath,
      format: 'png',
      width: 800,
      preserveAspectRatio: true,
    };
  }
}
