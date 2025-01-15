import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  Handler,
  Context,
  APIGatewayProxyEvent,
  SQSEvent,
  Callback,
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { NotificationsService } from './notifications/notifications.service';

let server: Handler;
let notificationsService: NotificationsService;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  server = serverlessExpress({ app: expressApp });

  // Get notifications service instance for processing SQS messages
  notificationsService = app.get(NotificationsService);

  return server;
}

export const api: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};

export const processNotifications: Handler = async (
  event: SQSEvent,
  context: Context,
  callback: Callback,
) => {
  try {
    if (!notificationsService) {
      const app = await NestFactory.create(AppModule);
      await app.init();
      notificationsService = app.get(NotificationsService);
    }

    for (const record of event.Records) {
      await notificationsService.processNotification(record.body);
    }

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully processed notifications',
        processedCount: event.Records.length,
      }),
    });
  } catch (error) {
    callback(error);
  }
};
