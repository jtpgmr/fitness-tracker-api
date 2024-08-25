import Joi from 'joi';
import { v4 } from 'uuid';
import { ValidationError } from '../errors';
import { UUID } from 'crypto';

const UUIDSegmentRegex = /[0-9A-Fa-f]{4}/g;

type StandardUuidValidatorProps = {
    objectType: string;
    uuidSegment?: string;
};

export const generateUuid = (uuidSegment?: string): UUID => {
    const uuid: string = v4();

    if (!uuidSegment) return uuid as UUID;

    const uuidSegments: string[] = uuid.split('-');
    uuidSegments[1] = uuidSegment;

    return uuidSegments.join('-') as UUID;
};

export const uuidValidator = ({
    objectType,
    uuidSegment,
}: StandardUuidValidatorProps): Joi.StringSchema<string> => {
    if (uuidSegment) {
        if (!uuidSegment.match(UUIDSegmentRegex)) {
            throw new ValidationError(objectType, `Segment must be a valid hexadecimal value. Received "${uuidSegment}"`);
        }
        if (uuidSegment.length !== 4) {
            throw new ValidationError(objectType, `Segment must be 4 characters long. Received "${uuidSegment}"`);
        }
    }

    return Joi.string()
        .guid({ version: 'uuidv4', separator: '-' })
        .required()
        .custom((value: string) => {
            const segment = value.split('-')[1];
            if (!!uuidSegment && segment !== uuidSegment) {
                throw new ValidationError(objectType, `segment is not valid for ${objectType} database object`);
            }

            return value;
        }, 'Checks valid second segment of UUID and returns back the inserted, complete UUID value');
};

export const handleUuidValidation = async ({
    field,
    objectType,
    uuid,
    uuidSegment,
}: StandardUuidValidatorProps & { field: string; uuid: string }) => {
    try {
        await uuidValidator({ objectType, uuidSegment }).validateAsync(uuid);
    } catch (e) {
        if (e instanceof Joi.ValidationError) {
            const errorDetails = e.details.map(detail => detail.type);

            if (errorDetails.includes('string.base')) {
                throw new ValidationError(objectType, `${field} must be a string`);
            }
            throw e;
        }
    }
};