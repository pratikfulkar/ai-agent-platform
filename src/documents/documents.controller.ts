import {
    Controller, Post, Get, Delete, Param, Query, Body, UseInterceptors, UploadedFile, ParseUUIDPipe, HttpCode, HttpStatus, BadRequestException
} from '@nestjs/common'
import { DocumentsService } from './documents.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { error } from 'console';
import { useContainer } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Controller('documents')
export class DocumentsController {
    constructor(private readonly documentSerive: DocumentsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDocument(
        @UploadedFile() file: Express.Multer.File,
        @Body('organizationId') organizationId: string,
        @Body('userId', ParseUUIDPipe) userId: string,
        @Body('title') title: string,
        @Body('description') description?: string
    ) {
        if (!file) {
            throw new BadRequestException('File is Required!');
        }
        if (!title) {
            throw new BadRequestException('Title is Required!!');
        }
        return this.documentSerive.uploadDocument(
            {
                buffer: file.buffer,
                mimetype: file.mimetype,
                size: file.size,
                originalname: file.originalname

            },
            organizationId,
            userId,
            title,
            description
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