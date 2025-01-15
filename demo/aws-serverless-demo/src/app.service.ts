import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to AWS Serverless Demo API!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }

  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'aws-serverless-demo',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
