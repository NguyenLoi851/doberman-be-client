import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { UsersService } from 'src/user/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization;
    
    if (!bearerToken || !requiredRoles) {
      return true;
    }
    const token = bearerToken.split(' ')[1]
    const payload: any = this.jwtService.decode(token)
    const address = payload.address
    console.log(address)
    const user = await this.userService.findByAddress(address);
    console.log(user);
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}