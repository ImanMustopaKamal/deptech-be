import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Use global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Use global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Employee Leave API')
    .setDescription(
      'API for managing employee leave requests and admin operations',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  await app.listen(process.env.PORT || 3001);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT || 3001}`,
  );
  console.log(
    `Swagger documentation available at: http://localhost:${process.env.PORT || 3001}/api-docs`,
  );
}
bootstrap();
