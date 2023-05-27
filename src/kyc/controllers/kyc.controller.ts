import { Controller, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";

@ApiTags('Kyc')
@Controller('kyc')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Roles(Role.Admin)
export class KycController {
    constructor() {}
}