import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from "@prisma/client";

export class AuthFreelaDto {
  @ApiProperty({
    example: 'fulano@example.com',
    description: 'O Email do freelancer',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'Digite um email válido!' })
  email: string;
  @ApiProperty({ example: 'secret', description: 'A senha do usuário.' })
  @IsNotEmpty({ message: 'Digite uma senha!' })
  password: string;
}

export class ResponseFreelaAuthDto {
  @ApiProperty({ example: '82704273-d483-423a-1234-9b5b8447568a', description: 'Id do usuário'})
  @IsNotEmpty()
  id: string;
  @ApiProperty({
    example: 'Email@exemplo.com',
    description: 'Email do usuário',
  })
  @IsNotEmpty({ message: 'Insira seu email' })
  email: string;


}