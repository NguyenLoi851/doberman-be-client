import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { createHmac, randomUUID } from "crypto";
import { BigNumberish, ethers, Signer } from "ethers";
import { User } from "src/user/entities/user.entity";
import { Repository, IsNull, Not } from "typeorm";
import { InsertMintUIDSignatureDTO, RequestMintUIDSignatureDTO, SignAllowMintUIDDTO } from "../dtos/kyc.dto";
import { KYC } from "../entities/kyc.entity";
import FormData = require('form-data');

@Injectable()
export class KycService {
    constructor(
        @InjectRepository(KYC) private kycRepository: Repository<KYC>,
        private configService: ConfigService,
    ) { }

    async signAllowMintUID(signAllowMintUID: SignAllowMintUIDDTO) {
        const ADMIN_PRIVATE_KEY = this.configService.get<string>('ADMIN_PRIVATE_KEY');
        const admin = new ethers.Wallet(ADMIN_PRIVATE_KEY)
        const signature = await this.buildMintSignature(
            admin,
            signAllowMintUID.userAddr,
            signAllowMintUID.tokenId,
            signAllowMintUID.expiresAt,
            signAllowMintUID.UIDContractAddr,
            signAllowMintUID.nonce,
            signAllowMintUID.chainId
        );

        await this.kycRepository.upsert(
            [{ address: signAllowMintUID.userAddr.toLowerCase(), mintSignature: signature }],
            ['address']
        )
        const user = await this.findByAddress(signAllowMintUID.userAddr)
        return user
    }

    async insertMintUIDSignature(insertMintUIDSignatureDTO: InsertMintUIDSignatureDTO) {
        await this.kycRepository.upsert(
            [{ address: insertMintUIDSignatureDTO.userAddr.toLowerCase(), mintSignature: insertMintUIDSignatureDTO.mintSignature }],
            ['address']
        )
    }

    async findByAddress(address: string) {
        return await this.kycRepository.findOne({
            where: {
                address: address.toLowerCase()
            }
        })
    }

    private async buildMintSignature(
        signer: Signer,
        userAddr: string,
        tokenId: BigNumberish,
        expiresAt: BigNumberish,
        UIDContractAddr: string,
        nonce: BigNumberish,
        chainId: BigNumberish
    ) {
        const msgHash = ethers.keccak256(
            ethers.solidityPacked(
                ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
                [userAddr, tokenId, expiresAt, UIDContractAddr, nonce, chainId]
            )
        )

        return await signer.signMessage(ethers.getBytes(msgHash))
    }

    async getInfo(address: string) {
        const userInfo = await this.findByAddress(address);
        if (!userInfo || !userInfo.kycId || !userInfo.kycExternalUserId) {
            return { ...userInfo }
        }
        const kycStatus = await this.getKycApplicantStatus(userInfo.kycId, userInfo.kycExternalUserId)
        return { ...userInfo, kycStatus: kycStatus }
    }

    async requestMintUIDSignature(user: User) {
        const entity = await this.findByAddress(user.address.toLowerCase())
        if (!entity) {
            const newEntity = this.kycRepository.create({ address: user.address.toLowerCase() })
            await this.kycRepository.save(newEntity)
        }
    }

    async getRegisterUsers() {
        return await this.kycRepository.find({
            where: {
                mintSignature: IsNull()
            }
        })
    }

    async getAcceptedKYCUsers() {
        return await this.kycRepository.find({
            where: {
                mintSignature: Not(IsNull())
            }
        })
    }

