import { Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { fromPath } from 'pdf2pic';
import * as PDFParser from 'pdf2json';
import { exec } from 'child_process';

export class ImageService {
  public async createPreview(fileInfo: { fileName: string; filePath: string }) {
    fs.mkdir(`assets/previews/${fileInfo.fileName}`);
    const options = this.createOptions(fileInfo.fileName);

    Logger.debug(
      `preview options: ${options.savePath}\n${options.saveFilename}`,
    );

    const numberOfPages = await this.getNumberOfPages(fileInfo.filePath);

    try {
      Logger.debug(
        `trying to convert all pages to image, file path: ${fileInfo.filePath}`,
      );
      Logger.debug(`number of pages: ${numberOfPages}`);
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
      Logger.debug(`got convert object, file path: ${fileInfo.filePath}`);
    } catch (error) {
      Logger.debug(`catching... file path: ${fileInfo.filePath}`);
      Logger.error(error);
    }
    return options.savePath;
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
    Logger.debug(`array of pages: ${arr}`);
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

  public createThumbnail(fileInfo: { fileName: string; filePath: string }) {
    const options = {
      density: 100,
      saveFilename: `${fileInfo.fileName}_thumbnail`,
      savePath: 'assets/images',
      format: 'png',
      width: 800,
      height: 600,
    };

    const convert = fromPath(fileInfo.filePath, options);
    const pageToConvertAsImage = 1;

    try {
      convert(pageToConvertAsImage, { responseType: 'image' }).then(
        (resolve) => {
          Logger.log('Page 1 is now converted as image');
          return resolve;
        },
      );
    } catch (error) {
      Logger.error(error);
    }
    return (
      options.savePath +
      '/' +
      options.saveFilename +
      '.' +
      '1.' +
      options.format
    );
  }

  private async getNumberOfPages(filePath: string): Promise<number> {
    const pdfInfo = exec(`pdfinfo ${filePath}`);
    const pdfPagesPromise = new Promise<number>((resolve, reject) => {
      pdfInfo.stderr.on('data', (data) => {
        Logger.debug('pdfInfo failed: ', data);
        reject(0);
      });
      pdfInfo.stdout.on('data', (metadata) => {
        Logger.debug('metadata: ', metadata);
        const pagesString = metadata
          .toString()
          .split('\n')
          .find((line) => line.includes('Pages'));
        Logger.debug('pagesString: ', pagesString);
        const pages = Number(pagesString.split(':')[1].trim());
        resolve(pages);
      });
    });
    return pdfPagesPromise;
  }

  private getNumberOfPagesViaPdf2Json(filePath: string): Promise<number> {
    const pdfParser = new (PDFParser as any)();

    const pdfPagesPromise = new Promise<number>((resolve, reject) => {
      pdfParser.on('pdfParser_dataError', (errData) => {
        Logger.error('pdfParser_dataError: ', errData.parserError);
        reject(0);
      });

      pdfParser.on('readable', (meta) => {
        Logger.log('readable meta: ', meta);
        Logger.log('readable metadata: ', meta.Meta.Metadata);
      });
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const pages = pdfData.Pages.length;
        Logger.log('meta from pdf: ', pdfData.Meta);
        Logger.log('metadata from pdf: ', pdfData.Meta.Metadata);
        fs.writeFile('pdfResult_pages', JSON.stringify(pdfData.Pages));
        fs.writeFile('pdfResult', JSON.stringify(pdfData));
        Logger.debug('Number of pages:', pages);
        resolve(pages);
      });
      pdfParser.loadPDF(filePath);
    });
    return pdfPagesPromise;
  }

  private createOptions(path: string) {
    return {
      density: 100,
      saveFilename: `${path}_preview`,
      savePath: `assets/previews/${path}`,
      format: 'png',
      width: 800,
      height: 600,
    };
  }
}
