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
  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    await this.update({
      where: {
        email: email,
      },
      data: {
        hashRefreshToken: refreshToken,
      },
    })
  }
  async getUserByEmail(email: string): Promise<Users | null> {
    const adminUserEntity = await this.findFirst({
      where: {
        email: email,
      },
    })
    if (!adminUserEntity) {
      return null
    }
    return adminUserEntity
  }

  async register(user: Users): Promise<void> {
    const userRegister = await this.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    })
    console.log('Registered = ', userRegister)
    return userRegister
  }
}
