import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import configuration from './infrastructure/config'
import { LoggerModule } from './infrastructure/logger/logger.module'
import { JwtStrategy } from './infrastructure/common/strategies/jwt.strategy'
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module'
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module'
import { LocalStrategy } from './infrastructure/common/strategies/local.strategy'
import { ControllersModule } from './infrastructure/controllers/controllers.module'
import { JwtModule as JwtServiceModule } from './infrastructure/services/jwt/jwt.module'
import { UseCasesProxyModule } from './infrastructure/usecases-proxy/usecases-proxy.module'
import { JwtRefreshTokenStrategy } from './infrastructure/common/strategies/jwtRefresh.strategy'
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    LoggerModule,
    ExceptionsModule,
    UseCasesProxyModule.register(),
    ControllersModule,
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
  ],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
})
export class AppModule {}
