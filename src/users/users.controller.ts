import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        // DTO validation is automatic via ValidationPipe in main.ts
        // Extract values from DTO
        const { email, password, name, organizationId } = createUserDto;

        // Call service with correct parameter order
        return this.userService.createUser(
            email,
            password,
            name,
            organizationId,
        );
    }
}