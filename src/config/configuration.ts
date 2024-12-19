export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthsync',
  },
  service: {
    port: parseInt(process.env.SERVICE_PORT, 10) || 3001,
    host: process.env.SERVICE_HOST || '0.0.0.0',
  },
};
