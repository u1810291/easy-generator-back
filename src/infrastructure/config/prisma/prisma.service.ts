import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { EnvironmentConfigService } from '../environment-config/environment-config.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(environmentConfig: EnvironmentConfigService) {
    const url = environmentConfig.getDatabaseUrl()
    super({
      datasources: {
        db: { url },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async enableShutdownHooks() {
    process.on('beforeExit', async () => {
      await this.$disconnect()
      console.log('Disconnected from database')
    })
  }
}
