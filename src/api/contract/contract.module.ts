import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Quote } from 'src/shared/models/quote.model';
import { Insurance } from '../../shared/models/insurance.model'

// Controllers
import { ContractController } from '../contract/contract.controller';


// Services
import { QuoteService } from '../quote/quote.service';
import { ContractService } from '../contract/contract.service';
import { Bill } from 'src/shared/models/bill.model';
import { DashboardController } from '../dashboard/dashboard.controller';
import { QuoteController } from '../quote/quote.controller';
import { Car } from '../../shared/models/car.model';
import { Permission } from '../../shared/models/permission.model';

@Module({
    imports : [
        TypeOrmModule.forFeature([ Insurance, Quote, Car, Permission ]),
    ],
    providers : [ ContractService],
    controllers : [ ContractController]
})
export class ContractModule {}