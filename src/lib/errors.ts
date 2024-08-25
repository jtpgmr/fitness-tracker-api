export class APIError extends Error {
    name: string;

    message: string;

    statusCode: number;

    constructor(message: string, name: string, statusCode: number) {
        super(message);
        this.name = name;
        this.message = message;
        this.statusCode = statusCode;
        // setting prototype is not needed if "target" is NOT es3 or es5 (tsconfig)
        // Object.setPrototypeOf(this, APIError.prototype);
    }
}

export class PageNotFoundError extends APIError {
    constructor(unknownUrl: string) {
        super(
            // Enter message
            `Page Not Found at: ${unknownUrl}`,
            // Exception type
            'PageNotFoundError',
            // Status code
            404,
        );
    }
}

export class RecordConflictError extends APIError {
    constructor(objectType: string, details: object) {
        super(
            `${objectType} record already exists with the following details: ${Object.entries(details).map(([k, v]) => `${k}='${v}'`).join(', ')}`,
            'RecordConflictError',
            409,
        );
    }
}

export class RecordNotFoundError extends APIError {
    constructor(resourceType: string, value: string, searchField: string = 'ID') {
        super(
            `${resourceType} record not found with ${searchField} ${value}`,
            'RecordNotFoundError',
            404,
        );
    }
}

export class UnknownServerError extends APIError {
    constructor(unhandledErrorType: string, message: string) {
        super(
            `${unhandledErrorType}: ${message}`,
            'UnknownServerError',
            500,
        );
    }
}

export class ValidationError extends APIError {
    constructor(objectType: string, msg: string) {
        super(
            `${objectType} handler error: ${msg}`,
            'ValidationError',
            400,
        );
    }
}
