// Nest modules
import { Module }              from '@nestjs/common';
import { TypeOrmModule }       from '@nestjs/typeorm';
import { JwtModule }           from '@nestjs/jwt';
import { PassportModule }      from '@nestjs/passport';

import { FrontController }     from './front.controller';
import { UserService } from 'src/api/user/user.service';

import { User} from 'src/shared/models/user.model'

@Module({
  imports     : [
    PassportModule.register({ defaultStrategy : 'jwt' }),
    TypeOrmModule.forFeature([User]),
  ],
  providers   : [ UserService],
  controllers : [ FrontController ],
})
export class FrontModule {}
