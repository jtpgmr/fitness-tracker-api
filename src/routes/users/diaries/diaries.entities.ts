import 'reflect-metadata';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import APIBaseEntity, { APIBaseEntityModifiableAuditProps } from '#Api/BaseEntity';
import AppDbStructure from '#Api/config/dbStructure.json';

interface DiaryEntityProps extends APIBaseEntityModifiableAuditProps {
	userId: string,
	mealType: number,
	meal: Array<string>,
}

@Entity({ name: APIBaseEntity.getTableName() })
class Diary extends APIBaseEntity {
    static {
        const diaryTableName = AppDbStructure.tables.diaries;
        APIBaseEntity.setTableName(diaryTableName);
    }

	@APIBaseEntity.generateUserAuditColumn({
	    nullable: false,
	    columnName: 'userId',
	})
	    userId: string;

	@Column({
	    type: 'smallint',
	    nullable: false,
	})
	    mealType: number;

	@Column({
	    type: 'jsonb',
	    nullable: true,
	})
	    meal: Array<string>;

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


export default Diary;
