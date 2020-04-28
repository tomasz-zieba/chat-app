/* eslint-disable max-len */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatRoomSchema = new Schema({
  chat: [
    {
      creator: {
          type: String,
          require: true,
        },
      text: {
        type: String,
        require: true
      },
      createdAt: {
        type: Date,
        require: true,
      }
    }
  ],
  participants: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
        require: true,
      }
    }
  ],
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
