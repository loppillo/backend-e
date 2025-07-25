// jwt.strategy.ts

import { Injectable } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // El payload debe contener los campos que firmaste en el token
    return { 
      userId: payload.sub, 
      username: payload.username, 
      role: payload.role, 
      regionId: payload.regionId,
    };
  }
}
