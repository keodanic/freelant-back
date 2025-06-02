import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O campo user_id é obrigatório.' })
  user_id: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O campo freelancer_id é obrigatório.' })
  freelancer_id: string;

 
}
