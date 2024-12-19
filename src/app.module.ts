import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceConfig } from './config/service.config';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/healthsync'),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    ClientsModule.register([
      {
        name: ServiceConfig.NOTIFICATION_SERVICE.name,
        transport: Transport.TCP,
        options: {
          host: ServiceConfig.NOTIFICATION_SERVICE.host,
          port: ServiceConfig.NOTIFICATION_SERVICE.port,
        },
      },
    ]),
  ],
  controllers: [PatientController],
  providers: [PatientService],
})
export class AppModule {}
