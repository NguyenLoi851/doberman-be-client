import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSignDTO } from '../dtos/users.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  @ApiOperation({ summary: `Sign in API` })
  async signIn(@Body() userSignDTO: UserSignDTO) {
    return await this.authService.signIn(userSignDTO);
  }

}