import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri:
    process.env.NODE_ENV === 'production'
      ? required('MONGODB_URI')
      : process.env.MONGODB_URI || 'mongodb://localhost:27017/songdb',
};
