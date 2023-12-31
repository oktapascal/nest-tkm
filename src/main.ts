import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

// noinspection ES6ConvertRequireIntoImport
const CookieSession = require('cookie-session');

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        // for logs error
        new transports.DailyRotateFile({
          filename: `logs/%DATE%_error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // for logs all level
        new transports.DailyRotateFile({
          filename: `logs/%DATE%_combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '30d',
        }),
        // show logs in console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `[${info.timestamp}] [${info.level}]: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['POST', 'GET', 'PATCH', 'DELETE'],
  });

  app.setGlobalPrefix('api');

  app.use(
    CookieSession({
      keys: ['M0geIzGFDTgz'],
    }),
  );

  await app.listen(3000);
}
// noinspection JSIgnoredPromiseFromCall
bootstrap();
