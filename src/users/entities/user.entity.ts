import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
import { Document } from '../../documents/entities/document.entity';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password:string;

    @Column()
    name: string;

    @Column({nullable: true})
    organizationid: string;

    @ManyToOne(()=>Organization, (org) => org.users)
    organization: Organization;

    @OneToMany(() => Document, (doc) => doc.owner)
    documents: Document[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}