import { Module } from '@nestjs/common';
import { S3Service } from './services/s3.service';

@Module({
  providers: [S3Service],
  exports: [S3Service], // Export so other modules can use it
})
export class SharedModule {}

