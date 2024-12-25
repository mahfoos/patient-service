import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AddMedicalRecordDto } from './dto/add-medical-record.dto';

@Controller()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @MessagePattern({ cmd: 'createPatient' })
  create(@Payload() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @MessagePattern({ cmd: 'findAllPatients' })
  findAll() {
    return this.patientService.findAll();
  }

  @MessagePattern({ cmd: 'findOnePatient' })
  findOne(@Payload() id: string) {
    return this.patientService.findOne(id);
  }

  @MessagePattern({ cmd: 'updatePatient' })
  update(@Payload() data: { id: string; updatePatientDto: UpdatePatientDto }) {
    return this.patientService.update(data.id, data.updatePatientDto);
  }

  @MessagePattern({ cmd: 'removePatient' })
  remove(@Payload() id: string) {
    return this.patientService.remove(id);
  }

  @MessagePattern({ cmd: 'addMedicalRecord' })
  addMedicalRecord(
    @Payload() data: { id: string; record: AddMedicalRecordDto },
  ) {
    return this.patientService.addMedicalRecord(data.id, data.record);
  }

  @MessagePattern({ cmd: 'addPrescription' })
  addPrescription(@Payload() data: { id: string; prescription: any }) {
    return this.patientService.addPrescription(data.id, data.prescription);
  }

  @MessagePattern({ cmd: 'addLabResult' })
  addLabResult(@Payload() data: { id: string; labResult: any }) {
    return this.patientService.addLabResult(data.id, data.labResult);
  }

  @MessagePattern({ cmd: 'updateAllergies' })
  updateAllergies(@Payload() data: { id: string; allergies: string[] }) {
    return this.patientService.updateAllergies(data.id, data.allergies);
  }

  @MessagePattern({ cmd: 'updateInsurance' })
  updateInsurance(
    @Payload() data: { id: string; insurance: Record<string, string> },
  ) {
    return this.patientService.updateInsurance(data.id, data.insurance);
  }
}
