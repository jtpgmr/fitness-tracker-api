
import { DeepPartial, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { APIError, RecordConflictError, RecordNotFoundError, ValidationError } from '#Api/errors';
import AppDataSource from '#Api/DataSource';
import { ApiRepository, PaginationResult } from './types';
import { generateUuid, handleUuidValidation } from './helpers/uuids';
import APIBaseEntity from '#Api/BaseEntity';
import { instanceToPlain } from 'class-transformer';

interface BaseControllerInputs<T extends APIBaseEntity> {
	repository: Repository<T>;
}

export interface GetAll<T extends APIBaseEntity> extends BaseControllerInputs<T>, PaginationResult {
	where?: FindOptionsWhere<T>;
}

type EntityFields<T extends APIBaseEntity> = Record<keyof T, unknown>

interface EffectResource<T extends APIBaseEntity> extends BaseControllerInputs<T> {
	objectType: string;
}

interface CreateOne<T extends APIBaseEntity> extends EffectResource<T> {
	createFields: Partial<EntityFields<T>>
	conflictCheckFields?: FindOptionsWhere<T>;
}

interface UpdateOne<T extends APIBaseEntity> extends EffectResource<T> {
	updateFields: Partial<EntityFields<T>>
	conflictCheckFields?: FindOptionsWhere<T>;
}

export const getAll = async <T extends APIBaseEntity>({
    repository,
    limit,
    offset = 0,
    order = 'ASC',
    where = {},
}: GetAll<T>): Promise<T[]> => {
    const orderBy = { serialId: order } as FindOptionsOrder<T>;

    const records = await repository.find({ where, order: orderBy, skip: offset, take: limit && limit });

    // converts TypeORM entity to generic class version of type T
    return instanceToPlain(records) as T[];
};

export const createOne = async <T extends APIBaseEntity>({ repository, objectType, createFields, conflictCheckFields = {} }: CreateOne<T>): Promise<T> => {
    const conflictFieldEntries = Object.entries(conflictCheckFields);

    if (conflictFieldEntries.length > 0) {
        if (conflictFieldEntries.some(([_, v]) => v === undefined)) {
            throw new ValidationError(objectType, `The following conflict check fields are missing: ${conflictFieldEntries.map(([k, _]) => k).join(', ')}`);
        }

        const records: T[] = await getAll({ repository, where: conflictCheckFields });

        if (records.length > 0) {
            throw new RecordConflictError(objectType, conflictCheckFields);
        }
    }

    const recordId = generateUuid();

    const newRecord = repository.create({ ...createFields, id: recordId } as DeepPartial<T>);

    return repository.save(newRecord);
};

export const updateOne = async <T extends APIBaseEntity>({ repository, objectType, updateFields, conflictCheckFields = {} }: UpdateOne<T>): Promise<T> => {
    // check if record for id exists
    const { id } = updateFields;
    const updateRecord: T | null = await repository.findOne({ where: { id } as FindOptionsWhere<T> });

    if (updateRecord === null) {
        throw new RecordNotFoundError(objectType, id as string);
    }

    const conflictFieldEntries = Object.entries(conflictCheckFields);
    if (conflictFieldEntries.length > 0) {
        if (conflictFieldEntries.some(([, v]) => v === undefined)) {
            throw new ValidationError(objectType, `The following conflict check fields are missing: ${conflictFieldEntries.map(([k]) => k).join(', ')}`);
        }

        const records: T[] = await getAll({ repository, where: conflictCheckFields });

        if (records.length > 0) {
            console.log(conflictCheckFields);
            throw new RecordConflictError(objectType, conflictCheckFields);
        }
    }

    const newRecord = repository.create({ ...updateFields } as DeepPartial<T>);

    return repository.save(newRecord);
};