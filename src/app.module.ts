import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService} from "@nestjs/config"
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
const cookieSession = require('cookie-session');


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validate: (config: Record<string, unknown>) => {
        if (!config.DB_NAME) {
          throw new Error('DB_NAME environment variable is missing');
        }
        return config;
      },
    }),
    
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        type: "sqlite",
        database: config.get<string>("DB_NAME"),
        synchronize: true,
        entities: [User, Report]
      }
    }
  }),
   UsersModule, ReportsModule],
  controllers: [AppController],
  providers: [AppService,
     {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,  // strips away unwanted properties from the request object
      }),
  }

],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply( 
      cookieSession({
        keys: ['asdf']
      }) 
    ).forRoutes('*'); // Apply to all routes
  }
}
