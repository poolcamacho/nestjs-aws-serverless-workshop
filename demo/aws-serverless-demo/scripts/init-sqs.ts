import { SQS } from 'aws-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const sqs = new SQS({
  region: 'localhost',
  endpoint: 'http://localhost:9324',
  accessKeyId: 'DUMMYIDEXAMPLE',
  secretAccessKey: 'DUMMYEXAMPLEKEY',
  credentials: {
    accessKeyId: 'DUMMYIDEXAMPLE',
    secretAccessKey: 'DUMMYEXAMPLEKEY',
  },
});

async function createQueues() {
  try {
    // Crear cola principal
    const mainQueue = await sqs
      .createQueue({
        QueueName: 'notifications-queue-local',
        Attributes: {
          VisibilityTimeout: '30',
          MessageRetentionPeriod: '345600', // 4 días
        },
      })
      .promise();
    console.log('Cola principal creada:', mainQueue.QueueUrl);

    // Crear cola DLQ (Dead Letter Queue)
    const dlq = await sqs
      .createQueue({
        QueueName: 'notifications-queue-dlq-local',
        Attributes: {
          MessageRetentionPeriod: '1209600', // 14 días
        },
      })
      .promise();
    console.log('Cola DLQ creada:', dlq.QueueUrl);

    // Obtener ARN de la cola DLQ
    const dlqAttributes = await sqs
      .getQueueAttributes({
        QueueUrl: dlq.QueueUrl,
        AttributeNames: ['QueueArn'],
      })
      .promise();

    // Configurar la política de reintentos y DLQ en la cola principal
    if (mainQueue.QueueUrl && dlqAttributes.Attributes?.QueueArn) {
      await sqs
        .setQueueAttributes({
          QueueUrl: mainQueue.QueueUrl,
          Attributes: {
            RedrivePolicy: JSON.stringify({
              deadLetterTargetArn: dlqAttributes.Attributes.QueueArn,
              maxReceiveCount: '3',
            }),
          },
        })
        .promise();
      console.log('Política de reintentos configurada');
    }
  } catch (error) {
    if (error.code === 'QueueAlreadyExists') {
      console.log('Las colas ya existen');
    } else {
      console.error('Error creando colas:', error);
    }
  }
}

createQueues();
