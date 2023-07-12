import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesGuard } from "src/guards/roles.guard";
import { UserRepository } from "src/user/repositories/user.repository";
import { UsersService } from "src/user/services/user.service";
import { LoanController } from "./controllers/loan.controller";
import { LegalDocument } from "src/loan/entities/legalDocument.entity";
import { Loan } from "src/loan/entities/loan.entity";
import { LoanRepository } from "./repositories/loan.repository";
import { LoanService } from "./services/loan.service";
import { LegalDocumentRepository } from "./repositories/legalDocument.repository";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Loan, LegalDocument]),
        PassportModule.register({
            defaultStrategy: 'jwt',
            property: 'user',
            session: false,
        }),
    ],
    controllers: [
        LoanController,
    ],
    providers: [
        LoanService,
        LoanRepository,
        LegalDocumentRepository,
        JwtService,
        UsersService,
        UserRepository,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ]
})

export class LoanModule { }