    async requestKycSumSub(user: User) {
        let config: any = {};
        try {
            const kycInfo = await this.getInfo(user.address)
            if (!kycInfo || !kycInfo.kycId) {
                const externalUserId = user.address.slice(2) + randomUUID().replace(/-/gi, '');
                const res = await axios(this.createApplicant(config, externalUserId))
                const kycId = res.data.id

                const accessToken = await axios(this.createAccessToken(config, externalUserId));
                await this.kycRepository.upsert(
                    [{ address: user.address.toLocaleLowerCase(), kycExternalUserId: externalUserId, kycId: kycId }],
                    ['address']
                )
                return accessToken.data
            } else {
                const accessToken = await axios(this.createAccessToken(config, kycInfo.kycExternalUserId));
                return accessToken.data
            }

        } catch (error) {
            console.log('error at request kyc', error);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    createApplicant(config: any, externalUserId: string) {
        const levelName = this.configService.get(
            'SUMSUB_INDIVIDUAL',
            'basic-kyc-level',
        );
        config.baseURL = this.configService.get('SUMSUB_BASE_URL');
        config.url = '/resources/applicants?levelName=' + levelName;
        config.method = 'post';
        let ts = Math.floor(Date.now() / 1000);
        let signature = createHmac(
            'sha256',
            this.configService.get('SUMSUB_SECRET_KEY'),
        );
        signature.update(ts + config.method.toUpperCase() + config.url);

        const body = {
            externalUserId: externalUserId,
        };
        config.data = JSON.stringify(body);
        if (config.data instanceof FormData) {
            signature.update(config.data.getBuffer());
        } else if (config.data) {
            signature.update(config.data);
        }

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Token': this.configService.get('SUMSUB_APP_TOKEN'),
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
        };

        config.headers = headers;
        return config;
    }

    createAccessToken(
        config: any,
        externalUserId: string,
        levelName: string = this.configService.get(
            'SUMSUB_INDIVIDUAL',
            'basic-kyc-level',
        ),
        ttlInSecs: number = this.configService.get('SUMSUB_SIGN_EXPIREST', 600),
    ) {
        config.method = 'post';
        config.baseURL = this.configService.get('SUMSUB_BASE_URL');
        config.url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

        let ts = Math.floor(Date.now() / 1000);
        let signature = createHmac(
            'sha256',
            this.configService.get('SUMSUB_SECRET_KEY'),
        );
        signature.update(ts + config.method.toUpperCase() + config.url);

        const headers = {
            Accept: 'application/json',
            'X-App-Token': this.configService.get('SUMSUB_APP_TOKEN'),
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
        };

        config.headers = headers;
        config.data = null;
        return config;
    }

    async getKycApplicantStatusByAddress(address: string) {
        let config: any = {};
        const kycInfo = await this.getInfo(address)
        const kycId = kycInfo.kycId
        const externalUserId = kycInfo.kycExternalUserId
        try {
            const res = await axios(this.getApplicantStatus(config, kycId, externalUserId))
            const status = res.data.reviewStatus
            return status
        } catch (error) {
            console.log('error at get kyc', error.response.data);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getKycApplicantStatus(kycId: string, externalUserId: string) {
        let config: any = {};
        try {
            const res = await axios(this.getApplicantStatus(config, kycId, externalUserId))
            const status = res.data.reviewStatus
            return status
        } catch (error) {
            console.log('error at get kyc', error.response.data);
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getApplicantStatus(config: any, applicantId: string, externalUserId: string) {
        config.baseURL = this.configService.get('SUMSUB_BASE_URL');
        config.url = `/resources/applicants/${applicantId}/status`
        config.method = 'get'
        let ts = Math.floor(Date.now() / 1000);
        let signature = createHmac(
            'sha256',
            this.configService.get('SUMSUB_SECRET_KEY'),
        );
        signature.update(ts + config.method.toUpperCase() + config.url);

        const body = {
            externalUserId: externalUserId,
        };
        config.data = JSON.stringify(body);
        if (config.data instanceof FormData) {
            signature.update(config.data.getBuffer());
        } else if (config.data) {
            signature.update(config.data);
        }
        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-App-Token': this.configService.get('SUMSUB_APP_TOKEN'),
            'X-App-Access-Ts': ts.toString(),
            'X-App-Access-Sig': signature.digest('hex'),
        };

        config.headers = headers;
        return config;
    }
}
