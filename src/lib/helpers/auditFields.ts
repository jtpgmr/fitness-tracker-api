import { UUID } from 'crypto';
import { generateUuid } from './uuids';

export const createdRecordAuditFields = ({
    createdBy,
    uuidSegment,
}: {
	createdBy: UUID;
	uuidSegment: string;
}): { createdBy: UUID; id: UUID } => ({
    createdBy,
    id: generateUuid(uuidSegment),
});

export const updatedRecordAuditFields = ({ updatedBy }: { updatedBy: UUID; }): { updatedAt: Date; updatedBy: UUID } => ({
    updatedAt: new Date(),
    updatedBy,
});

export const deletedRecordAuditFields = ({ deletedBy }: { deletedBy: UUID }): { deletedAt: Date; deletedBy: UUID } => ({
    deletedAt: new Date(),
    deletedBy,
});
