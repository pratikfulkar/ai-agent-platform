import { IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
    @IsString({ message: 'name must be a string' })
    @MinLength(2, { message: 'name must be at least 2 characters long' })
    name: string;

    // ❌ NO id - Database auto-generates it
    // ❌ NO createdAt/updatedAt - Database auto-fills them
}