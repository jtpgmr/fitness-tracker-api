import { ErrorObject } from '../types';

const createErrorObj = (exceptionType: string, message: string): ErrorObject => ({
    exceptionType,
    message: message.trim(),
});

export default createErrorObj;
