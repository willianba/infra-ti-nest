import { Req, Res, Injectable } from "@nestjs/common";
import { config } from "dotenv";
import * as multer from "multer";
import * as AWS from "aws-sdk";
import * as multerS3 from "multer-s3";
config();

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const s3 = new AWS.S3();
AWS.config.update({
  s3BucketEndpoint: true,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

@Injectable()
export class ImagesService {
  async fileupload(@Req() req, @Res() res) {
    try {
      this.upload(req, res, (error) => {
        if (error) {
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files[0].location);
      });
    } catch (error) {
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  async listImages(@Req() req, @Res() res) {
    try {
      const images = await this.getImages();
      const urlObjects = this.retrieveImagesFromUrl(images);
      return res.status(201).json(urlObjects);
    } catch (error) {
      return res.status(500).json(`Failed to list images: ${error}`);
    }
  }

  private getImages() {
    const parameters = {
      Bucket: AWS_S3_BUCKET_NAME
    }
    return new Promise((resolve, reject) => {
      s3.listObjects(parameters, (error, data) => {
        if (error) {
          throw Error(`Failed to list images: ${error}`);
        }
        resolve(data.Contents);
      });
      }
    )
  }

  private retrieveImagesFromUrl(images) {
    const urls = [];
    images.forEach(image => {
      const imgKey = image.Key.split(" ").join("+");
      urls.push(`http://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${imgKey}`)
    });
    return urls;
  }

  upload = multer({
    storage: multerS3({
      s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: "public-read",
      key: (request, file, cb) => {
        cb(null, `${Date.now().toString()} - ${file.originalname}`);
      },
    }),
  }).array("upload", 1);
}
