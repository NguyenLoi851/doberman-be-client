import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { SignAllowMintUIDDTO } from "../dtos/kyc.dto";
import { KycService } from "../services/kyc.service";

@ApiTags('Kyc')
@Controller('kyc')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Roles(Role.Admin)
export class KycController {
    constructor(private kycService: KycService) {}

    @Post('signAllowMintUID')
    async signAllowMintUID(@Req() req: any, @Body() signAllowMintUID: SignAllowMintUIDDTO){
        console.log('req.user', req.user)
        return this.kycService.signAllowMintUID(signAllowMintUID)
    }
}