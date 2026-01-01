import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/organization.dto';

@Controller('organizations')
export class OrganizationController {
    constructor(private readonly orgService: OrganizationsService) { }

    @Post()
    async createOrganization(@Body() createOrgDto: CreateOrganizationDto) {
        // DTO validation is automatic via ValidationPipe in main.ts
        // Extract values from DTO
        const { name } = createOrgDto;

        // Call service
        return this.orgService.createOrganization(name);
    }
}