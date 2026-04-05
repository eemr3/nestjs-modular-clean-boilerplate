import 'dotenv/config';
import { DataSource } from 'typeorm';
import envConfig from '../config/env.config';
import { buildTypeOrmOptions } from '../config/typeorm.config';

const AppDataSource = new DataSource(
  buildTypeOrmOptions(envConfig().database.postgres),
);

export default AppDataSource;
