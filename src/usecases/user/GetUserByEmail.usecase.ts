import { Users } from '@prisma/client'
import { ILogger } from '../../domain/logger/logger.interface'
import { UserRepositoryI } from '../../domain/repositories/userRepository.interface'

export class GetUserByEmail {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: UserRepositoryI,
  ) {}

  async execute(email: string): Promise<Users> {
    const result = await this.userRepository.getUserByEmail(email)
    this.logger.log('GetUserByEmailUseCases execute', 'New todo have been inserted')
    return result
  }
}
