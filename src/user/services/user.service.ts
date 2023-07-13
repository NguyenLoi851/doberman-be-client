import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSignDTO } from "../dtos/user.dto";
import { User } from "../entities/user.entity";
import { ethers } from 'ethers';
import { ConfigService } from "@nestjs/config";
import { Role } from "src/enums/role.enum";
import { UserRepository } from "../repositories/user.repository";
import { randomUUID, createHmac } from "crypto";
import axios from "axios";
import FormData = require('form-data');
@Injectable()
export class UsersService {
    constructor(
        // @InjectRepository(User) private userRepository: Repository<User>,
        private userRepository: UserRepository,
        private configService: ConfigService,
    ) { }

    async verifySignature(userSignDTO: UserSignDTO) {
        // validate timestamp
        const currentTime = Math.round(Date.now() / 1000)
        if (currentTime - userSignDTO.timestamp > this.configService.get('SIG_EXPIRES_IN')) {
            throw new HttpException('sign.time.invalid', HttpStatus.BAD_REQUEST)
        }

        // verify message
        const recoverAddress = ethers.verifyMessage(
            `${this.configService.get<string>('APP_ID', 'doberman')}#${userSignDTO.timestamp}#${userSignDTO.chainId}`,
            userSignDTO.sign,
        );
        if (recoverAddress.toLowerCase() != userSignDTO.address.toLowerCase()) {
            throw new HttpException('sign.invalid', HttpStatus.BAD_REQUEST)
        }

        // upsert user into db
        try {
            let user = await this.findByAddress(recoverAddress.toLowerCase())
            if (!user) {
                await this.userRepository.insert({ address: recoverAddress.toLowerCase(), role: Role.User })
            }
            user = await this.findByAddress(recoverAddress.toLowerCase())

            return user;
        } catch (error) {
            console.log('error at verifySignature', error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyAdminSignature(userSignDTO: UserSignDTO) {
        // // validate timestamp
        // const currentTime = Math.round(Date.now()/1000)
        // if(currentTime - userSignDTO.timestamp > this.configService.get('SIG_EXPIRES_IN')) {
        //     throw new HttpException('sign.time.invalid', HttpStatus.BAD_REQUEST)
        // }

        // verify message
        const recoverAddress = ethers.verifyMessage(
            `${this.configService.get<string>('APP_ID', 'doberman')}#${userSignDTO.timestamp}#${userSignDTO.chainId}`,
            userSignDTO.sign,
        );
        if (recoverAddress.toLowerCase() != userSignDTO.address.toLowerCase()) {
            throw new HttpException('sign.invalid', HttpStatus.BAD_REQUEST)
        }

        // upsert user into db
        try {
            let user = await this.findByAddress(recoverAddress.toLowerCase())
            if (!user || user.role != Role.Admin) {
                throw new HttpException('Not system\'s admin', HttpStatus.FORBIDDEN);
            }

            return user;
        } catch (error) {
            console.log('error at verifyAdminSignature', error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByAddress(address: string) {
        return await this.userRepository.findOne({
            where: {
                address: address.toLowerCase()
            }
        })
    }

    // async requestKycSumSub(user: User) {
    //     let config: any = {};
    //     const externalUserId = user.address.slice(2) + randomUUID().replace(/-/gi, '');
    //     try {
    //         const resApp = await axios(this.createApplicant(config, externalUserId))
    //         console.log("resApp", resApp)
    //         const accessToken = await axios(this.createAccessToken(config, externalUserId));
    //         return accessToken.data
    //     } catch (error) {
    //         console.log('error at request kyc', error.response.data);
    //         throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    // }

    // createAccessToken(
    //     config: any,
    //     externalUserId: string,
    //     levelName: string = this.configService.get(
    //         'SUMSUB_INDIVIDUAL',
    //         'basic-kyc-level',
    //     ),
    //     ttlInSecs: number = this.configService.get('SUMSUB_SIGN_EXPIREST', 600),
    // ) {
    //     config.method = 'post';
    //     config.baseURL = this.configService.get('SUMSUB_BASE_URL');
    //     config.url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

    //     let ts = Math.floor(Date.now() / 1000);
    //     let signature = createHmac(
    //         'sha256',
    //         this.configService.get('SUMSUB_SECRET_KEY'),
    //     );
    //     signature.update(ts + config.method.toUpperCase() + config.url);

    //     const headers = {
    //         Accept: 'application/json',
    //         'X-App-Token': this.configService.get('SUMSUB_APP_TOKEN'),
    //         'X-App-Access-Ts': ts.toString(),
    //         'X-App-Access-Sig': signature.digest('hex'),
    //     };

    //     config.headers = headers;
    //     config.data = null;
    //     return config;
    // }

    // createApplicant(config: any, externalUserId: string) {
    //     const levelName = this.configService.get(
    //         'SUMSUB_INDIVIDUAL',
    //         'basic-kyc-level',
    //     );
    //     config.baseURL = this.configService.get('SUMSUB_BASE_URL');
    //     config.url = '/resources/applicants?levelName=' + levelName;
    //     config.method = 'post';
    //     let ts = Math.floor(Date.now() / 1000);
    //     let signature = createHmac(
    //         'sha256',
    //         this.configService.get('SUMSUB_SECRET_KEY'),
    //     );
    //     signature.update(ts + config.method.toUpperCase() + config.url);

    //     const body = {
    //         externalUserId: externalUserId,
    //     };
    //     config.data = JSON.stringify(body);
    //     if (config.data instanceof FormData) {
    //         signature.update(config.data.getBuffer());
    //     } else if (config.data) {
    //         signature.update(config.data);
    //     }

    //     const headers = {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         'X-App-Token': this.configService.get('SUMSUB_APP_TOKEN'),
    //         'X-App-Access-Ts': ts.toString(),
    //         'X-App-Access-Sig': signature.digest('hex'),
    //     };

    //     config.headers = headers;
    //     return config;
    // }
}
