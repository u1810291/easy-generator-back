import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { Request } from 'express'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { ExceptionsService } from '../../exceptions/exceptions.service'
import { LoggerService } from '../../logger/logger.service'
import { Symbols } from '../../../domain/symbols'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: any) {
    const user = this.loginUseCaseProxy.getInstance().validateUserForJWTStrategy(payload.email)
    if (!user) {
      this.logger.warn('JwtStrategy', `User not found`)
      this.exceptionService.UnauthorizedException({ message: 'User not found' })
    }
    return user
  }
}
