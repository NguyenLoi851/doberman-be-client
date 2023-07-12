import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Frequency } from "src/enums/frequency.enum";

export class ApplyNewLoanDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Company\'s name',
    })
    companyName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Company\'s intro',
    })
    companyIntro: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Company\'s webpage',
    })
    companyPage: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Company\'s contact',
    })
    companyContact: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Project\'s name',
    })
    projectName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 'Project\'s intro',
    })
    projectIntro: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 15,
    })
    juniorFeePercent: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 10000,
    })
    targetFunding: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: '10000',
    })
    interestRate: number;

    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: Frequency.QUARTERLY,
    })
    interestPaymentFrequency: Frequency;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 1,
    })
    loanTerm: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: 1700000000,
    })
    fundableAt: number;
}
export class UpdateLoanDTO {
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Company\'s name',
    })
    companyName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Company\'s intro',
    })
    companyIntro: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Company\'s webpage',
    })
    companyPage: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Company\'s contact',
    })
    companyContact: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Project\'s name',
    })
    projectName: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 'Project\'s intro',
    })
    projectIntro: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 15,
    })
    juniorFeePercent: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 10000,
    })
    targetFunding: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: '10000',
    })
    interestRate: number;

    @IsOptional()
    @ApiProperty({
        required: true,
        example: Frequency.QUARTERLY,
    })
    interestPaymentFrequency: Frequency;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 1,
    })
    loanTerm: number;

    @IsNumber()
    @IsOptional()
    @ApiProperty({
        required: true,
        example: 1700000000,
    })
    fundableAt: number;

    @IsString()
    @IsOptional()
    oldFileKeyMerge: string;
}

export class DeployLoanDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: '0x0000000000000000000000000000000000000000000000000000000000000000',
    })
    txHash: string;
}
