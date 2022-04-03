import { LoadStrategy } from '@mikro-orm/core';
import { MikroOrmModuleOptions as Options } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

const config: Options = {
  type: 'postgresql',
  host: 'localhost',
  port: 5432,
  dbName: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  debug: process.env.NODE !== 'production',
  loadStrategy: LoadStrategy.JOINED,
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  registerRequestContext: false,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
};

export default config;
