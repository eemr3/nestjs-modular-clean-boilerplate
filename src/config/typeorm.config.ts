import { DataSourceOptions } from 'typeorm';

export type PostgresConfig = {
  host?: string;
  port: number;
  username?: string;
  password?: string;
  name?: string;
};

const entitiesPattern = `${__dirname}/../**/*.orm-entity{.ts,.js}`;
const migrationsPattern = `${__dirname}/../database/migrations/*{.ts,.js}`;

/** Opções do TypeORM alinhadas ao objeto `database.postgres` do `env.config`. */
export function buildTypeOrmOptions(pg: PostgresConfig): DataSourceOptions {
  return {
    type: 'postgres',
    host: pg.host,
    port: pg.port,
    username: pg.username,
    password: pg.password != null ? String(pg.password) : '',
    database: pg.name,
    entities: [entitiesPattern],
    migrations: [migrationsPattern],
    synchronize: false,
  };
}
