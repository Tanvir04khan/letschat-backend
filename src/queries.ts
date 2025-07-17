export const getChatsQuery = `SELECT * from messages WHERE "sentBy" = $1 AND "receivedBy" = $2 OR "sentBy" = $2 AND "receivedBy" = $1`;

export const postChatQuery = `INSERT INTO "messages" (
"sentBy",
"receivedBy",
"messageType",
"message",
"messageStatus"
) values ($1, $2, $3, $4, $5) RETURNING "messageId", "sentOn"`;

export const getUserQuery = `SELECT "userId" from users WHERE "phoneNumber" = $1`;

export const addUserQuery = `INSERT INTO "users" ("phoneNumber", "status") values ($1, $2) RETURNING "userId"`;

export const getUserStatusQuery = `SELECT "status" from users WHERE "phoneNumber" = $1`;

export const updateUserStatusQuery = `UPDATE "users" SET "status" = $1 WHERE "phoneNumber" = $2 RETURNING "userId"`;
