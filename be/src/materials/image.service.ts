import { Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { fromPath } from 'pdf2pic';
import * as PDFParser from 'pdf2json';

export class ImageService {
  public async createPreview(fileInfo: { fileName: string; filePath: string }) {
    fs.mkdir(`assets/previews/${fileInfo.fileName}`);
    const options = {
      density: 100,
      saveFilename: `${fileInfo.fileName}_preview`,
      savePath: `assets/previews/${fileInfo.fileName}`,
      format: 'png',
      width: 800,
      height: 600,
    };

    Logger.debug(
      `preview options: ${options.savePath}\n${options.saveFilename}`,
    );

    const numberOfPages = this.getNumberOfPages(fileInfo.filePath);

    try {
      Logger.debug(
        `trying to convert all pages to image, file path: ${fileInfo.filePath}`,
      );
      const arr = Array.from(Array(numberOfPages).keys());
      const res = await fromPath(fileInfo.filePath, options).bulk(arr, {
        responseType: 'image',
      });
      Logger.debug(`got convert object, file path: ${fileInfo.filePath}`);
      //      convert.bulk(-1, { responseType: 'image' }).then((resolve) => {
      //        Logger.log('All pages are now converted to image');
      //        return resolve;
      //      });
    } catch (error) {
      Logger.debug(`catching... file path: ${fileInfo.filePath}`);
      Logger.error(error);
    }
    return options.savePath;
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

  private getNumberOfPages(filePath: string) {
    const pdfParser = new (PDFParser as any)(null, 1);
    pdfParser.on('pdfParser_dataError', (errData) =>
      Logger.error(errData.parserError),
    );
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const numberOfPages = pdfData.Pages.length;
      console.log('Number of pages:', numberOfPages);
      return numberOfPages;
    });
    pdfParser.loadPDF(filePath);
  }
}
