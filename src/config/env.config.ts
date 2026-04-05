export default () => ({
  app: {
    name: process.env.APP_NAME || 'Nome do seu projeto',
    port: parseInt(process.env.PORT || '3001', 10),
    env: process.env.NODE_ENV || 'production',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '',
    trustProxy:
      process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'Nome do seu projeto',
    description:
      process.env.SWAGGER_DESCRIPTION || 'API do Nome do seu projeto',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
  database: {
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
    },
  },
  // podera adicionar mais configurações aqui conforme necessário, como JWT, Firebase Auth, Rate Limit e demais configurações.
});
