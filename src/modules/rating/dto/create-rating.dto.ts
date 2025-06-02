import { IsNotEmpty, IsString, IsUUID, IsNumber, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsUUID()
  @IsNotEmpty({ message: 'O campo user_id é obrigatório.' })
  user_id: string;

  @IsUUID()
  @IsNotEmpty({ message: 'O campo service_id é obrigatório.' })
  service_id: string;

  @IsNumber(
    { maxDecimalPlaces: 1 },
    { message: 'A nota deve ser um número com até uma casa decimal.' }
  )
  @Min(0, { message: 'A nota mínima é 0.0.' })
  @Max(5, { message: 'A nota máxima é 5.0.' })
  @IsNotEmpty({ message: 'O campo rating é obrigatório.' })
  rating: number; // por exemplo: 4.5

  @IsString()
  @IsNotEmpty({ message: 'O campo comment é obrigatório.' })
  comment: string;
}
