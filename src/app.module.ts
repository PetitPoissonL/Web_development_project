import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontController } from './front/front.controller';
import { getEnvPath } from './common/helper/env.helper';
// import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';

// import { ApiModule } from './api/api.module';
// import { QuoteModule } from './api/quote/quote.module';

import { UserModule }  from './api/user/user.module';
import { AuthModule }  from './api/auth/auth.module';
import { FrontModule } from './front/front.module';
import { User } from './shared/models/user.model';
import { Permission } from './shared/models/permission.model';
import { Car } from './shared/models/car.model';
import { Insurance } from './shared/models/insurance.model';
// import { Payment } from './shared/models/payment.model';
import { Bill } from './shared/models/bill.model';
import { Quote } from './shared/models/quote.model';

import { DashboardModule } from './api/dashboard/dashboard.module';
import { QuoteModule } from './api/quote/quote.module';
import { QuoteTemporary } from './shared/models/quote_temporary.model';
import { ContractModule } from './api/contract/contract.module';
import { Damage } from './shared/models/damage_report.model';

// npm i @nestjs/jwt
// npm i @nestjs/passport
// npm i passport
// npm i passport-jwt

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
// const envFilePath: string = getEnvPath(`${__dirname}/../src/shared/envs`);
console.log(envFilePath)

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // in stead of using class, we use object : 

    // ces variables de configuration de typeorm
    // servent à NestJS pour que le serveur (node) API
    // se connecte à la base et charge les models/entités
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      inject  : [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // type: 'postgres',
        // host: 'localhost',
        // port: 5432,
        // database: 'poca',
        // username: 'postgres',
        // password: 'test',

        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        database: configService.get<string>('DATABASE_NAME'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        
        entities    :
        [
          // Models : entités
          User,
          Permission,
          Car,
          Insurance,
          // Payment, 
          Bill,
          Quote,
          QuoteTemporary,
          Damage
        ],
        synchronize : true,
      }),
    }),

    // ApiModule,  // for test
    // QuoteModule, // for test

    // Mes modules : routes et services
    // Une fois qu'on a cree le module, il faut l'ajouter ici
    UserModule,
    AuthModule,
    FrontModule,
    DashboardModule,
    QuoteModule,
    ContractModule
  ],
  // on charge un module qui charge les routes
  controllers: [],
  providers: [],
})
export class AppModule {}
