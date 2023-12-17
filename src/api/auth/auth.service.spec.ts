import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService} from './auth.service'
import { UserService} from '../user/user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { Repository } from 'typeorm'
import { User } from '../../shared/models/user.model'
import { Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from '../../shared/enums/auth-response.enum'
import { RegisterResponse } from '../../shared/enums/register-response.enum'
import { sendemail } from '../../common/helper/env.helper';

jest.mock('bcrypt');

const mockedUser: User = {

  id : null,
  permission : null,
  permissionId :null,
  cars : null,
  quotes : null,
  firstname : null,

  password : 'strongPassword',

  lastname : null,

  mobile : null,

  email : 'user@email.com',

  address : null,

  birth : null,

  sinistre : null,

  question : 1,

  answer : "good",

  card_number : null,

  expire_date : null,

  cvv : null

}



describe('The AuthenticationService', () => {
  let authService: AuthService;
  let usersService: UserService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let JwtPayloadData :JwtPayload = {id : 1, email: "user@email.com"};
  let findUser: jest.Mock;
  let saveUser: jest.Mock;
  let updateUser : jest.Mock;

  beforeEach(async () => {
    userData = {
      ...mockedUser
    }
    JwtPayloadData.id = 1
    JwtPayloadData.email = "user@email.com"
    findUser = jest.fn().mockResolvedValue(userData);
    saveUser = jest.fn().mockResolvedValue(userData);
    updateUser = jest.fn().mockResolvedValue(userData)
    const usersRepository = {
      findOne: findUser,
      save: saveUser,
      update : updateUser,
      
    }
    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compareSync as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository
        }
      ],
    })
      .compile();
    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get<UserService>(UserService);
  })
  describe('service bien define', () => {
    it('should be defined', () => {
      expect(AuthService).toBeDefined();
    });
  });

  describe('test authenticate when accessing the data of authenticating user', () => {
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        const result = await 
        // expect(
          authService.authenticate('user@email.com', 'strongPassword')
        //).rejects.toThrow();
        expect(result).toBe('AUTHENTICATION_FAIL')
      })
    })
    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        })
        it('should return the user data', async () => {
          const user = await authService.authenticate('user@email.com', 'hash');
          expect(user).toBe(userData);
        })
      })
    })
    describe('and the user is not found in the database', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      })
      it('should throw an error', async () => {
        const result = 
         //expect(
        await authService.authenticate('user@email.com', 'strongPassword')
        //).rejects.toThrow();
        //);
        expect(result).toBe('USER_NOT_FOUND');
      })
    })

  })
  describe('when forgot password', () => {
    describe('the user exists', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
        saveUser.mockResolvedValue(userData);
      });
      it('should return AUTHENTICATION_FAIL', async () => {
        const result = await authService.forgotpassword('user@email.com', 'hash', null, null);
        expect(result).toBe('AUTHENTICATION_FAIL');
      })
      it('should return SUCCESS', async () => {
        const result = await authService.forgotpassword('user@email.com', 'hash', 1, "good");
        expect(result).toBe('SUCCESS');
      })
    })
    describe('the user is not found in the database', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      })
      it('should throw an error', async () => {
        const result = await 
        //expect(
          authService.forgotpassword('user@email.com', 'strongPassword', null , null)
        //).rejects.toThrow();
        //);
        expect(result).toBe('USER_NOT_FOUND');
      })
    })
  })
  describe('when testing valide User', () => {
    describe('the user exists', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
      });
      it('should trow error', async () => {
        await expect(
          authService.validateUser(null)
        ).rejects.toThrow();
      })
      it('success should user', async () => {
        const user = await authService.validateUser(JwtPayloadData);
        expect(user).toBe(userData);
      })
    })
    describe('the user is not found in the database', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      })
      it('should throw an error', async () => {
        await expect(
          authService.validateUser(JwtPayloadData)
        ).rejects.toThrow();
      })
    })
  })
  describe('when testing authenticate_state', () => {
    describe('the user doesnt exist', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      })
      it('should return USER_NOT_FOUND', async () => {
        const state = await authService.authenticate("u", "123");
        expect(state).toBe('USER_NOT_FOUND');
      })
    })
    describe('User exists but provided password is not valid', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
        bcryptCompare.mockReturnValue(false);
      })
      it('should return AUTHENTICATION_FAIL', async () => {
        const state = await authService.authenticate("u", "123");
        expect(state).toBe('AUTHENTICATION_FAIL');
      })
    })
    describe('User exists and provided password is valid', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(userData);
        bcryptCompare.mockReturnValue(true);
      })
      it('should return un objet User', async () => {
        const state = await authService.authenticate("u", "123");
        // expect(state).toBe(2);
        expect(state).toMatchObject(userData);

      })
    })
    const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

    // In order to return a specific value you can use this instead
    // const sendMailMock = jest.fn().mockReturnValue(/* Whatever you would expect as return value */);
    

    jest.mock("nodemailer");
    
    const nodemailer = require("nodemailer"); //doesn't work with import. idk why
    nodemailer.createTransport.mockReturnValue({"sendMail": sendMailMock});
    
    beforeEach( () => {
        sendMailMock.mockClear();
        nodemailer.createTransport.mockClear();
    });
    
    describe("Test sendmail", () => {
        test("", async () => {
          sendemail("lbblk1998@gmail.com", RegisterResponse.USER_ALREADY_EXISTS)
          expect(sendMailMock).toHaveBeenCalled();
        });
    });





  })
});