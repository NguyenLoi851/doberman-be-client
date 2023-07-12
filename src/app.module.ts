import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesGuard } from './guards/roles.guard';
import { KYC } from './kyc/entities/kyc.entity';
import { KycModule } from './kyc/kyc.module';
import { LegalDocument } from './loan/entities/legalDocument.entity';
import { Loan } from './loan/entities/loan.entity';
import { LoanModule } from './loan/loan.module';
import { Proxy } from './proxy/entities/proxy.entity';
import { ProxyModule } from './proxy/proxy.module';
import { User } from './user/entities/user.entity';
import { UserRepository } from './user/repositories/user.repository';
import { UsersService } from './user/services/user.service';
import { UsersModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root-pw',
      database: 'doberman-db',
      entities: [User, KYC, Proxy, Loan, LegalDocument],
      synchronize: true
    }),
    UsersModule,
    KycModule,
    ProxyModule,
    LoanModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    UsersService,
    UserRepository,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
