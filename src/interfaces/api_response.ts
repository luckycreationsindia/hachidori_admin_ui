/**
 * Represents the structure of an API error response.
 *
 * This interface is used to standardize how error responses
 * from APIs are represented. It contains details about
 * the error such as the HTTP status code and an optional
 * error message providing additional context about the failure.
 *
 * Fields:
 * - `status`: The HTTP status code representing the type of error.
 * - `message`: An optional string providing additional details about the error.
 */
export interface ApiErrorResponse {
    status: number;
    message?: string;
}

/**
 * Interface representing a successful API response.
 *
 * This interface is used to structure the response object returned by APIs
 * indicating a successful operation. It contains essential status information
 * and optional message or data payload.
 *
 * @interface ApiSuccessResponse
 *
 * @property {number} status - The HTTP status code representing the outcome of the API call.
 * @property {string} [message] - An optional message providing additional details about the success response.
 * @property {any} [data] - Optional data payload associated with the API response, if applicable.
 */
export interface ApiSuccessResponse {
    status: number;
    message?: string;
//eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
}