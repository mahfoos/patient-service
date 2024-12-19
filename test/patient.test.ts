import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

describe('Patient Service Tests', () => {
  let client: ClientProxy;

  beforeAll(() => {
    client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 3001,
      },
    });
  });

  afterAll(async () => {
    await client.close();
  });

  it('should create a new patient', async () => {
    const patient = await client
      .send(
        { cmd: 'createPatient' },
        {
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-01-01'),
          email: 'john.doe@example.com',
          phone: '1234567890',
        },
      )
      .toPromise();

    expect(patient).toBeDefined();
    expect(patient.firstName).toBe('John');
    expect(patient.lastName).toBe('Doe');
    return patient;
  });

  it('should find all patients', async () => {
    const patients = await client
      .send({ cmd: 'findAllPatients' }, {})
      .toPromise();

    expect(Array.isArray(patients)).toBe(true);
  });

  it('should add medical record to patient', async () => {
    // First create a patient
    const patient = await client
      .send(
        { cmd: 'createPatient' },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          dateOfBirth: new Date('1992-03-15'),
          email: 'jane.smith@example.com',
          phone: '9876543210',
        },
      )
      .toPromise();

    // Then add medical record
    const updatedPatient = await client
      .send(
        { cmd: 'addMedicalRecord' },
        {
          id: patient._id,
          record: {
            date: new Date(),
            diagnosis: 'Flu',
            treatment: 'Rest and medication',
            notes: 'Patient should recover in 5 days',
            doctorId: 'doctor456',
          },
        },
      )
      .toPromise();

    expect(updatedPatient.medicalHistory).toHaveLength(1);
    expect(updatedPatient.medicalHistory[0].diagnosis).toBe('Flu');
  });
});
