import { Module } from '@nestjs/common'
import { UseCasesProxyModule } from '../usecases-proxy/usecases-proxy.module'
import { AuthController } from './auth/auth.controller'
import { Health } from './health/health.controller'

@Module({
  imports: [UseCasesProxyModule.register()],
  controllers: [AuthController, Health],
})
export class ControllersModule {}
