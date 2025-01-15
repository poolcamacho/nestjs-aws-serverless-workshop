import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DynamoDBService } from 'src/shared/dynamodb.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, DynamoDBService],
  exports: [UsersService],
})
export class UsersModule {}
