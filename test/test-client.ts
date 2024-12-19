import { ClientProxyFactory, Transport } from '@nestjs/microservices';

async function testPatientService() {
  const client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3001,
    },
  });

  try {
    console.log('Testing Patient Service...');

    // Test 1: Create Patient
    console.log('\n1. Creating a new patient...');
    const newPatient = await client
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
    console.log('Created patient:', newPatient);

    // Test 2: Add Medical Record
    console.log('\n2. Adding medical record...');
    const medicalRecord = await client
      .send(
        { cmd: 'addMedicalRecord' },
        {
          id: newPatient._id,
          record: {
            date: new Date(),
            diagnosis: 'Common Cold',
            treatment: 'Rest and fluids',
            notes: 'Patient should recover in 7 days',
            doctorId: 'doctor123',
          },
        },
      )
      .toPromise();
    console.log('Added medical record:', medicalRecord);

    // Test 3: Find All Patients
    console.log('\n3. Getting all patients...');
    const allPatients = await client
      .send({ cmd: 'findAllPatients' }, {})
      .toPromise();
    console.log('All patients:', allPatients);

    // Test 4: Update Patient
    console.log('\n4. Updating patient...');
    const updatedPatient = await client
      .send(
        { cmd: 'updatePatient' },
        {
          id: newPatient._id,
          updatePatientDto: {
            phone: '0987654321',
          },
        },
      )
      .toPromise();
    console.log('Updated patient:', updatedPatient);

    await client.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}
testPatientService()
  .then(() => console.log('\nAll tests completed successfully!'))
  .catch((err) => console.error('Test failed:', err))
  .finally(() => process.exit());
