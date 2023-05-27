import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserSignDTO } from "../dtos/users.dto";
import { UsersService } from "../services/users.service";

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
