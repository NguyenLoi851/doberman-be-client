import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsLowercase, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class LinkProxyDTO {
    @IsString()
    @IsNotEmpty()
    @IsLowercase()
    @ApiProperty({
        required: true,
        example: '0x0000000000000000000000000000000000000000',
    })
    userAddress: string;
}
