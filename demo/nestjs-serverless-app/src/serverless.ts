import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure } from '@codegenie/serverless-express';

let server: Handler;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();

    const expressApp = app.getHttpAdapter().getInstance();
    return configure({ app: expressApp})
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    if (!server) {
        server = await bootstrap()
    }
    return server(event, context, callback);
}