import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserSignDTO {
    @IsString()
    @IsLowercase()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: '0x0000000000000000000000000000000000000000',
    })
    address: string;
  
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
    })
    sign: string;
  
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 1676362449,
    })
    timestamp: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      example: 1,
    })
    chainId: number;
  }