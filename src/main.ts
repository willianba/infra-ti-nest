import { NestFactory } from "@nestjs/core";
import { ImageUploadModule } from "./image-upload.module";

async function bootstrap() {
  const app = await NestFactory.create(ImageUploadModule);
  await app.listen(3000);
}
bootstrap();
