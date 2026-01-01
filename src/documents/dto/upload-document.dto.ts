import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UploadDocumentDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    @IsOptional()
    organizationId?: string;

    @IsString()
    @MinLength(3, { message: 'title must be at least 3 characters long' })
    title: string;

    @IsString()
    @IsOptional()
    description?: string;
}