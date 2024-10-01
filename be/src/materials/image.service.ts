import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'node:fs/promises';
import { fromPath } from 'pdf2pic';

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

    try {
      const convert = fromPath(fileInfo.filePath, options);

      convert.bulk(-1, { responseType: 'image' }).then((resolve) => {
        Logger.log('All pages are now converted to image');
        return resolve;
      });
    } catch (error) {
      Logger.error(error);
    }
    return options.savePath;
  }
}
