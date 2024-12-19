import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AddMedicalRecordDto } from './dto/add-medical-record.dto';
import { Prescription } from './interfaces/prescription.interface';
import { LabResult } from './interfaces/lab-result.interface';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const createdPatient = new this.patientModel(createPatientDto);
    return createdPatient.save();
  }

  async findAll(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const updatedPatient = await this.patientModel
      .findByIdAndUpdate(id, updatePatientDto, { new: true })
      .exec();
    if (!updatedPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return updatedPatient;
  }

  async remove(id: string): Promise<Patient> {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id).exec();
    if (!deletedPatient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return deletedPatient;
  }

  async addMedicalRecord(
    id: string,
    record: AddMedicalRecordDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.medicalHistory.push(record);
    return patient.save();
  }

  async addPrescription(
    id: string,
    prescription: Prescription,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.prescriptions.push(prescription);
    return patient.save();
  }

  async addLabResult(id: string, labResult: LabResult): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.labResults.push(labResult);
    return patient.save();
  }

  async updateAllergies(id: string, allergies: string[]): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.allergies = allergies;
    return patient.save();
  }

  async updateInsurance(
    id: string,
    insurance: Record<string, string>,
  ): Promise<Patient> {
    const patient = await this.findOne(id);
    patient.insurance = new Map(Object.entries(insurance));
    return patient.save();
  }
}
