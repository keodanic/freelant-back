import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  date_birth: Date;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'O número de telefone é obrigatório' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: 'USER', description: 'Papel do usuário' })
  @IsNotEmpty({ message: 'Insira seu papel' })
  role: Role;

}

export class UpdateUserDto {
    name: string;
    address: string;
    password: string;
    phone_number: string;
    
}