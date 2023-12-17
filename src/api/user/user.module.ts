// Nest modules
import { Module }              from '@nestjs/common';
import { TypeOrmModule }       from '@nestjs/typeorm';

// Entities
import { User }                from '../../shared/models/user.model';

// Controllers
import { UserController }     from './user.controller';

// Services
import { UserService }        from './user.service';

@Module({
  imports     : [
    TypeOrmModule.forFeature([ User ]), //les models utilisee a l'interieur
  ],
  providers   : [ UserService ],
  controllers : [ UserController ],
})
export class UserModule {}