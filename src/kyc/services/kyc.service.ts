import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { BigNumberish, ethers, Signer } from "ethers";
import { User } from "src/user/entities/user.entity";
import { Repository, IsNull, Not } from "typeorm";
import { InsertMintUIDSignatureDTO, RequestMintUIDSignatureDTO, SignAllowMintUIDDTO } from "../dtos/kyc.dto";
import { KYC } from "../entities/kyc.entity";

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
            [{address: signAllowMintUID.userAddr.toLowerCase(), mintSignature: signature}],
            ['address']
        )
        const user = await this.findByAddress(signAllowMintUID.userAddr)
        return user
    }

    async insertMintUIDSignature(insertMintUIDSignatureDTO: InsertMintUIDSignatureDTO) {
        await this.kycRepository.upsert(
            [{address: insertMintUIDSignatureDTO.userAddr.toLowerCase(), mintSignature: insertMintUIDSignatureDTO.mintSignature}],
            ['address']
        )
    }

    async findByAddress(address: string) {
        return await this.kycRepository.findOne({where:{
            address: address.toLowerCase()
        }})
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
        const userInfo =  this.findByAddress(address);

        return userInfo
    }

    async requestMintUIDSignature(user: User) {
        const entity = await this.findByAddress(user.address.toLowerCase())
        if(!entity) {
            const newEntity = this.kycRepository.create({address: user.address.toLowerCase()})
            await this.kycRepository.save(newEntity)
        }
    }

    async getRegisterUsers(){
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
}
