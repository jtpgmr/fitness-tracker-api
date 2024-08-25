import "reflect-metadata";
import {
    BaseEntity,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    DeleteDateColumn,
    Column,
    ColumnOptions,
    UpdateDateColumn,
} from 'typeorm';

type UserAuditTimestampColumnDecorator =
	typeof CreateDateColumn |
	typeof DeleteDateColumn |
	typeof UpdateDateColumn;

type UserAuditColumnOptions = ColumnOptions & { columnName: string };

export interface APIBaseEntityBehavior {
	generateUserAuditColumn(options: ColumnOptions): PropertyDecorator;
	generateUserAuditTimestampColumn(decorator: UserAuditTimestampColumnDecorator, options: ColumnOptions): PropertyDecorator
	columnForeignKeyConstraintName(columnName: string, tableName: string, customConstraintName?: string): string;
}

export interface APIBaseEntityProps {
	serialId: number;
	id: string
}

export interface APIBaseEntityStandardAuditProps extends APIBaseEntityProps {
	createdBy: string;
	createdAt: Date;
	deletedBy: string;
	deletedAt: Date;
}

export interface APIBaseEntityModifiableAuditProps extends APIBaseEntityStandardAuditProps {
	updatedBy: string;
	updatedAt: Date;
}

@Entity()
class APIBaseEntity extends BaseEntity implements APIBaseEntityBehavior {
    generateUserAuditTimestampColumn(decorator: UserAuditTimestampColumnDecorator, options: ColumnOptions): PropertyDecorator {
        throw new Error('generateUserAuditTimestampColumn not implemented.');
    }
    generateUserAuditColumn(options: UserAuditColumnOptions): PropertyDecorator {
        throw new Error('generateUserAuditColumn not implemented.');
    }
    columnForeignKeyConstraintName(columnName: string, tableName: string, customConstraintName?: string): string {
        throw new Error('columnForeignKeyConstraintName not implemented.');
    }

    // constructor({ serialId, id }: APIBaseEntityProps) {
    // 	super()
    // 	this.serialId = serialId;
    // 	this.id = id;
    // }


    static _tableName: string;

    // Method to set the table name
    static setTableName(name: string) {
        this._tableName = name;
    }

    // Method to get the table name
    static getTableName(): string {
        if (!this._tableName) {
            throw new Error('Table name is not set.');
        }
        return this._tableName;
    }

	// review behavior
	@PrimaryGeneratedColumn('increment')
	    serialId: APIBaseEntityProps['serialId'];

	@PrimaryColumn({ type: 'uuid' })
	    id: APIBaseEntityProps['id'];


	static columnForeignKeyConstraintName = (columnName: string, customConstraintName?: string): string =>
	    customConstraintName || `${APIBaseEntity._tableName}_${columnName}_fkey`;


	static generateUserAuditColumn(options: UserAuditColumnOptions): PropertyDecorator {
	    return Column({
	        ...options,
	        type: 'uuid',
	        nullable: options.nullable,
	        foreignKeyConstraintName: options.foreignKeyConstraintName || APIBaseEntity.columnForeignKeyConstraintName(options.columnName),
	    });
	}

	static generateUserAuditTimestampColumn(decorator: UserAuditTimestampColumnDecorator, options: ColumnOptions): PropertyDecorator {
	    return decorator({
	        ...options,
	        type: 'timestamptz',
	        nullable: options.nullable,
	    });
	}
}

export default APIBaseEntity;
