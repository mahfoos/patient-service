import { ClientProxyFactory, Transport } from '@nestjs/microservices';

describe('Patient Service Communication Tests', () => {
  let notificationClient;

  beforeAll(() => {
    // Setup notification client to test communication
    notificationClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
        port: parseInt(process.env.NOTIFICATION_SERVICE_PORT) || 3003,
      },
    });
  });

  afterAll(async () => {
    await notificationClient.close();
  });

  it('should notify when patient is created', async () => {
    const patientClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });

    // Create patient
    const patient = await patientClient
      .send(
        { cmd: 'createPatient' },
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
        },
      )
      .toPromise();

    // Verify notification was sent
    const notification = await notificationClient
      .send(
        { cmd: 'findNotifications' },
        {
          userId: patient._id,
          type: 'PATIENT_CREATED',
        },
      )
      .toPromise();

    expect(notification).toBeDefined();
  });
});
