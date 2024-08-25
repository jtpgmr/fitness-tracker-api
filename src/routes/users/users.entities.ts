import 'reflect-metadata';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import APIBaseEntity, { APIBaseEntityModifiableAuditProps, APIBaseEntityProps } from '#Api/BaseEntity';
import AppDbStructure from '#Api/config/dbStructure.json';

export interface UserEntityProps extends APIBaseEntityModifiableAuditProps {
	firstName: string,
	lastName: string,
	email: string,
	cognitoId: string;
}

@Entity({ name: APIBaseEntity.getTableName() })
class User extends APIBaseEntity {
    static {
        const userTableName = AppDbStructure.tables.users;
        APIBaseEntity.setTableName(userTableName);
    }

	@Column({ type: 'varchar', nullable: false })
	    firstName: string;

	@Column({ type: 'varchar', nullable: false })
	    lastName: string;

	@Column({ type: 'varchar', nullable: false, unique: true })
	    email: string;

	@Column({ type: 'varchar', nullable: false, unique: true })
	    cognitoId: string;

	@APIBaseEntity.generateUserAuditColumn({ nullable: false, columnName: 'createdBy' })
	    createdBy: string;

	@APIBaseEntity.generateUserAuditTimestampColumn(CreateDateColumn, { nullable: false, default: 'NOW()' })
	    createdAt: Date;


	@APIBaseEntity.generateUserAuditColumn({ nullable: false, columnName: 'updatedBy' })
	    updatedBy: string;

	@APIBaseEntity.generateUserAuditTimestampColumn(UpdateDateColumn, { nullable: true })
	    updatedAt: Date;

	@APIBaseEntity.generateUserAuditColumn({
	    nullable: false,
	    select: true,
	    columnName: 'deletedBy',
	})
	    deletedBy: string;

	@APIBaseEntity.generateUserAuditTimestampColumn(DeleteDateColumn, { nullable: true, select: false })
	    deletedAt: Date;
}

export default User;
