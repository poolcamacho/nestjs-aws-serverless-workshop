import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../shared/dynamodb.service';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private readonly tableName = 'Users';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async create(createUserDto: CreateUserDto) {
    const id = uuid();
    const timestamp = new Date().toISOString();

    const params = {
      TableName: this.tableName,
      Item: {
        id,
        ...createUserDto,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    await this.dynamoDBService.put(params);
    return { id, ...createUserDto };
  }

  async findOne(id: string) {
    const params = {
      TableName: this.tableName,
      Key: { id },
    };

    const result = await this.dynamoDBService.get(params);
    return result.Item;
  }

  async findAll() {
    const params = {
      TableName: this.tableName,
    };

    const result = await this.dynamoDBService.scan(params);
    return result.Items;
  }
}
