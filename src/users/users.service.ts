import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async createUser(
        email: string,
        password: string,
        name: string,
        organizationId?: string,
    ): Promise<User> {
        // Create user entity (similar to document service pattern)
        const user = this.userRepository.create({
            email,
            password, // TODO: Hash password with bcrypt before saving
            name,
            organizationid: organizationId || undefined, // Note: entity uses lowercase 'organizationid'
            organization: organizationId ? { id: organizationId } as any : undefined, // Set relationship
        });

        // Save and return the user (like document service does)
        return this.userRepository.save(user);
    }
}
