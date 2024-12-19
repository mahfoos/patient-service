import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceConfig } from './config/service.config';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, PatientSchema } from './schemas/patient.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
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
