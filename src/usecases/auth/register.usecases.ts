import { Users } from '@prisma/client'
import { DatabaseUserRepository } from 'src/infrastructure/repositories/user.repository'

export class RegisterUseCases {
  constructor(private readonly userRepository: DatabaseUserRepository) {}

  async execute(user: Pick<Users, 'email' | 'name' | 'password'>): Promise<Users> {
    const registered = await this.userRepository.register(user)
    return registered
  }
}
