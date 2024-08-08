import { Injectable } from '@nestjs/common'
import { PrismaRepository } from './prisma.repository'
import { PrismaService } from '../config/prisma/prisma.service'
import { Users } from '@prisma/client'
// import { UserRepositoryI } from '../../domain/repositories/userRepository.interface'
// import { ConfigService } from '@nestjs/config'

@Injectable()
export class DatabaseUserRepository extends PrismaRepository<'users'> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, 'users')
  }
  async updateRefreshToken(username: string, refreshToken: string): Promise<void> {
    await this.update({
      where: {
        username: username,
      },
      data: {
        hashRefreshToken: refreshToken,
      },
    })
  }
  async getUserByUsername(username: string): Promise<Users | null> {
    const adminUserEntity = await this.findFirst({
      where: {
        username: username,
      },
    })
    if (!adminUserEntity) {
      return null
    }
    return adminUserEntity
  }
  async updateLastLogin(username: string): Promise<void> {
    await this.update({
      where: {
        username: username,
      },
      data: {
        lastLogin: new Date().toISOString(),
      },
    })
  }
  async register(): Promise<void> {
    console.log('Hello register')
  }
}
