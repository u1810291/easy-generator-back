import { Users } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaRepository } from './prisma.repository'
import { PrismaService } from '../config/prisma/prisma.service'
import { BcryptService } from '../services/bcrypt/bcrypt.service'
import { ExceptionsService } from '../exceptions/exceptions.service'
import { UserRepositoryI } from '../../domain/repositories/userRepository.interface'
// import { ConfigService } from '@nestjs/config'

@Injectable()
export class DatabaseUserRepository extends PrismaRepository<'users'> implements UserRepositoryI {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly exceptionService: ExceptionsService,
    private readonly encrypt: BcryptService,
  ) {
    super(prisma, 'users')
  }

  async updateLastLogin(email: string): Promise<void> {
    throw new Error('Method not implemented.')
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

  async register(user: Pick<Users, 'email' | 'name' | 'password'>): Promise<Users> {
    const userExists = await this.findFirst({
      where: {
        email: user.email,
      },
    })

    if (userExists) {
      this.exceptionService.badRequestException({
        code_error: 400,
        message: 'User with this email is already exists',
      })
    }

    const password = await this.encrypt.hash(user.password)

    const userRegister = await this.create({
      data: {
        name: user.name,
        email: user.email,
        password: password,
      },
    })
    return userRegister
  }
}
