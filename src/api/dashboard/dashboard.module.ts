// Nest modules
import { Module }              from '@nestjs/common';
import { TypeOrmModule }       from '@nestjs/typeorm';
import { JwtModule }           from '@nestjs/jwt';
import { PassportModule }      from '@nestjs/passport';

// Entities
import { User }                from '../../shared/models/user.model';

// Controllers
import { DashboardController }     from './dashboard.controller';

// Services
import { DashboardService }        from './dashboard.service';
import { Quote } from '../../shared/models/quote.model';
import { Permission } from '../../shared/models/permission.model';
import { Bill } from '../../shared/models/bill.model';
import { Insurance } from '../../shared/models/insurance.model';
import { ContractService } from '../contract/contract.service';
import { ContractController } from '../contract/contract.controller';
import { Car } from '../../shared/models/car.model';
import { Damage } from '../../shared/models/damage_report.model';


@Module({
  imports     : [
    TypeOrmModule.forFeature([ User, Quote, Permission, Bill, Insurance, Car, Damage ]), //les models utilisee a l'interieur

    PassportModule.register({ session: false,defaultStrategy : 'jwt' }),
  ],
  
  providers   : [ DashboardService, ContractService ],
  controllers : [ DashboardController, ContractController ],
})
export class DashboardModule {}