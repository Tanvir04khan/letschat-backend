import { Status } from "./utils";

export type MessagesType = {
  messageId: string;
  sentBy: string;
  receivedBy: string;
  messageType: string;
  message: string;
  sentOn: string;
};

export type ChatResponseType = {
  chats: MessagesType[];
  receiverStatus: Status;
};
