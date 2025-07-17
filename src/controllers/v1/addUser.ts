import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../../models/errorModel";
import {
  APIStatus,
  ErrorMessages,
  Status,
  StatusCode,
  SuccessMessage,
} from "../../utils";
import pool from "../../database";
import { addUserQuery, getUserQuery } from "../../queries";
import { ResponseModel } from "../../models/responseModel";

const addUser = async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber } = req.body;
  try {
    if (!phoneNumber || phoneNumber.length !== 10) {
      throw new ErrorModel(StatusCode.BAD_REQUEST, ErrorMessages.ADD_USER);
    }

    const { rows: user } = await pool.query<{ userId: string }>(getUserQuery, [
      phoneNumber,
    ]);

    if (user.length) {
      throw new ErrorModel(StatusCode.CONFLICT, ErrorMessages.ALREADY_EXISTS);
    }

    const { rows: newUser } = await pool.query<{ userId: string }>(
      addUserQuery,
      [phoneNumber, Status.ONLINE]
    );

    if (newUser.length) {
      res
        .status(StatusCode.OK)
        .json(
          new ResponseModel<{ userId: string }>(
            APIStatus.SUCCESS,
            StatusCode.OK,
            SuccessMessage.ADD_USER,
            newUser[0]
          )
        );
    }
  } catch (e) {
    next(e);
  }
};

export default addUser;
