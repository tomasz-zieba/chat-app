/* eslint-disable max-len */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  invitations: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
        require: true,
      },
    },
  ],
  relations: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      name: {
        type: String,
        require: true,
      },
    },
  ],
  chatRooms: [
    {
      chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
      },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
