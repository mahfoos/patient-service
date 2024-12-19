import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MedicalRecord } from '../interfaces/medical-record.interface';
import { Prescription } from '../interfaces/prescription.interface';
import { LabResult } from '../interfaces/lab-result.interface';
import { EmergencyContact } from '../interfaces/emergency-contact.interface';

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({
    type: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },
  })
  emergencyContact: EmergencyContact;

  @Prop({
    type: [
      {
        date: { type: Date },
        diagnosis: { type: String },
        treatment: { type: String },
        notes: { type: String },
        doctorId: { type: String },
      },
    ],
  })
  medicalHistory: MedicalRecord[];

  @Prop({
    type: [
      {
        medicationName: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        prescribedBy: { type: String },
      },
    ],
  })
  prescriptions: Prescription[];

  @Prop({
    type: [
      {
        testName: { type: String },
        testDate: { type: Date },
        results: { type: String },
        normalRange: { type: String },
        orderedBy: { type: String },
      },
    ],
  })
  labResults: LabResult[];

  @Prop({ type: [String] })
  allergies: string[];

  @Prop({ type: Map, of: String })
  insurance: Map<string, string>;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
