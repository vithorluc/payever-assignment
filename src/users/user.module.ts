import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserSchema } from './schemas/user.schema';
import { RabbitMQService } from 'src/rabbit/rabbitmq.service';
import { AvatarService } from 'src/avatar/avatar.service';
import { AvatarSchema } from 'src/avatar/schemas/avatar.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Avatar', schema: AvatarSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RabbitMQService, AvatarService],
})
export class UsersModule {}
