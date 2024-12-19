import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Patient } from './schemas/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AddMedicalRecordDto } from './dto/add-medical-record.dto';
import { Prescription } from './interfaces/prescription.interface';
import { LabResult } from './interfaces/lab-result.interface';
import { ServiceConfig } from './config/service.config';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @Inject(ServiceConfig.NOTIFICATION_SERVICE.name)
    private notificationClient: ClientProxy,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    try {
      const createdPatient = new this.patientModel(createPatientDto);
      const savedPatient = await createdPatient.save();

      // Send welcome notification
      await this.sendNotification('patient.created', {
        patientId: savedPatient._id,
        email: savedPatient.email,
        name: `${savedPatient.firstName} ${savedPatient.lastName}`,
        type: 'welcome',
      });

      return savedPatient;
    } catch (error) {
      this.logger.error(`Failed to create patient: ${error.message}`);
      throw error;
    }
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
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();

      if (!updatedPatient) {
        throw new NotFoundException(`Patient with ID ${id} not found`);
      }

      // Notify about profile update
      await this.sendNotification('patient.updated', {
        patientId: updatedPatient._id,
        email: updatedPatient.email,
        name: `${updatedPatient.firstName} ${updatedPatient.lastName}`,
        type: 'profile_update',
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(`Failed to update patient ${id}: ${error.message}`);
      throw error;
    }
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
    try {
      const patient = await this.findOne(id);
      patient.medicalHistory.push(record);
      const updatedPatient = await patient.save();

      // Notify about new medical record
      await this.sendNotification('medical.record.added', {
        patientId: patient._id,
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        type: 'medical_record',
        recordType: record.diagnosis,
        doctorName: record.doctorId,
        date: record.date,
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(
        `Failed to add medical record for patient ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async addPrescription(
    id: string,
    prescription: Prescription,
  ): Promise<Patient> {
    try {
      const patient = await this.findOne(id);
      patient.prescriptions.push(prescription);
      const updatedPatient = await patient.save();

      // Notify about new prescription
      await this.sendNotification('prescription.added', {
        patientId: patient._id,
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        type: 'prescription',
        medication: prescription.medicationName,
        doctorName: prescription.prescribedBy,
        startDate: prescription.startDate,
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(
        `Failed to add prescription for patient ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async addLabResult(id: string, labResult: LabResult): Promise<Patient> {
    try {
      const patient = await this.findOne(id);
      patient.labResults.push(labResult);
      const updatedPatient = await patient.save();

      // Notify about new lab result
      await this.sendNotification('lab.result.added', {
        patientId: patient._id,
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        type: 'lab_result',
        testName: labResult.testName,
        testDate: labResult.testDate,
        doctorName: labResult.orderedBy,
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(
        `Failed to add lab result for patient ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateAllergies(id: string, allergies: string[]): Promise<Patient> {
    try {
      const patient = await this.findOne(id);
      patient.allergies = allergies;
      const updatedPatient = await patient.save();

      // Notify about allergy update
      await this.sendNotification('allergies.updated', {
        patientId: patient._id,
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        type: 'allergies',
        allergies: allergies,
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(
        `Failed to update allergies for patient ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateInsurance(
    id: string,
    insurance: Record<string, string>,
  ): Promise<Patient> {
    try {
      const patient = await this.findOne(id);
      patient.insurance = new Map(Object.entries(insurance));
      const updatedPatient = await patient.save();

      // Notify about insurance update
      await this.sendNotification('insurance.updated', {
        patientId: patient._id,
        email: patient.email,
        name: `${patient.firstName} ${patient.lastName}`,
        type: 'insurance',
      });

      return updatedPatient;
    } catch (error) {
      this.logger.error(
        `Failed to update insurance for patient ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  private async sendNotification(event: string, data: any): Promise<void> {
    try {
      await lastValueFrom(
        this.notificationClient.send(
          { cmd: event },
          {
            ...data,
            timestamp: new Date(),
          },
        ),
      );
    } catch (error) {
      this.logger.warn(
        `Failed to send notification for event ${event}: ${error.message}`,
      );
      // Don't throw error to prevent blocking the main operation
    }
  }
}
