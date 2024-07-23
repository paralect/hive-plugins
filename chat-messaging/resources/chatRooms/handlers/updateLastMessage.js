import db from "db";
const chatMessageService = db.services.chatMessages;
const chatRoomService = db.services.chatRooms;
chatMessageService.on("created", async ({ doc: message }) => {
  await chatRoomService.updateOne({ _id: message.chatRoom._id }, (chatRoom) => {
    return {
      ...chatRoom,
      lastMessageHTML: message.messageHTML,
      lastMessageUser: message.fromUser || null,
      lastMessageSentOn: message.createdOn,
    };
  });
});
