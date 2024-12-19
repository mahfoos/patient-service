import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AddMedicalRecordDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  diagnosis: string;

  @IsString()
  treatment: string;

  @IsString()
  notes: string;

  @IsString()
  doctorId: string;
}
