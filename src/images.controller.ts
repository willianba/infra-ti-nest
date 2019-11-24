import { Controller, Post, Req, Res, Get } from "@nestjs/common";
import { ImagesService } from "./images.service";

@Controller()
export class ImagesController {
  constructor(private readonly imageUploadService: ImagesService) {}

  @Get("/")
  async listImages(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.listImages(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to list images from S3: ${error.message}`);
    }
  }

  @Post("/upload-file")
  async create(@Req() request, @Res() response) {
    try {
      return await this.imageUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
