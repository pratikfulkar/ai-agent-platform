import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { S3Service } from '../shared/services/s3.service';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Document)
        private documentRepository: Repository<Document>,
        private s3Service: S3Service,
    ) { }

    async uploadDocument(
        file: { buffer: Buffer; mimetype: string; size: number; originalname: string },
        organizationId: string,
        userId: string,
        title: string,
        description?: string,
    ) {
        // Generate unique filename
        const fileName = `${organizationId}/${Date.now()}-${file.originalname}`;

        // Upload file to S3
        const fileUrl = await this.s3Service.uploadFile(file, fileName);

        // Create document entity
        const document = this.documentRepository.create({
            title,
            content: description || '',
            url: fileUrl, // Store the regular URL in database
            userId,
            organizationId,
            owner: { id: userId } as any, // TypeORM will handle the relation
            organization: organizationId ? { id: organizationId } as any : undefined,
        });

        const savedDocument = await this.documentRepository.save(document);

        // Generate signed URL for immediate access
        const s3Key = this.s3Service.extractKeyFromUrl(fileUrl);
        savedDocument.url = await this.s3Service.getSignedUrl(s3Key, 3600); // 1 hour expiry

        return savedDocument;
    }

    /**
     * Get all documents for a user
     */
    async getUserDocuments(userId: string): Promise<Document[]> {
        const documents = await this.documentRepository.find({
            where: { userId },
            relations: ['owner'],
        });

        // Generate signed URLs for each document
        for (const doc of documents) {
            if (doc.url) {
                const s3Key = this.s3Service.extractKeyFromUrl(doc.url);
                doc.url = await this.s3Service.getSignedUrl(s3Key, 3600); // 1 hour expiry
            }
        }

        return documents;
    }

    /**
     * Get a document by ID
     */
    async getDocumentById(id: string, userId: string): Promise<Document | null> {
        const document = await this.documentRepository.findOne({
            where: { id, userId },
            relations: ['owner'],
        });

        if (document && document.url) {
            // Generate signed URL for secure access
            const s3Key = this.s3Service.extractKeyFromUrl(document.url);
            document.url = await this.s3Service.getSignedUrl(s3Key, 3600); // 1 hour expiry
        }

        return document;
    }

    /**
     * Delete a document
     */
    async deleteDocument(id: string, userId: string): Promise<void> {
        const document = await this.documentRepository.findOne({
            where: { id, userId },
        });

        if (!document) {
            throw new Error('Document not found');
        }

        // Extract S3 key from URL and delete from S3
        try {
            const s3Key = this.s3Service.extractKeyFromUrl(document.url);
            await this.s3Service.deleteFile(s3Key);
        } catch (error) {
            // Log error but don't fail the deletion if S3 delete fails
            console.error('Failed to delete file from S3:', error);
        }

        await this.documentRepository.remove(document);
    }
}
