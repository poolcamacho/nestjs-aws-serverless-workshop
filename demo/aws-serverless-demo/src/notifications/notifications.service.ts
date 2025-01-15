import { Injectable } from '@nestjs/common';
import { SQSService } from '../shared/sqs.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly sqsService: SQSService,
    private readonly configService: ConfigService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const queueUrl = this.configService.get<string>('NOTIFICATIONS_QUEUE_URL');

    await this.sqsService.sendMessage({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify({
        ...createNotificationDto,
        timestamp: new Date().toISOString(),
      }),
    });

    return { message: 'Notification queued successfully' };
  }

  async processNotification(message: string) {
    const notification = JSON.parse(message);
    // Aquí implementarías la lógica para procesar la notificación
    // Por ejemplo, enviar un email, SMS, push notification, etc.
    console.log('Processing notification:', notification);
  }
}
