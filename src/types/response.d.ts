export interface ApiResponse<T = any> {
    code: number;
    data: T;
    message: string;
}
export interface PageResult<T> {
    list: T[];
    total: number;
}