import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesGuard } from "src/guards/roles.guard";
import { UserRepository } from "src/user/repositories/user.repository";
import { UsersService } from "src/user/services/user.service";
import { KycController } from "./controllers/kyc.controller";
import { KYC } from "./entities/kyc.entity";
import { KycService } from "./services/kyc.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([KYC]),
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
    ],
    controllers: [
        KycController
    ],
    providers: [
        KycService,
        JwtService,
        UsersService,
        UserRepository,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ]
})

export class KycModule { }
