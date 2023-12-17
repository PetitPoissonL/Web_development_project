import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Quote } from 'src/shared/models/quote.model';
import { Car } from 'src/shared/models/car.model'; 
import { User } from 'src/shared/models/user.model';
import { Permission } from 'src/shared/models/permission.model';

// Controllers
import { QuoteController } from '../quote/quote.controller';


// Services
import { QuoteService } from '../quote/quote.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { QuoteTemporary } from 'src/shared/models/quote_temporary.model';

@Module({
    imports : [
        TypeOrmModule.forFeature([User, Quote, Car, Permission, QuoteTemporary]),
    ],
    providers : [ QuoteService, UserService, AuthService],
    controllers : [QuoteController]
})
export class QuoteModule {}
