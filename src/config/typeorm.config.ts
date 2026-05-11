import { DataSourceOptions } from 'typeorm';

export type MysqlConfig = {
  host?: string;
  port: number;
  username?: string;
  password?: string;
  name?: string;
};

const entitiesPattern = `${__dirname}/../**/*.entity{.ts,.js}`;
const migrationsPattern = `${__dirname}/../database/migrations/*{.ts,.js}`;

/** Opções do TypeORM alinhadas ao objeto `database.postgres` do `env.config`. */
export function buildTypeOrmOptions(mysql: MysqlConfig): DataSourceOptions {
  return {
    type: 'mysql',
    host: mysql.host,
    port: mysql.port,
    username: mysql.username,
    password: mysql.password != null ? String(mysql.password) : '',
    database: mysql.name,
    entities: [entitiesPattern],
    migrations: [migrationsPattern],
    synchronize: false,
  };
}
