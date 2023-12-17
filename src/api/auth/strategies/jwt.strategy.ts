// Nest modules
import { Injectable }            from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy }      from '@nestjs/passport';

// External modules
import { ExtractJwt }            from 'passport-jwt';
import { Strategy }              from 'passport-jwt';
import { Request as RequestType } from 'express';

// Interfaces
import { JwtPayload }            from '../interfaces/jwt-payload.interface';

// Services
import { AuthService }           from '../auth.service';

// Entities
import { User }                  from '../../../shared/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
  constructor(private readonly authService : AuthService)
  {
    super({
      // extract token et put it in a cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration : false,
      secretOrKey      : 'JWT_SECRET_KEY', //un secret pour ne pas quitter le serveur, on met ce qu'on veut
    });
  }

  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'token' in req.cookies &&
      req.cookies.token.length > 0
    ) {
      return req.cookies.token;
    }
    return null;
  }

  async validate(payload : JwtPayload) : Promise<User>
  {
    // recuperer le token qui nous permet de recuperer user
    const user = await this.authService.validateUser(payload);
    if (!user)
    {
      throw new UnauthorizedException();
    }
    return user;
  }
}
