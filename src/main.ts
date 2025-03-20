import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('API FREELANT')
  .setDescription('API do projeto de conclusão do curso de SPI, com o intuito de ser uma aplicação que permite a conexão de trabalhadores autonomos com a população de Timon\n\n' +
        'Além do controle de usuário por parte da administração.\n\n' +
        '`Desenvolvedores`\n' +
        '- [Victor Daniel](https://www.linkedin.com/in/victor-daniel-santos-cardoso-ab0787344/)\n'
        )
  .setVersion('1.0')
  .addBearerAuth() 
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

  
}
bootstrap();
