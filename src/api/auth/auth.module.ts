// Nest modules
import { Module }             from '@nestjs/common';
import { TypeOrmModule }      from '@nestjs/typeorm';
import { JwtModule }          from '@nestjs/jwt';
import { PassportModule }     from '@nestjs/passport';
import { JwtStrategy }        from './strategies/jwt.strategy';

// Controllers
import { AuthController }     from './auth.controller';

// Services
import { AuthService }        from './auth.service';
import { UserService }        from '../user/user.service';
import { QuoteService }        from '../quote/quote.service';

// Models
import { User }               from '../../shared/models/user.model';
import { QuoteTemporary } from 'src/shared/models/quote_temporary.model';
import { Quote } from 'src/shared/models/quote.model';
import { Permission } from 'src/shared/models/permission.model';
import { Car } from 'src/shared/models/car.model';


@Module({
  imports     : [
    TypeOrmModule.forFeature([ User, Quote, QuoteTemporary, Permission, Car ]), //les models utilisee a l'interieur

    PassportModule.register({ session: false,defaultStrategy : 'jwt' }),
    JwtModule.register({
      secret      : 'JWT_SECRET_KEY', //comme celui dans jwt.strategy.ts
      signOptions : {
        expiresIn : 43200, // 12h = 43200
      },
    }),
  ],
  providers   : [ AuthService, JwtStrategy, UserService, QuoteService ],
  controllers : [ AuthController ],
})
export class AuthModule {}