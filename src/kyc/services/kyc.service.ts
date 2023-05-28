import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { BigNumberish, ethers, Signer } from "ethers";
import { Repository } from "typeorm";
import { SignAllowMintUIDDTO } from "../dtos/kyc.dto";
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
        return signature;
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

        return await signer.signMessage(ethers.toUtf8Bytes(msgHash))
    }
}