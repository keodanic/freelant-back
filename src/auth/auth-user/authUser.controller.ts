import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserService } from './authUser.service';
import { AuthUserDto } from './dto/authUser.dto';
import { Public } from './skipAuth/skip.auth';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth-user')
export class AuthUserController {
  constructor(private readonly authService: AuthUserService) {}

  @Post('login')
  @Public()
  singIn(@Body() body: AuthUserDto) {
    return this.authService.signIn(body.email, body.password);
  }
}