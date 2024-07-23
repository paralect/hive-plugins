import ioEmitter from "ioEmitter";
import db from "db";
const chatMessageService = db.services.chatMessages;
chatMessageService.on("created", async ({ doc: chatMessage }) => {
  ioEmitter
    .to(`chatRoom-${chatMessage.chatRoom._id}`)
    .emit("chatMessage:created", {
      chatMessage,
    });
});
