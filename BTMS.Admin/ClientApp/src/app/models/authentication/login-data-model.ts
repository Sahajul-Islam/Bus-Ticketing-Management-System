export interface LoginDataModel {
     userName?: string,
     accessToken?: string,
     role?: string[],
     tokenExipres?: Date |undefined,
     refreshToken?: string,
     conpanyId?:number |undefined;
}
