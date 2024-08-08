import { Users } from '@prisma/client'
import { PrismaRepositoryI } from './prismaRepository.interface'

export interface UserRepositoryI extends PrismaRepositoryI<'users'> {
  getUserByUsername(username: string): Promise<Users>
  updateLastLogin(username: string): Promise<void>
  updateRefreshToken(username: string, refreshToken: string): Promise<void>
  register(user: Users): Promise<void>
}
