import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFreelancerDto {
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

  @IsOptional()
  @IsString()
  link_portfolio?: string;

  @IsNotEmpty({ message: 'A categoria de trabalho é obrigatória' })
  @IsString()
  work_id: string;
}

export class UpdateFreelancerDto {
    name: string;
    address: string;
    password: string;
    phone_number: string;
    link_portfolio?: string;
    profile_picture?: string;
}