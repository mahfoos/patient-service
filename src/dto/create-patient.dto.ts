import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsObject()
  @IsOptional()
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  @IsArray()
  @IsOptional()
  allergies?: string[];

  @IsObject()
  @IsOptional()
  insurance?: Record<string, string>;
}
