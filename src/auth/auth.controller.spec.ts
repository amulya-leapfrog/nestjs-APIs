import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { signupDetails, tokenResult, userDetails } from './mock/data';
import { ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ERRORS, MESSAGES } from 'src/shared/language/en';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let authRepositroy: AuthRepository;
  let jwtService: JwtService;
  let dbConn: DatabaseService;

  beforeEach(async () => {
    dbConn = new DatabaseService();
    authRepositroy = new AuthRepository(dbConn);
    authService = new AuthService(authRepositroy, jwtService);
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should return accessToken on successful login', async () => {
      jest.spyOn(authService, 'login').mockResolvedValueOnce(tokenResult);

      expect(await authController.login(userDetails)).toBe(tokenResult);
    });

    it('should throw forbidden exception if the user does not exist', async () => {
      jest.spyOn(authRepositroy, 'login').mockResolvedValue(null);

      jest.spyOn(authService, 'login').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      await expect(authController.login(userDetails)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw forbidden exception if the credentials are invalid', async () => {
      const newDate = new Date();

      jest.spyOn(authRepositroy, 'login').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'ABCD',
        lastName: 'CDEF',
        createdAt: newDate,
        updatedAt: newDate,
      });

      jest.spyOn(authService, 'login').mockImplementation(async () => {
        throw new ForbiddenException();
      });

      await expect(authController.login(userDetails)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('signup', () => {
    it('should return success message on successful signup', async () => {
      jest.spyOn(authService, 'signup').mockResolvedValueOnce({
        message: MESSAGES.SIGNUP_SUCCESS,
      });

      expect(await authController.signup(signupDetails)).toStrictEqual({
        message: MESSAGES.SIGNUP_SUCCESS,
      });
    });

    it('should throw forbidden exception if the email is already taken', async () => {
      jest.spyOn(authRepositroy, 'signup').mockRejectedValue(
        new PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`email`)',
          {
            code: 'P2002',
            clientVersion: 'your-prisma-client-version',
          },
        ),
      );

      jest.spyOn(authService, 'signup').mockImplementation(async () => {
        throw new ForbiddenException(ERRORS.EMAIL_TAKEN);
      });

      await expect(authController.signup(signupDetails)).rejects.toThrow(
        new ForbiddenException(ERRORS.EMAIL_TAKEN),
      );
    });
  });
});
