import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProxyController } from "./controllers/proxy.controller";
import { Proxy } from "./entities/proxy.entity";
import { ProxyService } from "./services/proxy.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Proxy]),
    ],
    controllers: [
        ProxyController,
    ],
    providers: [
        ProxyService,
    ]
})

export class ProxyModule { }