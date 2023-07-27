import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs'

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(process.env.KEY_CA_PRIVATE_KEY_FILE_PATH),
    cert: fs.readFileSync(process.env.KEY_CA_PUBLIC_CERTIFICATE_FILE_PATH),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  const config = new DocumentBuilder()
    .setTitle('Doberman swagger')
    .setDescription('The doberman API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('dog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors()
  await app.listen(5000);
}
bootstrap();
