import { DynamicModule, Module } from '@nestjs/common'
import { GetUserByUsername } from '../../usecases/user/GetUserByUsername.usecase'

import { ExceptionsModule } from '../exceptions/exceptions.module'
import { LoggerModule } from '../logger/logger.module'
import { LoggerService } from '../logger/logger.service'

import { BcryptModule } from '../services/bcrypt/bcrypt.module'
import { BcryptService } from '../services/bcrypt/bcrypt.service'
import { JwtModule } from '../services/jwt/jwt.module'
import { JwtTokenService } from '../services/jwt/jwt.service'
import { RepositoriesModule } from '../repositories/repositories.module'

import { DatabaseUserRepository } from '../repositories/user.repository'

import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module'
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service'
import { UseCaseProxy } from './usecases-proxy'
import { LoginUseCases } from '../../usecases/auth/login.usecases'
import { LogoutUseCases } from '../../usecases/auth/logout.usecases'
import { RegisterUseCases } from '../../usecases/auth/register.usecases'
import { IsAuthenticatedUseCases } from '../../usecases/auth/isAuthenticated.usecases'
import { Symbols } from '../../domain/symbols'

@Module({
  imports: [LoggerModule, JwtModule, BcryptModule, EnvironmentConfigModule, RepositoriesModule, ExceptionsModule],
})
export class UseCasesProxyModule {
  static register(): DynamicModule {
    return {
      module: UseCasesProxyModule,
      providers: [
        {
          inject: [LoggerService, JwtTokenService, EnvironmentConfigService, DatabaseUserRepository, BcryptService],
          provide: Symbols.REGISTER_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new RegisterUseCases()),
        },
        {
          inject: [LoggerService, JwtTokenService, EnvironmentConfigService, DatabaseUserRepository, BcryptService],
          provide: Symbols.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: DatabaseUserRepository,
            bcryptService: BcryptService,
          ) => new UseCaseProxy(new LoginUseCases(logger, jwtTokenService, config, userRepo, bcryptService)),
        },
        {
          inject: [DatabaseUserRepository],
          provide: Symbols.IS_AUTHENTICATED_USECASES_PROXY,
          useFactory: (userRepo: DatabaseUserRepository) => new UseCaseProxy(new IsAuthenticatedUseCases(userRepo)),
        },
        {
          inject: [],
          provide: Symbols.LOGOUT_USECASES_PROXY,
          useFactory: () => new UseCaseProxy(new LogoutUseCases()),
        },
        {
          inject: [LoggerService, DatabaseUserRepository],
          provide: Symbols.GET_USER_BY_USERNAME_USECASES_PROXY,
          useFactory: (logger: LoggerService, userRepository: DatabaseUserRepository) =>
            new UseCaseProxy(new GetUserByUsername(logger, userRepository)),
        },
      ],
      exports: [
        Symbols.LOGIN_USECASES_PROXY,
        Symbols.LOGOUT_USECASES_PROXY,
        Symbols.REGISTER_USECASES_PROXY,
        Symbols.IS_AUTHENTICATED_USECASES_PROXY,
      ],
    }
  }
}
