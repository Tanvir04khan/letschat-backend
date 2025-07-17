import { NextFunction, Request, Response } from "express";
import { ErrorModel } from "../../models/errorModel";
import {
  APIStatus,
  ErrorMessages,
  MessageType,
  StatusCode,
  SuccessMessage,
} from "../../utils";
import pool from "../../database";
import { postChatQuery } from "../../queries";
import { ResponseModel } from "../../models/responseModel";

const postChat = async (req: Request, res: Response, next: NextFunction) => {
  const { senderPhoneNumber, receiverPhoneNumber, messageType, message } =
    req.body;
  try {
    if (
      !senderPhoneNumber ||
      !receiverPhoneNumber ||
      !messageType ||
      !message
    ) {
      throw new ErrorModel(StatusCode.BAD_REQUEST, ErrorMessages.POST_MESSAGE);
    }

    if (messageType === MessageType.TEXT) {
      const { rows: newMessage } = await pool.query<{ messageId: string }>(
        postChatQuery,
        [senderPhoneNumber, receiverPhoneNumber, messageType, message]
      );

      res
        .status(StatusCode.OK)
        .json(
          new ResponseModel<{ messageId: string }[]>(
            APIStatus.SUCCESS,
            StatusCode.OK,
            SuccessMessage.POST_MESSAGE,
            newMessage
          )
        );
    }
  } catch (e) {
    next(e);
  }
};

export default postChat;
