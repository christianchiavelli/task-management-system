import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { AuthenticatedUser } from './auth.interfaces';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/user.entity';

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    return requiredRoles.some((role) => String(user?.role) === String(role));
  }
}
