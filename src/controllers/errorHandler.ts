import { NextFunction, Request, Response } from "express";
import { ErrorMessages, StatusCode, APIStatus } from "../utils";
import { ErrorModel } from "../models/errorModel";
import { ResponseModel } from "../models/responseModel";

export const errorHandler = (
  error: ErrorModel,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(error);
    res
      .status(error.statusCode)
      .json(
        new ResponseModel(APIStatus.ERROR, error.statusCode, error.errorMessage)
      );
  } catch (e: any) {
    console.log(e);
    res
      .status(StatusCode.SERVER_ERROR)
      .json(
        new ResponseModel<null>(
          APIStatus.ERROR,
          StatusCode.SERVER_ERROR,
          e.message as string
        )
      );
  }
};
