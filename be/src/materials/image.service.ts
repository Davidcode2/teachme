import { Injectable, Logger } from '@nestjs/common';
import { fromPath } from 'pdf2pic';

export class ImageService {
  public async createPreview(fileInfo: { fileName: string; filePath: string }) {
    const options = {
      density: 100,
      saveFilename: `${fileInfo.fileName}_preview`,
      savePath: `assets/previews/`,
      format: 'png',
      width: 800,
      height: 600,
    };

    const convert = fromPath(fileInfo.filePath, options);

    convert.bulk(-1, { responseType: 'image' }).then((resolve) => {
      Logger.log('All pages are now converted to image');
      return resolve;
    });
    return options.savePath;
  }
}
