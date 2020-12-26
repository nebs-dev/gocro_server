"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Service = void 0;
const constants_1 = require("@shared/constants");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class s3Service {
    constructor() {
        this.s3 = new aws_sdk_1.default.S3({
            accessKeyId: constants_1.S3_ID,
            secretAccessKey: constants_1.S3_SECRET,
        });
    }
    uploadFile(file) {
        const params = {
            Bucket: constants_1.S3_BUCKET_NAME,
            Key: `video/${file.name}`,
            Body: file.data,
        };
        // Uploading files to the bucket
        return new Promise((resolve, reject) => {
            this.s3.upload(params, (err, data) => {
                err ? reject(err) : resolve(data.Location);
            });
        });
    }
    getFile(file, res) {
        const params = {
            Bucket: constants_1.S3_BUCKET_NAME,
            Key: `video/${file.file_name}`,
        };
        // Uploading files to the bucket
        // return new Promise((resolve, reject) => {
        const service = this.s3;
        service.headObject(params, function (err, data) {
            if (err) {
                // an error occurred
                console.error(err);
            }
            var stream = service.getObject(params).createReadStream();
            // forward errors
            stream.on("error", function error(err) {
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
    deleteFile(file) {
        const params = {
            Bucket: constants_1.S3_BUCKET_NAME,
            Key: `video/${file.file_name}`,
        };
        return new Promise((resolve, reject) => {
            this.s3.deleteObject(params, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
}
exports.s3Service = s3Service;
