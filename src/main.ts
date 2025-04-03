import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình CORS
  app.enableCors({
    origin: '*', // Thay đổi thành domain mà bạn muốn cho phép
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Nếu bạn cần gửi cookie hoặc thông tin xác thực
  });
  //
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Bắt buộc phải có để kích hoạt chuyển đổi
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
bootstrap().catch((err) => console.error(err['message']));
