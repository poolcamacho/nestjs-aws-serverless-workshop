import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
