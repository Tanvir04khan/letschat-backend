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
import { getChatsQuery, getUserStatusQuery } from "../../queries";
import { ResponseModel } from "../../models/responseModel";
import { MessagesType, ChatResponseType } from "../../type";

const getChats = async (req: Request, res: Response, next: NextFunction) => {
  const { senderPhoneNumber, receiverPhoneNumber } = req.query;
  try {
    if (!senderPhoneNumber || !receiverPhoneNumber) {
      throw new ErrorModel(StatusCode.BAD_REQUEST, ErrorMessages.GET_CHATS);
    }
    console.log(senderPhoneNumber, receiverPhoneNumber);
    const { rows: chats } = await pool.query<MessagesType>(getChatsQuery, [
      senderPhoneNumber,
      receiverPhoneNumber,
    ]);

    const { rows: receiverStatus } = await pool.query<{ status: Status }>(
      getUserStatusQuery,
      [receiverPhoneNumber]
    );

    res
      .status(StatusCode.OK)
      .json(
        new ResponseModel<ChatResponseType>(
          APIStatus.SUCCESS,
          StatusCode.OK,
          SuccessMessage.GET_CHATS,
          { chats, receiverStatus: receiverStatus[0].status }
        )
      );
  } catch (e) {
    next(e);
  }
};

export default getChats;
