import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UserModule } from './user/user.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [HealthModule, UserModule, DynamodbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
