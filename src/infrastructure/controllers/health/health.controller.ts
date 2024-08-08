import { Controller, Get } from '@nestjs/common'

@Controller('health')
export class Health {
  constructor() {}
  @Get('')
  async healthCheck() {
    return 'Hello world'
  }
}
