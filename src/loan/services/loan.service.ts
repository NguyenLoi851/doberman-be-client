import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";
import { ApplyNewLoanDTO, DeployLoanDTO, UpdateLoanDTO } from "../dtos/loan.dto";
import { LoanRepository } from "../repositories/loan.repository";
import { Upload } from "@aws-sdk/lib-storage";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from 'uuid';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LoanService {
    constructor(
        private loanRepository: LoanRepository,
        private configService: ConfigService,
    ) { }

    async applyNewLoan(user: User, applyNewLoanDTO: ApplyNewLoanDTO, fileKey: string) {
        try {
            const newLoan = this.loanRepository.create({ ...applyNewLoanDTO, ownerAddress: user.address, deployed: false, fileKey })
            await this.loanRepository.save(newLoan)
        } catch (error) {
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateLoanById(user: User, loanId: number, updateLoanDTO: UpdateLoanDTO, fileKey: string) {
        let loan = await this.loanRepository.findOneBy({ id: loanId })
        if (!loan) {
            throw new HttpException('Loan is not exist', HttpStatus.BAD_REQUEST)
        }
        if (user.address != loan.ownerAddress) {
            throw new HttpException('Not owner of loan', HttpStatus.FORBIDDEN)
        }
        if (loan.deployed) {
            throw new HttpException('Not allow to update after deployed', HttpStatus.BAD_REQUEST)
        }
        if (fileKey != '') {
            await this.loanRepository.update(loanId, { ...updateLoanDTO, fileKey })
        } else {
            await this.loanRepository.update(loanId, { ...updateLoanDTO })
        }
    }

    async deleteLoanById(user: User, loanId: number) {
        let loan = await this.loanRepository.findOneBy({ id: loanId })
        if (!loan) {
            throw new HttpException('Loan is not exist', HttpStatus.BAD_REQUEST)
        }
        if (user.address != loan.ownerAddress) {
            throw new HttpException('Not owner of loan', HttpStatus.FORBIDDEN)
        }
        if (loan.deployed) {
            throw new HttpException('Not allow to delete after deployed', HttpStatus.BAD_REQUEST)
        }
        await this.loanRepository.delete(loanId);
    }

    async getLoanById(loanId: number) {
        let loan = await this.loanRepository.findOneBy({ id: loanId })
        if (!loan) {
            throw new HttpException('Loan is not exist', HttpStatus.BAD_REQUEST)
        }
        return loan;
    }

    async getLoansByOwnerAddress(ownerAddress: string) {
        let loans = await this.loanRepository.find({
            where: {
                ownerAddress: ownerAddress
            }
        })
        return {
            loans: loans
        }
    }

    async getLoanByTxHash(txHash: string) {
        let loan = await this.loanRepository.findOne({
            where: {
                txHash: txHash
            }
        })
        return loan
    }

    async getAllLoans() {
        let loans = await this.loanRepository.find();
        return {
            loans: loans
        }
    }

    async updateDeployStatus(loanId: number, deployLoanDTO: DeployLoanDTO) {
        const loan = await this.getLoanById(loanId);
        if (loan.deployed) {
            throw new HttpException('Already deployed', HttpStatus.BAD_REQUEST);
        }
        await this.loanRepository.update(loanId, { ...loan, deployed: true, txHash: deployLoanDTO.txHash })
    }

    async getDeployedLoansByOwnerAddress(ownerAddress: string) {
        let loans = await this.loanRepository.find({
            where: {
                ownerAddress: ownerAddress,
                deployed: true
            }
        })

        return {
            loans: loans
        }
    }

    async getDeployedLoans() {
        let loans = await this.loanRepository.find({
            where: {
                deployed: true
            }
        })
        return {
            loans: loans
        }
    }

    async getUndeployedLoansByOwnerAddress(ownerAddress: string) {
        let loans = await this.loanRepository.find({
            where: {
                ownerAddress: ownerAddress,
                deployed: false
            }
        })
        return {
            loans: loans
        }
    }

    async getUndeployedLoans() {
        let loans = await this.loanRepository.find({
            where: {
                deployed: false
            }
        })
        return {
            loans: loans
        }
    }

    async uploadFile(dataBuffer: Buffer, fileName: string) {
        const s3Client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.getOrThrow('AWS_S3_KEY_SECRET'),
            },
        });
        const uuidKey = uuid()
        const command = new PutObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: `${uuidKey}-${fileName}`,
            Body: dataBuffer,
        })

        const fileKey = command.input.Key
        const uploadResult = await s3Client.send(command);
        return fileKey;
    }

    async deleteFileById(loanId: number) {
        const loan = await this.getLoanById(loanId);
        const oldFileKey = loan.fileKey
        await this.deleteFile(oldFileKey)
    }

    async deleteFile(fileKey: string) {
        const s3Client = new S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow('AWS_S3_ACCESS_KEY'),
                secretAccessKey: this.configService.getOrThrow('AWS_S3_KEY_SECRET'),
            },
        });

        const command = new DeleteObjectCommand({
            Bucket: this.configService.getOrThrow('AWS_S3_BUCKET_NAME'),
            Key: fileKey
        })

        await s3Client.send(command)
    }
}
