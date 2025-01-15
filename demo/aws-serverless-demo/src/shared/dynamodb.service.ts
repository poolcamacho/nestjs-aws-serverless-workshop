import { Injectable } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly dynamoDB: DynamoDB.DocumentClient;

  constructor(private configService: ConfigService) {
    this.dynamoDB = new DynamoDB.DocumentClient({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async put(
    params: DynamoDB.DocumentClient.PutItemInput,
  ): Promise<DynamoDB.DocumentClient.PutItemOutput> {
    return this.dynamoDB.put(params).promise();
  }

  async get(
    params: DynamoDB.DocumentClient.GetItemInput,
  ): Promise<DynamoDB.DocumentClient.GetItemOutput> {
    return this.dynamoDB.get(params).promise();
  }

  async query(
    params: DynamoDB.DocumentClient.QueryInput,
  ): Promise<DynamoDB.DocumentClient.QueryOutput> {
    return this.dynamoDB.query(params).promise();
  }

  async scan(
    params: DynamoDB.DocumentClient.ScanInput,
  ): Promise<DynamoDB.DocumentClient.ScanOutput> {
    return this.dynamoDB.scan(params).promise();
  }

  async update(
    params: DynamoDB.DocumentClient.UpdateItemInput,
  ): Promise<DynamoDB.DocumentClient.UpdateItemOutput> {
    return this.dynamoDB.update(params).promise();
  }

  async delete(
    params: DynamoDB.DocumentClient.DeleteItemInput,
  ): Promise<DynamoDB.DocumentClient.DeleteItemOutput> {
    return this.dynamoDB.delete(params).promise();
  }
}
