import { Module } from '@nestjs/common'
import { DatabaseUserRepository } from './user.repository'
import { PrismaModule } from '../config/prisma/prisma.module'
import { PrismaRepository } from './prisma.repository'
import { PrismaService } from '../config/prisma/prisma.service'
import { ExceptionsService } from '../exceptions/exceptions.service'
import { BcryptService } from '../services/bcrypt/bcrypt.service'

@Module({
  imports: [PrismaModule],
  providers: [
    ExceptionsService,
    BcryptService,
    DatabaseUserRepository,
    PrismaRepository,
    {
      provide: 'UserRepository',
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) => new PrismaRepository(prismaService, 'users'),
    },
  ],
  exports: [DatabaseUserRepository, PrismaRepository],
})
export class RepositoriesModule {}
