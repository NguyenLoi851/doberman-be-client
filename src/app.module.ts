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
      entities: [User, KYC],
      synchronize: true
    }),
    UsersModule,
    KycModule,
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
