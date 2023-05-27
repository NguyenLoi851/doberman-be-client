import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserSignDTO } from "../dtos/users.dto";
import { User } from "../entities/users.entity";
import { ethers } from 'ethers';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private configService: ConfigService,
    ) { }

    async verifySignature(userSignDTO: UserSignDTO) {
        // validate timestamp
        const currentTime = Math.round(Date.now()/1000)
        if(currentTime - userSignDTO.timestamp > this.configService.get('SIG_EXPIRES_IN')) {
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
            await this.userRepository.upsert(
                [{ address: recoverAddress.toLowerCase() }],
                ['address']
            )
            const user = await this.findByAddress(recoverAddress.toLowerCase())
            return user;
        } catch (error) {
            console.log('error at verifySignature', error);
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findByAddress(address: string) {
        return await this.userRepository.findOne({where:{
            address: address
        }})
    }
}
