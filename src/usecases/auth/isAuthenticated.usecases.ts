import { Users } from '@prisma/client'
import { UserRepositoryI } from '../../domain/repositories/userRepository.interface'

export class IsAuthenticatedUseCases {
  constructor(private readonly adminUserRepo: UserRepositoryI) {}

  async execute(username: string): Promise<Omit<Users, 'password'>> {
    const user: Users = await this.adminUserRepo.getUserByUsername(username)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...info } = user
    return info
  }
}
