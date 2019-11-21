import { Controller, Post, Req, Res } from "@nestjs/common";
import { ImageUploadService } from "./image-upload.service";

@Controller()
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post("/upload-file")
  async create(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
