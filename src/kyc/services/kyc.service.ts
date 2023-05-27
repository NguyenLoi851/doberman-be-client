import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignAllowMintUIDDTO } from "../dtos/kyc.dto";
import { KYC } from "../entities/kyc.entity";

@Injectable()
export class KycService {
    constructor(
        @InjectRepository(KYC) private kycRepository: Repository<KYC>
    ){}

    async signAllowMintUID(signAllowMintUID: SignAllowMintUIDDTO) {
        
    }
}