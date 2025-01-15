import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { SQSService } from 'src/shared/sqs.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, SQSService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
