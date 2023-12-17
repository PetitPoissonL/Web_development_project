// Nest modules
import { BadRequestException }   from '@nestjs/common';
import { ConflictException }     from '@nestjs/common';
import { Injectable }            from '@nestjs/common';
import { Logger }                from '@nestjs/common';
import { NotFoundException }     from '@nestjs/common';
import { InjectRepository }      from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';

// External modules
import { validate }              from 'class-validator';
import { Repository }            from 'typeorm';

import { User} from '../../shared/models/user.model'

@Injectable()
export class UserService
{
  constructor
  (
    @InjectRepository(User) private userRepository : Repository<User>,
  )
  {}

//req
  public async getUserByEmail(email : string) : Promise<User | null>
  {
    // const user = new User();
    // user.firstname = 'test';
    // user.password = 'test';
    // user.lastname = 'test';
    // user.mobile = 'test';
    // user.email = 'test';
    // user.address = 'test';
    // user.birth = new Date();
    // user.permissions = [];
    // await this.userRepository.save(user); //save insertion
    const user = await this.userRepository.findOne({
      where : [
        { email : email }
      ]
    });
    // console.log(user);
    return user;
  }

//   public async getUser() : Promise<void>
//   {
//   }
}
