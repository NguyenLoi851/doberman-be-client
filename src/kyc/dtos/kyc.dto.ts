import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignAllowMintUIDDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        required: true,
        example: '0x0000000000000000000000000000000000000000'
    })
    userAddr: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 1,
    })
    tokenId: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 2000000000,
    })
    expiresAt: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: '0x0000000000000000000000000000000000000000',
    })
    UIDContractAddr: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 1,
    })
    nonce: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 1,
    })
    chainId: number;
}