import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    _id: 'userId',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockUserModel = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue([mockUser]) }),
    findById: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
    findByIdAndUpdate: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
    findByIdAndDelete: jest
      .fn()
      .mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    await expect(service.create(mockUser as any)).resolves.toEqual(mockUser);
    expect(mockUserModel.create).toHaveBeenCalledWith(mockUser);
  });

  it('should return all users', async () => {
    await expect(service.findAll()).resolves.toEqual([mockUser]);
    expect(mockUserModel.find).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    await expect(service.findOne('userId')).resolves.toEqual(mockUser);
    expect(mockUserModel.findById).toHaveBeenCalledWith('userId');
  });

  it('should update a user', async () => {
    await expect(service.update('userId', mockUser as any)).resolves.toEqual(
      mockUser,
    );
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
      'userId',
      mockUser,
      { new: true },
    );
  });

  it('should delete a user', async () => {
    await expect(service.remove('userId')).resolves.toBeUndefined();
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('userId');
  });

  it('should throw NotFoundException if user not found in findOne', async () => {
    mockUserModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if user not found in update', async () => {
    mockUserModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.update('invalidId', mockUser as any)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if user not found in remove', async () => {
    mockUserModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.remove('invalidId')).rejects.toThrow(
      NotFoundException,
    );
  });
});
