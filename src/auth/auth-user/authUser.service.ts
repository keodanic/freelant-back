import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ResponseUserAuthDto } from './dto/authUser.dto';


@Injectable()
export class AuthUserService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(
        email: string,
        password: string
    ): Promise<{ access_token: string, user: ResponseUserAuthDto }> {
        const user = await this.usersService.findById(email);

        const passwordCorrect = await bcrypt.compare(password, user.password)

        if (!passwordCorrect)
            throw new UnauthorizedException({
                message: 'Falha de autenticação.',
                error: 'Credenciais inválidas',
            });

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };




        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            }
        };
    }
}
