import { S3_ID, S3_SECRET, S3_BUCKET_NAME } from "@shared/constants";
import AWS from "aws-sdk";
import { UploadedFile } from "express-fileupload";
import { Response } from "express";

export class s3Service {
  private readonly s3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: S3_ID,
      secretAccessKey: S3_SECRET,
    });
  }

  public uploadFile(file: UploadedFile): Promise<string> {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `video/${file.name}`,
      Body: file.data,
    };

    // Uploading files to the bucket
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err: Error, data: any) => {
        err ? reject(err) : resolve(data.Location);
      });
    });
  }

  public getFile(file: any, res: Response): any {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `video/${file.file_name}`,
    };

    // Uploading files to the bucket
    // return new Promise((resolve, reject) => {
    const service = this.s3;

    service.headObject(params, function (err: any, data: any) {
      if (err) {
        // an error occurred
        console.error(err);
      }
      var stream = service.getObject(params).createReadStream();

      // forward errors
      stream.on("error", function error(err: any) {
        //continue to the next middlewares
        console.error(err);
      });

      //Add the content type to the response (it's not propagated from the S3 SDK)
      res.set("Content-Type", "video/mp4");
      res.set("Content-Length", data.ContentLength);
      res.set("Last-Modified", data.LastModified);
      res.set("ETag", data.ETag);
      res.set("Accept-Ranges", "bytes");

      stream.on("end", () => {
        console.log("Served by Amazon S3: " + `video/${file.file_name}`);
      });
      //Pipe the s3 object to the response
      stream.pipe(res);
    });

    // });
    // const s3Stream = this.s3.getObject(params).createReadStream();

    // s3Stream.on('error', function (err) {
    //   reject(err);
    // });

    // resolve(this.s3);
    // });
  }

  public deleteFile(file: any) {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `video/${file.file_name}`,
    };

    return new Promise((resolve, reject) => {
      this.s3.deleteObject(params, (err: Error, data: any) => {
        err ? reject(err) : resolve(data);
      });
    });
  }
}
