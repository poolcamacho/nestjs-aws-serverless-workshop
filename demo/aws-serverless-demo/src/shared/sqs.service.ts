import { Injectable } from '@nestjs/common';
import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SQSService {
  private readonly sqs: SQS;

  constructor(private configService: ConfigService) {
    this.sqs = new SQS({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async sendMessage(
    params: SQS.SendMessageRequest,
  ): Promise<SQS.SendMessageResult> {
    return this.sqs.sendMessage(params).promise();
  }

  async receiveMessage(
    params: SQS.ReceiveMessageRequest,
  ): Promise<SQS.ReceiveMessageResult> {
    return this.sqs.receiveMessage(params).promise();
  }

  async deleteMessage(params: SQS.DeleteMessageRequest): Promise<void> {
    await this.sqs.deleteMessage(params).promise();
  }

  async sendMessageBatch(
    params: SQS.SendMessageBatchRequest,
  ): Promise<SQS.SendMessageBatchResult> {
    return this.sqs.sendMessageBatch(params).promise();
  }

  async deleteMessageBatch(
    params: SQS.DeleteMessageBatchRequest,
  ): Promise<SQS.DeleteMessageBatchResult> {
    return this.sqs.deleteMessageBatch(params).promise();
  }
}
