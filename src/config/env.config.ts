export default () => ({
  app: {
    name: process.env.APP_NAME || 'IP Embarca',
    port: parseInt(process.env.PORT || '3005', 10),
    env: process.env.NODE_ENV || 'production',
    allowedOrigins: process.env.ALLOWED_ORIGINS || '',
    trustProxy:
      process.env.TRUST_PROXY === 'true' || process.env.TRUST_PROXY === '1',
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || 'IP Embarca',
    description: process.env.SWAGGER_DESCRIPTION || 'API do IP Embarca',
    version: process.env.SWAGGER_VERSION || '1.0',
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
  database: {
    mysql: {
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      name: process.env.MYSQL_DATABASE,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  // podera adicionar mais configurações aqui conforme necessário, como  Firebase Auth, Rate Limit e demais configurações.
});
