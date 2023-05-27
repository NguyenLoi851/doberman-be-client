import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';
import { UserSignDTO } from '../dtos/users.dto';
import { UsersService } from './users.service';
import fromAuthHeaderWithScheme = ExtractJwt.fromAuthHeaderWithScheme;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async signIn(userSignDTO: UserSignDTO) {
    const user = await this.userService.verifySignature(userSignDTO);
    const token = await this._createToken(user);
    return {
      address: user.address,
      ...token,
    };
  }

  async validateUser(address: string) {
    const user = await this.userService.findByAddress(address);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async _createToken(
    { address }) {
    const accessToken = this.jwtService.sign({
      address: address.toLowerCase()
    });
    return {
      expiresIn: process.env.EXPIRES_IN,
      accessToken,
    };
  }
}
