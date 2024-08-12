import { Users } from '@prisma/client'
import { PrismaRepositoryI } from './prismaRepository.interface'

export interface UserRepositoryI extends PrismaRepositoryI<'users'> {
  getUserByUsername(email: string): Promise<Users>
  updateLastLogin(email: string): Promise<void>
  updateRefreshToken(email: string, refreshToken: string): Promise<void>
  register(user: Pick<Users, 'email' | 'password' | 'name'>): Promise<void>
}
