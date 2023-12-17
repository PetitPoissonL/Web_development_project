import { Test, TestingModule } from '@nestjs/testing'
import { QuoteController } from './quote.controller'
import { QuoteService} from './quote.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock'
import { Repository } from 'typeorm'
import { Quote } from '../../shared/models/quote.model'
import { QuoteTemporary } from '../../shared/models/quote_temporary.model'

import { User } from '../../shared/models/user.model'
import { Car } from '../../shared/models/car.model'
import { Permission } from '../../shared/models/permission.model'


import { Body } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';
import { RegisterResponse } from '../../shared/enums/register-response.enum'
import { UserService } from '../user/user.service'
import { JwtStrategy } from '../auth/strategies/jwt.strategy'



// créer les donnée virtuelles selon mock
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>():MockRepository<T> => ({
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn()

})

describe('QuoteService', () => {
  let userService: UserService;
  let quoteService: QuoteService;



  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        QuoteService,
        // pour éviter l'erreur de dépendance, il faut utiliser le mock pour simuler les respos
        { provide: getRepositoryToken(User), useValue: createMockRepository()},
        { provide: getRepositoryToken(Car), useValue: createMockRepository()},
        { provide: getRepositoryToken(Permission), useValue: createMockRepository()},
        { provide: getRepositoryToken(Quote), useValue: createMockRepository()},
        { provide: getRepositoryToken(QuoteTemporary), useValue: createMockRepository()}
      ]
    }).compile();

    quoteService = module.get<QuoteService>(QuoteService);
  });

  // it = Individual test. Pour vérifier si le serveur UserService est bien défini
  it('QuoteService - should be defined', () =>{
    expect(quoteService).toBeDefined();
  });
})