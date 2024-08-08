import { Body, Controller, Get, Inject, Post, Req, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { IsAuthPresenter } from './auth.presenter'
import { AuthLoginDto } from './validators/auth-dto.class'
import { RegisterDto } from './validators/register-dto.class'

import { LoginGuard } from '../../common/guards/login.guard'
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard'
import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard'

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy'
import { LoginUseCases } from '../../../usecases/auth/login.usecases'
import { LogoutUseCases } from '../../../usecases/auth/logout.usecases'
import { RegisterUseCases } from '../../../usecases/auth/register.usecases'
import { IsAuthenticatedUseCases } from '../../../usecases/auth/isAuthenticated.usecases'

import { ApiResponseType } from '../../common/swagger/response.decorator'
import { Symbols } from '../../../domain/symbols'

@Controller('auth')
@ApiTags('auth')
@ApiResponse({
  status: 401,
  description: 'No authorization token was found',
})
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(IsAuthPresenter)
export class AuthController {
  constructor(
    @Inject(Symbols.LOGIN_USECASES_PROXY)
    private readonly loginUseCaseProxy: UseCaseProxy<LoginUseCases>,
    @Inject(Symbols.LOGOUT_USECASES_PROXY)
    private readonly logoutUseCaseProxy: UseCaseProxy<LogoutUseCases>,
    @Inject(Symbols.IS_AUTHENTICATED_USECASES_PROXY)
    private readonly isAuthUseCaseProxy: UseCaseProxy<IsAuthenticatedUseCases>,
    @Inject(Symbols.REGISTER_USECASES_PROXY)
    private readonly registerUseCaseProxy: UseCaseProxy<RegisterUseCases>,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'login' })
  async login(@Body() auth: AuthLoginDto, @Request() request: any) {
    const accessTokenCookie = await this.loginUseCaseProxy.getInstance().getCookieWithJwtToken(auth.username)
    const refreshTokenCookie = await this.loginUseCaseProxy.getInstance().getCookieWithJwtRefreshToken(auth.username)
    request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
    return 'Login successful'
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'logout' })
  async logout(@Request() request: any) {
    const cookie = await this.logoutUseCaseProxy.getInstance().execute()
    request.res.setHeader('Set-Cookie', cookie)
    return 'Logout successful'
  }

  @Get('is_authenticated')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'is_authenticated' })
  @ApiResponseType(IsAuthPresenter, false)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthUseCaseProxy.getInstance().execute(request.user.username)
    const response = new IsAuthPresenter()
    response.username = user.username
    return response
  }

  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBearerAuth()
  async refresh(@Req() request: any) {
    const accessTokenCookie = await this.loginUseCaseProxy.getInstance().getCookieWithJwtToken(request.user.username)
    request.res.setHeader('Set-Cookie', accessTokenCookie)
    return 'Refresh successful'
  }

  @Post('register')
  @UseGuards(LoginGuard)
  @ApiBearerAuth()
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({ description: 'register' })
  async register(@Req() request: RegisterDto) {
    const user = await this.registerUseCaseProxy.getInstance().execute()
    console.log(user, request)
    return 'Registered'
  }
}
