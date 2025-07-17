export enum StatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export enum APIStatus {
  SUCCESS = "success",
  ERROR = "error",
}
export enum ErrorMessages {
  GET_CHATS = "Please provide valid sender and receiver Phone number.",
  POST_MESSAGE = "Please provide valid message details.",
  ADD_USER = "Please provide valid phone number.",
  NOT_FOUND = "Not found.",
  INTERNAL_SERVER_ERROR = "Internal server error.",
  ALREADY_EXISTS = "Already exists.",
}

export enum SuccessMessage {
  GET_CHATS = "Chats found.",
  POST_MESSAGE = "Message sent successfully.",
  ADD_USER = "User added successfully.",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
}

export enum Status {
  ONLINE = "Online",
  OFFLINE = "Offline",
}
