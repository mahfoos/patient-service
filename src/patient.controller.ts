import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AddMedicalRecordDto } from './dto/add-medical-record.dto';

// Set the base path for this controller to "patients"
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

  @Post(':id/medical-records')
  addMedicalRecord(
    @Param('id') id: string,
    @Body() record: AddMedicalRecordDto,
  ) {
    return this.patientService.addMedicalRecord(id, record);
  }

  @Post(':id/prescriptions')
  addPrescription(@Param('id') id: string, @Body() prescription: any) {
    return this.patientService.addPrescription(id, prescription);
  }

  @Post(':id/lab-results')
  addLabResult(@Param('id') id: string, @Body() labResult: any) {
    return this.patientService.addLabResult(id, labResult);
  }

  @Patch(':id/allergies')
  updateAllergies(
    @Param('id') id: string,
    @Body() body: { allergies: string[] },
  ) {
    return this.patientService.updateAllergies(id, body.allergies);
  }

  @Patch(':id/insurance')
  updateInsurance(
    @Param('id') id: string,
    @Body() insurance: Record<string, string>,
  ) {
    return this.patientService.updateInsurance(id, insurance);
  }
}
