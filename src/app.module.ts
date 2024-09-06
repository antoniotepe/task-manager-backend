import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useExternalUrl = configService.get('DATABASE_URL');
        if (useExternalUrl) {
          return {
            type: 'postgres',
            url: useExternalUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Set to true for development, false for production
            ssl: {
              rejectUnauthorized: false
            }
          };
        } else {
          return {
            type: 'postgres',
            host: configService.get('DB_HOSTNAME'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Set to true for development, false for production
            ssl: {
              rejectUnauthorized: false
            }
          };
        }
      },
    }),
    // ... otros módulos
  ],
})
export class AppModule {}