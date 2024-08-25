import { usersRepository as repository } from '#Api/DataSource';
import { Request, Response } from 'express';
import User from './users.entities';
import { generateUuid } from '#Api/helpers';
import { RecordConflictError, RecordNotFoundError } from '#Api/errors';
import { app } from '#Api/config/uuidSegments.json';
import { getAll, createOne, GetAll, updateOne } from '../../lib/genericControllers';
import { OrderType } from '#Api/types';
import { UUID } from 'crypto';
import { DeepPartial, FindOneOptions } from 'typeorm';

type CreateFields = {
    firstName: string,
    lastName: string,
    email: string,
    cognitoId: string;
    createdBy: UUID
}

type UpdateFields = {
    firstName: string,
    lastName: string,
    id: UUID,
    createdBy: UUID
}

const objectType = 'User';

export const getUsers = async ({ limit, order = 'ASC' as OrderType, offset = 0, where = {} }: Omit<GetAll<User>, 'repository'>) => getAll({ limit, repository, offset, order, where });

export const createUser = async ({ firstName, lastName, email, cognitoId, createdBy }: CreateFields): Promise<User> => {
    const checkCreatedByUser: User | null = await repository.findOne({ where: { id: createdBy } });

    if (checkCreatedByUser === null) {
        throw new RecordNotFoundError(objectType, createdBy as string);
    }

    return createOne({
        repository,
        objectType,
        createFields: { firstName, lastName, email, cognitoId, createdBy },
        conflictCheckFields: { email },
    });
};

// export const updateUser = async ({ firstName, lastName, id, createdBy }: UpdateFields): Promise<User> => {
//     updateOne({
//     repository,
//     objectType,
//     updateFields: { firstName, lastName },
//     conflictCheckFields: { id }
// })
// }

// export const updateOne = async (request: Request, response: Response): Promise<User | RecordNotFoundError> => {
// 	const { id } = request.params;
// 	const { firstName, lastName } = request.body;

// 	// the TypeORM "update" method does not return the updated entry
// 	// therefore, after an existing user is confirmed to be found,
// 	// the data in the req.body is sanitized and preloaded into a JS object containing the prior data for the entry (if it is not being updated)

// 	const preloadedRecord = await usersRepository.preload({ id });

// 	if (!preloadedRecord) return new RecordNotFoundError(Objects.USER, id);

// 	preloadedRecord.firstName = sanitizers.string(firstName, preloadedRecord.firstName, true);
// 	preloadedRecord.lastName = sanitizers.string(lastName, preloadedRecord.lastName, true);
// 	preloadedRecord.modifiedAt = new Date();

// 	const userToBeUpdated = await usersRepository.save(preloadedRecord);

// 	delete userToBeUpdated.deletedAt;

// 	return userToBeUpdated;
// };
