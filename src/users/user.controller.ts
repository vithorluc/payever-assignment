import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const { user, avatar } = createUserDto;
    const createdUser = await this.usersService.createUser(user, avatar);
    return createdUser;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string) {
    const avatarData = await this.usersService.getUserAvatar(userId);
    return avatarData;
  }

  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string) {
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.deleteUserAvatarFile(user.avatar);

    await this.usersService.deleteUserAvatar(userId);

    return { message: 'Avatar deleted successfully' };
  }
}
