import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Inject, Injectable } from '@nestjs/common'
import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { LoggerService } from '../../logger/logger.service'
import { ExceptionsService } from '../../exceptions/exceptions.service'
import { Symbols } from '../../../domain/symbols'
// import { TokenPayload } from '../../../domain/model/auth'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Symbols.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
  ) {
    super()
  }

  async validate(username: string, password: string) {
    if (!username || !password) {
      this.logger.warn('LocalStrategy', `Username or password is missing, BadRequestException`)
      this.exceptionService.UnauthorizedException()
    }
    const user = await this.loginUseCaseProxy.getInstance().validateUserForLocalStrategy(username, password)
    if (!user) {
      this.logger.warn('LocalStrategy', `Invalid username or password`)
      this.exceptionService.UnauthorizedException({ message: 'Invalid username or password.' })
    }
    return user
  }
}
