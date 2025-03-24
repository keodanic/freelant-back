import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ResponseFreelaAuthDto } from './dto/authFreela.dto';
import { FreelancersService } from 'src/modules/freelancers/freelancers.service';


@Injectable()
export class AuthFreelaService {
    constructor(
        private readonly freelancersService: FreelancersService,
        private readonly jwtService: JwtService
    ) { }

    async signIn(
        email: string,
        password: string
    ): Promise<{ access_token: string, freelancer: ResponseFreelaAuthDto }> {
        const freelancer = await this.freelancersService.findById(email);

        const passwordCorrect = await bcrypt.compare(password, freelancer.password)

        if (!passwordCorrect)
            throw new UnauthorizedException({
                message: 'Falha de autenticação.',
                error: 'Credenciais inválidas',
            });

        const payload = {
            id: freelancer.id,
            email: freelancer.email,
        };




        return {
            access_token: await this.jwtService.signAsync(payload),
            freelancer: {
                id: freelancer.id,
                email: freelancer.email,
            }
        };
    }
}
