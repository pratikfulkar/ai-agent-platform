import { IsEmail, IsString, IsUUID, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'email must be a valid email address' })
    email: string;

    @IsString()
    @MinLength(6, { message: 'password must be at least 6 characters long' })
    password: string;

    @IsString()
    @MinLength(2, { message: 'name must be at least 2 characters long' })
    name: string;

    @IsUUID()
    @IsOptional()
    organizationId?: string;
}