import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RabbitMQService } from 'src/rabbit/rabbitmq.service';
import { MailerService } from '@nestjs-modules/mailer';
import { AvatarService } from 'src/avatar/avatar.service';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitMQService,
    private readonly mailerService: MailerService,
    private readonly avatarService: AvatarService,
  ) {}

  async createUser(
    user: { name: string; email: string },
    avatar: { data: string },
  ): Promise<any> {
    const createdUser = new this.userModel(user);
    const timestamp = Date.now();
    const randomValue = Math.random().toString().substring(2);
    const hash = `${createdUser._id}-${timestamp}-${randomValue}`;

    const { path, encodedFile } = await this.saveUserAvatar(
      createdUser._id,
      hash,
      avatar.data,
    );

    createdUser.avatar = path;

    // Dummy email sending logic
    await this.sendEmail(createdUser);

    // RabbitMQ event sending logic
    await this.rabbitMQService.sendEvent(
      'user_created',
      JSON.stringify(createdUser),
    );

    await createdUser.save();

    return { createdUser, encodedUserAvatar: encodedFile };
  }

  private async sendEmail(user: User): Promise<void> {
    const username = user.name;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to our platform!',
      template: 'user-created',
      context: {
        username,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async saveUserAvatar(
    userId: string,
    hash: string,
    data: string,
  ): Promise<{ path: string; encodedFile: string }> {
    const { path, encodedFile } = await this.avatarService.saveAvatar(
      userId,
      hash,
      data,
    );
    return { path, encodedFile };
  }

  async getUserAvatar(userId: string): Promise<{ avatar: string }> {
    return this.avatarService.getAvatar(userId);
  }

  async deleteUserAvatarFile(path: string): Promise<void> {
    try {
      fs.unlinkSync(path);
    } catch (error) {
      console.error('Error deleting avatar file:', error);
      throw new Error('Failed to delete avatar file');
    }
  }

  async deleteUserAvatar(userId: string): Promise<void> {
    await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { $unset: { avatar: 1 } },
        { new: true },
      )
      .exec();
  }
}
