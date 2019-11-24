import { NestFactory } from "@nestjs/core";
import { ImagesModule } from "./images.module";

async function bootstrap() {
  const app = await NestFactory.create(ImagesModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
