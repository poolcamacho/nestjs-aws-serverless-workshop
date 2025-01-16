import { Injectable } from '@nestjs/common';
import { DynamodbService } from 'src/dynamodb/dynamodb.service';

@Injectable()
export class UserService {
    constructor(private readonly dynamoDBService: DynamodbService){}

    async getAllUsers() {
        return await this.dynamoDBService.scanTable();
    }

    async createUser(user: {id: string, name: string, email: string}){
        await this.dynamoDBService.putItem(user)
        return {message: 'User created successfully', user}
    }
}
