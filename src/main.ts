import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // TCP Microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });

  // HTTP
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
