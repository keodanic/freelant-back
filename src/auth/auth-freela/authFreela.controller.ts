import { Body, Controller, Post } from '@nestjs/common';
import { AuthFreelaService } from './authFreela.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthFreelaDto } from './dto/authFreela.dto';
import { Public } from './skipAuth/skipAuth';


@ApiTags('Autenticação')
@Controller('auth-freela')
export class AuthFreelaController {
  constructor(private readonly authService: AuthFreelaService) {}
    
  @Post('login')
  @Public()
  singIn(@Body() body: AuthFreelaDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
