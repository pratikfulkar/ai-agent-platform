import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    private readonly logger = new Logger(S3Service.name);
    private readonly s3Client: S3Client;
    private readonly bucketName: string;
    private readonly region: string;

    constructor(private readonly configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');
        const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

        if (!region || !bucketName) {
            throw new Error('AWS_REGION and AWS_BUCKET_NAME must be set');
        }

        this.region = region;
        this.bucketName = bucketName;

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
            },
        });
    }

    /**
     * Uploads a file to S3.
     * @param file - The file to upload (Multer.File)
     * @param key - The key (filename) for the S3 object
     * @returns The URL to the uploaded file
     */
    async uploadFile(
        file: { buffer: Buffer; mimetype: string; size: number; originalname: string },
        key: string,
    ): Promise<string> {
        try {
            // For small size files (below 5MB)
            if (file.size < 5 * 1024 * 1024) {
                const command = new PutObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                    ACL: 'private',
                });
                await this.s3Client.send(command);
            } else {
                // For large files (more than 5MB)
                const upload = new Upload({
                    client: this.s3Client,
                    params: {
                        Bucket: this.bucketName,
                        Key: key,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                        ACL: 'private',
                    },
                });
                await upload.done();
            }

            // Construct S3 URL
            // Note: For private files, you'll need to generate signed URLs when accessing
            // This URL format works for all regions
            const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

            // Alternative: For regions with different URL format (e.g., us-east-1)
            // const fileUrl = this.region === 'us-east-1' 
            //     ? `https://${this.bucketName}.s3.amazonaws.com/${key}`
            //     : `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

            this.logger.log(`File uploaded successfully: ${key}`);
            return fileUrl;
        } catch (error: any) {
            this.logger.error(`Error while uploading to S3: ${error.message}`, error.stack);
            throw new Error(`Failed to upload the document to S3: ${error.message}`);
        }
    }

    /**
     * Get a file from S3.
     * @param key - The key or filename (S3 key)
     * @returns Buffer containing the file data
     */
    async getFile(key: string): Promise<Buffer> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            const response = await this.s3Client.send(command);
            const chunks: Uint8Array[] = [];

            // Convert stream to buffer
            if (response.Body) {
                for await (const chunk of response.Body as any) {
                    chunks.push(chunk);
                }
            }

            return Buffer.concat(chunks);
        } catch (error: any) {
            this.logger.error(`Failed to get the file from S3: ${error.message}`, error.stack);
            throw new Error(`Failed to get file from S3: ${error.message}`);
        }
    }

    /**
     * Delete a file from S3.
     * @param key - The key or filename (S3 key)
     */
    async deleteFile(key: string): Promise<void> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            await this.s3Client.send(command);
            this.logger.log(`File deleted successfully: ${key}`);
        } catch (error: any) {
            this.logger.error(`Failed to delete the file from S3: ${error.message}`, error.stack);
            throw new Error(`Failed to delete file from S3: ${error.message}`);
        }
    }

    /**
     * Generate a signed URL for accessing a private file.
     * @param key - The key or filename (S3 key)
     * @param expiresIn - Expiration time in seconds (default: 1 hour = 3600)
     * @returns A signed URL that can be used to access the file
     */
    async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            });

            // Generate signed URL that expires after specified time
            const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });

            this.logger.log(`Generated signed URL for: ${key} (expires in ${expiresIn}s)`);
            return signedUrl;
        } catch (error: any) {
            this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
    }

    /**
     * Extract S3 key from a full S3 URL
     * @param url - Full S3 URL (e.g., https://bucket.s3.region.amazonaws.com/key)
     * @returns The S3 key (filename path)
     */
    extractKeyFromUrl(url: string): string {
        try {
            // Extract key from S3 URL (format: https://bucket.s3.region.amazonaws.com/key)
            const urlParts = url.split('.amazonaws.com/');
            if (urlParts.length > 1) {
                return urlParts[1];
            }
            // If URL format is different, try to extract from path
            const urlObj = new URL(url);
            return urlObj.pathname.substring(1); // Remove leading slash
        } catch (error) {
            this.logger.error(`Failed to extract key from URL: ${url}`);
            throw new Error('Invalid S3 URL format');
        }
    }
}
