import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    JoinColumn,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { Food } from '../foods.entities';

@Entity({ name: 'nutrientData' })
export class NutrientData {
	@PrimaryColumn({ type: 'uuid' })
	    id: string;

	@OneToOne(() => Food, food => food.id)
	@Column({
	    unique: true,
	    nullable: false,
	})
	@JoinColumn()
	    foodId: Food['id'];

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
	    nullable: true,
	    length: '50',
	})
	    category: string;

	@Column({
	    nullable: true,
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
