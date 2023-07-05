import { Test } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { RabbitMQService } from 'src/rabbit/rabbitmq.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let rabbitMQService: RabbitMQService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: RabbitMQService,
          useValue: {
            sendEvent: jest.fn(), // Create a mock function for the sendEvent method
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(), // Create a mock function for the sendMail method
          },
        },
      ],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    rabbitMQService = moduleRef.get<RabbitMQService>(RabbitMQService);
    mailerService = moduleRef.get<MailerService>(MailerService);
  });

  describe('createUser', () => {
    it('should create a new user with avatar and send email', async () => {
      const user = { name: 'Test User', email: 'test@example.com' };
      const avatarData = { data: 'avatarData' };

      const mockCreatedUser = { _id: 'testUserId', ...user };
      const mockEncodedUserAvatar = 'encodedUserAvatar';

      jest.spyOn(usersService, 'saveUserAvatar').mockResolvedValue({
        path: 'avatarPath',
        encodedFile: mockEncodedUserAvatar,
      });
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(null);
      jest.spyOn(rabbitMQService, 'sendEvent').mockResolvedValue(null);

      const result = await usersController.createUser({
        user,
        avatar: avatarData,
      });

      expect(result).toEqual(mockCreatedUser);
      expect(result).toEqual(mockEncodedUserAvatar);

      expect(usersService.saveUserAvatar).toHaveBeenCalledWith(
        mockCreatedUser._id,
        expect.any(String),
        avatarData.data,
      );
      expect(mailerService.sendMail).toHaveBeenCalledWith(expect.any(Object));
      expect(rabbitMQService.sendEvent).toHaveBeenCalledWith(
        'user_created',
        JSON.stringify(mockCreatedUser),
      );
    });
  });
});
