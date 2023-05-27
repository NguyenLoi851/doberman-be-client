import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserSignDTO } from "../dtos/user.dto";
import { UsersService } from "../services/user.service";

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get('profile')
    async getProfile(@Req() req: any){
        return {
            ...req.user
        }
    }
}
