import { config } from 'dotenv';

const pathToEnv = __dirname + '/../.env';

config({ path: pathToEnv });

const serverConfig = {
  port: process.env.SERVER_PORT,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  databaseConnection: process.env.DATABASE_URL
};

export default serverConfig;
