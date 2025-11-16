import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    // Load environment variables from backend/.env (isGlobal so ConfigService is available everywhere)
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // Configure Mongoose asynchronously so we can read MONGO_URI from ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        if (!uri) {
          throw new Error(
            'MONGO_URI is not set. Set the MONGO_URI environment variable to your MongoDB Atlas connection string.',
          );
        }
        return { uri };
      },
    }),
    UsersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
