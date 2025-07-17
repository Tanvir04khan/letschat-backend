import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageType, Status } from "./utils";
import pool from "./database";
import { postChatQuery, updateUserStatusQuery } from "./queries";
import path from "path";
import fs from "fs";
import ENV_VARS from "./env_vars";

export class SocketIoServices {
  onlineUsers: Map<string, string> = new Map();
  userRooms: Map<string, string> = new Map();
  io: Server;

  constructor(httpServer: HttpServer) {
    this.io = new Server(httpServer);
    this.registerSocketIoEvents();
  }

  private registerSocketIoEvents = () => {
    this.io.on("connection", (socket) => {
      console.log("user connected : ", socket.id);

      socket.on("join-letsChat-room", this.onJoinLetsChatRoom(socket));

      socket.on("send-message", this.onSendMessage(socket));

      socket.on("disconnect-letsChat", this.disconnect());
    });
  };

  private onJoinLetsChatRoom = (socket: Socket) => {
    return async (phoneNumber: string) => {
      this.onlineUsers.set(phoneNumber, socket.id);
      console.log("test", phoneNumber);
      await this.updateUserStatus(phoneNumber, Status.ONLINE);
      this.io.emit("update-user-status", {
        phoneNumber,
        status: Status.ONLINE,
      });
    };
  };

  private onSendMessage = (socket: Socket) => {
    return async (
      senderPhoneNumber: string,
      receiverPhoneNumber: string,
      messageType: MessageType,
      message: string | { imageBuffer: number[]; fileName: string },
      callback: (errorMessage: string) => void
    ) => {
      console.log(messageType, "==================================");
      if (
        !senderPhoneNumber ||
        !receiverPhoneNumber ||
        !messageType ||
        !message
      ) {
        callback("Invalid message details.");
      }

      const receiverSocketId = this.onlineUsers.get(receiverPhoneNumber) ?? "";
      if (messageType === "text") {
        const { rows: newMessage } = await pool.query<{
          messageId: string;
          sentOn: string;
        }>(postChatQuery, [
          senderPhoneNumber,
          receiverPhoneNumber,
          messageType,
          message,
          !receiverSocketId ? false : true,
        ]);
        if (!newMessage.length) {
          callback("Something went wrong while saving the message.");
        }

        if (!this.onlineUsers.has(receiverPhoneNumber)) {
          // To write notification logic
          return;
        }
        callback(`${newMessage[0].messageId} | ${newMessage[0].sentOn}`);
        // To write notification logic
        if (!receiverSocketId) return;

        return socket.to(receiverSocketId).emit("receive-message", {
          senderPhoneNumber,
          message,
          messageType,
          receiverPhoneNumber,
          messageId: newMessage[0].messageId,
          sentOn: newMessage[0].sentOn,
        });
      }

      if (messageType === MessageType.IMAGE && typeof message === "object") {
        console.log("from messagetype image ......");
        const filePath = path.join(__dirname, "uploads", message.fileName);
        fs.writeFileSync(filePath, Buffer.from(message.imageBuffer));

        const fileUrl = `http://localhost:${ENV_VARS.PORT}/uploads/${message.fileName}`;
        const { rows: newMessage } = await pool.query<{
          messageId: string;
          sentOn: string;
        }>(postChatQuery, [
          senderPhoneNumber,
          receiverPhoneNumber,
          messageType,
          fileUrl,
          !receiverSocketId ? false : true,
        ]);
        callback("uploaded");
        return socket.to(receiverSocketId).emit("receive-message", {
          senderPhoneNumber,
          fileUrl,
          messageType,
          receiverPhoneNumber,
          messageId: newMessage[0].messageId,
          sentOn: newMessage[0].sentOn,
        });
      }
    };
  };

  private disconnect = () => {
    return async (phoneNumber: string) => {
      this.onlineUsers.delete(phoneNumber);
      await this.updateUserStatus(phoneNumber, Status.OFFLINE);
      this.io.emit("update-user-status", {
        phoneNumber,
        status: Status.OFFLINE,
      });
    };
  };

  private updateUserStatus = async (phoneNumber: string, status: Status) => {
    try {
      if (!phoneNumber || !status) {
        throw Error("Invalid phone number or status.");
      }
      console.log(status, phoneNumber, "why....====");
      const { rows: user } = await pool.query<{ userId: string }>(
        updateUserStatusQuery,
        [status, phoneNumber]
      );
      console.log(user, "........................................");
      if (!user.length)
        throw Error("Something went wrong while updating status.");
    } catch (e) {
      console.log(e);
    }
  };
}
