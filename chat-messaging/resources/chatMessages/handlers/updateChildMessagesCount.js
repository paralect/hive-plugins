const chatMessageService = require('db').services.chatMessages;

let updateChildMessagesCount = async ({ doc: chatMessage }) => {
  if (chatMessage.parentMessage) {
    await chatMessageService.atomic.update(
      { _id: chatMessage.parentMessage._id }, { 
        $set: {
          childMessagesCount: await chatMessageService.count({'parentMessage._id': chatMessage.parentMessage._id})
        }
      }
    );
  }
}

chatMessageService.on('created', updateChildMessagesCount);
chatMessageService.on('removed', updateChildMessagesCount);