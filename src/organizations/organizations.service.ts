import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationsService {
    constructor(
        @InjectRepository(Organization)
        private readonly OrgRepo: Repository<Organization>,
    ) { }

    async createOrganization(name: string): Promise<Organization> {
        const org = this.OrgRepo.create({ name });
        return this.OrgRepo.save(org);
    }
}
