const chatMessageService = require('db').services.chatMessages;
const chatRoomService = require('db').services.chatRooms;

chatMessageService.on('created', async ({ doc: message }) => {
  await chatRoomService.updateOne(
    { _id: message.chatRoom._id },
    (chatRoom) => {
      return {
        ...chatRoom,
        lastMessageHTML: message.messageHTML,
        lastMessageUser: message.fromUser || null,
        lastMessageSentOn: message.createdOn,
      };
    }
  );
});