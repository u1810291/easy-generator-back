import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { TokenPayload } from '../../../domain/model/auth'
import { LoggerService } from '../../logger/logger.service'
import { ExceptionsService } from '../../exceptions/exceptions.service'
import { Symbols } from '../../../domain/symbols'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: EnvironmentConfigService,
    @Inject(Symbols.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh
        },
      ]),
      secretOrKey: configService.getJwtRefreshSecret(),
      passReqToCallback: true,
    })
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.cookies?.Refresh
    const user = this.loginUseCaseProxy.getInstance().getUserIfRefreshTokenMatches(refreshToken, payload.email)
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found or hash not correct`)
      this.exceptionService.UnauthorizedException({ message: 'User not found or hash not correct' })
    }
    return user
  }
}
