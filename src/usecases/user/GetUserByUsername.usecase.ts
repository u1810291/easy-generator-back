import { Users } from '@prisma/client'
import { ILogger } from '../../domain/logger/logger.interface'
import { UserRepositoryI } from '../../domain/repositories/userRepository.interface'

export class GetUserByUsername {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: UserRepositoryI,
  ) {}

  async execute(username: string): Promise<Users> {
    const result = await this.userRepository.getUserByUsername(username)
    this.logger.log('GetUserByUsernameUseCases execute', 'New todo have been inserted')
    return result
  }
}
