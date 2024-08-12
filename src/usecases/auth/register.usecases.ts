import { Users } from '@prisma/client'
import { DatabaseUserRepository } from 'src/infrastructure/repositories/user.repository'

export class RegisterUseCases {
  constructor(private readonly userRepository: DatabaseUserRepository) {}

  async execute(user: Pick<Users, 'email' | 'name' | 'password'>): Promise<Users> {
    console.log(this.userRepository)
    const auth = await this.userRepository.create({
      data: user,
    })
    return auth
  }
}
