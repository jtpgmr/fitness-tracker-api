import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'foods' })
export class Food {
	@PrimaryColumn({ type: 'uuid' })
	    id: string;

	@Column({
	    unique: true,
	    nullable: false,
	})
	    edamamId: string;

	@Column({
	    unique: true,
	    nullable: false,
	    length: '33',
	})
	    edamamFoodId: string;

	@Column({
	    nullable: true,
	    length: '250',
	})
	    name: string;

	@Column({
	    nullable: false,
	    type: 'jsonb',
	})
	    aliases: string[];

	@Column({
	    nullable: false,
	    length: '50',
	})
	    category: string;

	@Column({
	    nullable: false,
	    length: '50',
	})
	    categoryLabel: string;

	@Column({
	    nullable: false,
	    length: '100',
	})
	    brand: string;

	@Column({
	    nullable: false,
	    type: 'jsonb',
	})
	    healthLabels: string[];

	@Column({
	    nullable: false,
	    type: 'jsonb',
	})
	    cautions: string[];

	@CreateDateColumn({
	    nullable: false,
	    type: 'timestamptz',
	    default: () => 'CURRENT_TIMESTAMP',
	})
	    createdAt: Date;

	@UpdateDateColumn({
	    nullable: true,
	    type: 'timestamptz',
	})
	    updatedAt: Date;

	@DeleteDateColumn({
	    nullable: true,
	    type: 'timestamptz',
	})
	    deletedAt: Date;
}
