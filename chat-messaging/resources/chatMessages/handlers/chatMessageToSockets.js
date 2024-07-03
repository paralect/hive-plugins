const ioEmitter = require('ioEmitter');
const chatMessageService = require('db').services.chatMessages;

chatMessageService.on('created', async ({ doc: chatMessage }) => {
  ioEmitter
    .to(`chatRoom-${chatMessage.chatRoom._id}`)
    .emit('chatMessage:created', {
      chatMessage,
    });
});