import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { ConfigService } from '@nestjs/config';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser());

  app.use(
    session({
      secret: configService.get('SESSION_SECRET'),
      resave: true,
      saveUninitialized: false,
    }),
  );

  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:5173',
      /\.localhost:5173$/,
    ],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Teach Me API')
    .setDescription('The Teach Me API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
