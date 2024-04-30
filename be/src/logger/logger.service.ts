import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable()
export class LoggerService {
  public log(message: string, level: LogLevel = 'DEBUG') {
    let output = `${new Date().toISOString()} [${level}] ${message}`;
    console.log(output);
    fs.appendFile('log.txt', output + '\n');
  }
}
