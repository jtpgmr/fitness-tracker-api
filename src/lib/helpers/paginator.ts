import { OrderType, PaginateOptions, PaginationResult } from '#Api/types';

const orderOptions = {
    ASC: 'ASC',
    DESC: 'DESC',
};

const paginator = (queryObj: PaginateOptions): PaginationResult => {
    let { page, count, order }: PaginateOptions = queryObj;

    if (!page || (typeof page === 'string' && +page <= 0) || (typeof page === 'number' && page <= 0) || +page % 1 !== 0) {
        page = '1';
    }

    if (
        count == null ||
		(['string', 'number'].includes(typeof count) && (+count <= 0 || +count % 1 !== 0))
    ) {
        count = 0;
    }

    if (!order) {
        order = orderOptions.ASC;
    }

    order = order.toUpperCase();

    if (!Object.values(orderOptions).includes(order as OrderType)) {
        order = orderOptions.ASC;
    }

    const countAsNumber = count && +count;
    const pageAsNumber = +page;

    return {
        limit: countAsNumber || undefined,
        offset: typeof countAsNumber === 'number' ? countAsNumber * (pageAsNumber - 1) : 0,
        order: order as OrderType,
    };
};

export default paginator;
