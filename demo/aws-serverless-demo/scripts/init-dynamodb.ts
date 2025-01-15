import { DynamoDB } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuración específica para DynamoDB local
const dynamodb = new DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DUMMYIDEXAMPLE',
  secretAccessKey: 'DUMMYEXAMPLEKEY',
  credentials: {
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
  },
});

async function createTables() {
  try {
    // Crear tabla Users
    await dynamodb
      .createTable({
        TableName: 'Users',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        BillingMode: 'PAY_PER_REQUEST',
      })
      .promise();

    console.log('Tabla Users creada exitosamente');
  } catch (error) {
    if (error.code === 'ResourceInUseException') {
      console.log('Las tablas ya existen');
    } else {
      console.error('Error creando tablas:', error);
    }
  }
}

createTables();
