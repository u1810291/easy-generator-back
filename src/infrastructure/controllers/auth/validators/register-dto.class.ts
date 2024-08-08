import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly username: string

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly password: string
}
