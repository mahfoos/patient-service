export const ServiceConfig = {
  PATIENT_SERVICE: {
    name: 'PATIENT_SERVICE',
    host: process.env.PATIENT_SERVICE_HOST || 'localhost',
    port: 3001,
  },
  APPOINTMENT_SERVICE: {
    name: 'APPOINTMENT_SERVICE',
    host: process.env.APPOINTMENT_SERVICE_HOST || 'localhost',
    port: 3002,
  },
  NOTIFICATION_SERVICE: {
    name: 'NOTIFICATION_SERVICE',
    host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
    port: 3003,
  },
  AGGREGATOR_SERVICE: {
    name: 'AGGREGATOR_SERVICE',
    host: process.env.AGGREGATOR_SERVICE_HOST || 'localhost',
    port: 3004,
  },
};
