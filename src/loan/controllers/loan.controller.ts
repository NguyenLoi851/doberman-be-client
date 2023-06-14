import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { ApplyNewLoanDTO, DeployLoanDTO, UpdateLoanDTO } from "../dtos/loan.dto";
import { LoanService } from "../services/loan.service";

@ApiTags('Loans')
@Controller('loans')
export class LoanController {
    constructor(private loanService: LoanService) { }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('apply')
    async applyNewLoan(@Req() req: any, @Body() applyNewLoanDTO: ApplyNewLoanDTO) {
        return await this.loanService.applyNewLoan(req.user, applyNewLoanDTO);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('update/:id')
    async updateLoanById(@Req() req: any, @Param('id') id: number, @Body() updateLoanDTO: UpdateLoanDTO) {
        return await this.loanService.updateLoanById(req.user, id, updateLoanDTO);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Post('delete/:id')
    async deleteLoanById(@Req() req: any, @Param('id') id: number) {
        return await this.loanService.deleteLoanById(req.user, id);
    }

    @Put('deploy/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    // @Roles(Role.Admin)
    async updateDeployStatus(@Param('id') id: number, @Body() deployLoanDTO: DeployLoanDTO) {
        return await this.loanService.updateDeployStatus(id, deployLoanDTO)
    }

    @Get('deployed')
    async getDeployedLoans() {
        return await this.loanService.getDeployedLoans()
    }

    @Get('deployed/:address')
    async getDeployedLoansByOwnerAddress(@Param('address') address: string) {
        return await this.loanService.getDeployedLoansByOwnerAddress(address)
    }

    @Get('undeployed')
    async getUndeployedLoans() {
        return await this.loanService.getUndeployedLoans();
    }

    @Get('undeployed/:address')
    async getUndeployedLoansByOwnerAddress(@Param('address') address: string) {
        return await this.loanService.getUndeployedLoansByOwnerAddress(address)
    }

    // @Get(':id')
    // async getLoanById(@Param('id') id: number) {
    //     return await this.loanService.getLoanById(id)
    // }

    // @Get(':address')
    // async getLoansByOwnerAddress(@Param('address') address: string) {
    //     return await this.loanService.getLoansByOwnerAddress(address)
    // }

    @Get('getLoanByFilter')
    async getLoanByFilter(@Query() params: any) {
        if (params.id) return await this.loanService.getLoanById(params.id);
        if (params.address) return await this.loanService.getLoansByOwnerAddress(params.address);
        if (params.txHash) return await this.loanService.getLoanByTxHash(params.txHash);
    }

    @Get('')
    async getAllLoans() {
        return await this.loanService.getAllLoans()
    }
}
