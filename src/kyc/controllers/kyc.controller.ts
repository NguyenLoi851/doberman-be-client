import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { InsertMintUIDSignatureDTO, RequestMintUIDSignatureDTO, SignAllowMintUIDDTO } from "../dtos/kyc.dto";
import { KycService } from "../services/kyc.service";

@ApiTags('Kyc')
@Controller('kyc')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class KycController {
    constructor(private kycService: KycService) {}
    @Roles(Role.Admin)
    @Post('signAllowMintUID')
    async signAllowMintUID(@Req() req: any, @Body() signAllowMintUID: SignAllowMintUIDDTO){
        return this.kycService.signAllowMintUID(signAllowMintUID)
    }

    @Roles(Role.Admin)
    @Post('insertMintUIDSignature')
    async insertMintUIDSignature(@Body() insertMintUIDSignatureDTO: InsertMintUIDSignatureDTO) {
        return await this.kycService.insertMintUIDSignature(insertMintUIDSignatureDTO)
    }

    @Get('info')
    async getInfo(@Req() req: any){
        return this.kycService.getInfo(req.user.address);
    }

    @Post('requestMintUIDSignature')
    async requestMintUIDSignature(@Req() req: any) {
        return await this.kycService.requestMintUIDSignature(req.user)
    }

    @Roles(Role.Admin)
    @Get('register-users')
    async getRegisterUsers(){
        return await this.kycService.getRegisterUsers()
    }

    @Roles(Role.Admin)
    @Get('accepted-kyc-users')
    async getAcceptedKYCUsers(){
        return await this.kycService.getAcceptedKYCUsers()
    }
}
