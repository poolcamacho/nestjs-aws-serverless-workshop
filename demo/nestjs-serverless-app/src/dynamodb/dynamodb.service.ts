import { CreateTableCommand, DynamoDBClient, ListTablesCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class DynamodbService implements OnModuleInit {
    private readonly client: DynamoDBClient;
    private readonly docClient: DynamoDBDocumentClient;
    private readonly tableName: string;

    constructor() {
        const isLocal = process.env.NODE_EVN === 'local';

        this.client = new DynamoDBClient({
            region: process.env.DYNAMODB_REGION,
            ...(isLocal && { endpoint: process.env.DYNAMODB_ENDPOINT })
        })

        this.docClient = DynamoDBDocumentClient.from(this.client);
        this.tableName = process.env.DYNAMODB_TABLE || 'UsersTable';
    }

    async onModuleInit() {
        const tables = await this.listTables();
        if (!tables.includes(this.tableName)) {
            console.log(`Creating tables: ${this.tableName}`)
            const command = new CreateTableCommand({
                TableName: this.tableName,
                KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
                AttributeDefinitions: [{AttributeName:'id', AttributeType:'S'}],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5
                }
            })
            await this.client.send(command)
            console.log(`Table ${this.tableName} created`)
        }
    }

    async listTables(): Promise<string[]> {
        const command = new ListTablesCommand({})
        const response = await this.client.send(command)
        return response.TableNames || []
    }

    async putItem(item: Record<string, any>) {
        const command = new PutCommand({
            TableName: this.tableName,
            Item: item,
        });
        await this.docClient.send(command);
    }

    async getItem(id: string) {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: { id },
        });
        const response = await this.docClient.send(command);
        return response.Item;
    }

    async scanTable() {
        const command = new ScanCommand({
            TableName: this.tableName,
        });
        const response = await this.docClient.send(command);
        return response.Items || [];
    }
}