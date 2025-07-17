import { StatusCode, ErrorMessages } from "../utils";

export class ErrorModel extends Error {
  statusCode: StatusCode;
  errorMessage: ErrorMessages;

  constructor(statusCode: StatusCode, message: ErrorMessages) {
    super();
    this.statusCode = statusCode;
    this.errorMessage = message;
  }
}
