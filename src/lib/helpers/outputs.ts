import { ApiResponse, ApiResponseInputs, ControllerResult } from '../types';
// { hasErrors: true, success: false, data: result, statusCode: res.statusCode }
export const controllerResponse = ({ hasErrors = false, data = [], statusCode = 200 }: ApiResponseInputs): ControllerResult => ({
    hasErrors,
    data,
    statusCode,
});

const apiResponse = ({ hasErrors = false, data = [] }: ApiResponseInputs): ApiResponse => ({
    hasErrors,
    count: data instanceof Array ? data.length : 1,
    data,
});

export default apiResponse;
