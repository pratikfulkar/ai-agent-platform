import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    Query,
    UseInterceptors,
    UploadedFile,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
    BadRequestException,
    Body,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadDocumentDto } from './dto/upload-document.dto';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentSerive: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Body() uploadDto: UploadDocumentDto,
    ) {
        // Validate file (file validation can't be done with DTO for multipart/form-data)
        if (!file) {
            throw new BadRequestException('File is required');
        }

        // DTO validation is automatic via ValidationPipe in main.ts
        // Extract values from DTO
        const { userId, organizationId, title, description } = uploadDto;

        return this.documentSerive.uploadDocument(
            {
                buffer: file.buffer,
                mimetype: file.mimetype,
                size: file.size,
                originalname: file.originalname,
            },
            organizationId || '', // Handle optional organizationId
            userId,
            title,
            description,
        );
    }

    @Get('user/:userId')
    async getUserDocument(
        @Param('userId', ParseUUIDPipe) userId: string
    ) {
        return this.documentSerive.getUserDocuments(userId)
    }


    @Get(':id')
    async getDocument(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('userId', ParseUUIDPipe) userId: string
    ) {
        return this.documentSerive.getDocumentById(id, userId)
    }


    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteDocument(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('userId', ParseUUIDPipe) userId: string
    ) {
        return this.documentSerive.deleteDocument(id, userId)
    }
}