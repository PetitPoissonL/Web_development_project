import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService} from './user.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { Repository } from 'typeorm'
import { User } from '../../shared/models/user.model'

// créer les donnée virtuelles selon mock
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>():MockRepository<T> => ({
  findOne: jest.fn(),
})

describe('UserService', () => {
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        // pour éviter l'erreur de dépendance, il faut utiliser le mock pour simuler l'objet userRepository
        { provide: getRepositoryToken(User), useValue: createMockRepository()}
      ]
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  // it = Individual test. Pour vérifier si le serveur UserService est bien défini
  it('UserService - should be defined', () =>{
    expect(userService).toBeDefined();
  });

  describe('getUser', () => {
    describe('When user with ID exists', () => {
      it('should return the user firstname', async () => {
        const actual = jest.requireActual('typeorm');
        const userEmail = 'test@email.com'
        const userRepository: Repository<User> = {
          ...actual,
          findOne: jest.fn().mockResolvedValue({
            id: 1,
            email: 'test@email.com',
            firstname: 'Ningyu'
          }),
          save: jest.fn(),
        }
        const userService = new UserService(userRepository)
        const user = await userService.getUserByEmail(userEmail)
        expect(user.firstname).toEqual('Ningyu')
      })
    })
  })

});