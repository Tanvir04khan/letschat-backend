import { APIStatus, ErrorMessages, StatusCode, SuccessMessage } from "../utils";

export class ResponseModel<T = null> {
  status: APIStatus;
  statusCode: StatusCode;
  message: ErrorMessages | SuccessMessage | string;
  data: T | null;

  constructor(
    status: APIStatus,
    statusCode: StatusCode,
    message: ErrorMessages | SuccessMessage | string,
    data: T | null = null
  ) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
