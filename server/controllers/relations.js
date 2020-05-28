const { validationResult } = require('express-validator');
const User = require('../models/user');
const ChatRoom = require('../models/chatRoom');
const io = require('../../socket');

exports.findUsers = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.msg = errors.msg;
    throw error;
  }
  const { name } = req.body;
  try {
    const users = await User.find({ name: { $regex: name, $options: 'i' } });
    const updatedUsers = users.filter((user) => user.id.toString() !== req.userId);
    const findedUsers = updatedUsers.map((user) => ({
      name: user.name,
      id: user.id.toString(),
    }));
    res.status(201).json({
      users: findedUsers,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.sendInvitation = async (req, res, next) => {
  const { id } = req.body;
  try {
    const userSendInv = await User.findById(req.userId);
    const user = await User.findById(id);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    const isInvitationAlreadyOnList = user.invitations.filter((invitation) => invitation.userId.toString() === req.userId.toString());
    if (!isInvitationAlreadyOnList.length) {
      user.invitations.push({ userId: req.userId, name: userSendInv.name });
      await user.save();
      if (user._id.toString() in io.socketUsers) {
        io
          .getIO()
          .to(io.socketUsers[user._id.toString()].socket)
          .emit('add-invitation',
            {
              userId: req.userId,
              name: userSendInv.name,
              text: `${userSendInv.name} send you an invitation!`,
              type: 'invitation',
            });
      }
      res.status(201).json({
        message: `Invitation for ${user.name} send succesfully`,
        userId: id,
        name: user.name,
      });
    } else {
      res.status(200).json({
        message: `Invitation for ${user.name} was already sended`,
        userId: id,
        name: user.name,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.acceptInvitation = async (req, res, next) => {
  const { id } = req.body;
  try {
    const userAcceptInv = await User.findById(req.userId);
    const userSendInv = await User.findById(id);
    if (!userAcceptInv || !userSendInv) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }
    const chatRoom = new ChatRoom({
      chat: [
        {
          creator: userAcceptInv.name,
          text: `Hello ${userSendInv.name}. I accepted your invitation and we can chat now!`,
          createdAt: new Date(),
        },
      ],
      participants: [
        {
          userId: userAcceptInv._id,
          name: userAcceptInv.name,
        }, {
          userId: userSendInv._id,
          name: userSendInv.name,
        }],
    });
    await chatRoom.save();
    [userAcceptInv, userSendInv].forEach(async (user, index, array) => {
      const updatedInvitations = user.invitations.filter((invitation) => invitation.userId.toString() !== userSendInv._id.toString() && invitation.userId.toString() !== userAcceptInv._id.toString());
      user.invitations = updatedInvitations;
      const updatedChatRooms = [...user.chatRooms, { chatRoomId: chatRoom._id }];
      user.chatRooms = updatedChatRooms;
      if (index === 0) {
        user.relations = [...user.relations, { userId: array[1]._id.toString(), name: array[1].name }];
      } else if (index === 1) {
        user.relations = [...user.relations, { userId: array[0]._id.toString(), name: array[0].name }];
      }
      await user.save();
      if (user._id.toString() in io.socketUsers) {
        const interlocutor = chatRoom.participants.filter((chatUser) => chatUser.userId.toString() !== user._id.toString());
        const chats = {
          chatId: chatRoom._id.toString(),
          interlocutor: interlocutor[0].name,
          interlocutorId: index === 0 ? array[1]._id.toString() : array[0]._id.toString(),
          chat: chatRoom.chat,
        };

        let interlocutoIsOnline = false;
        console.log('io.socketUsers');
        console.log(io.socketUsers);
        console.log(interlocutor[0]);
        console.log('interlocutor[0]');
        if (interlocutor[0].userId.toString() in io.socketUsers) {
          interlocutoIsOnline = true;
        }
        await io
          .getIO()
          .to(io.socketUsers[user._id.toString()].socket)
          .emit('accept-invitation', chats, { interlocutorOnline: interlocutoIsOnline });
      }
    });
    if (userSendInv._id.toString() in io.socketUsers) {
      io
        .getIO()
        .to(io.socketUsers[userSendInv._id.toString()].socket)
        .emit('send-info',
          {
            name: userAcceptInv.name,
            text: `${userAcceptInv.name} accept your invitation.`,
            userId: userAcceptInv._id.toString(),
            type: 'info',
          });
    }
    res.status(200).json({
      message: 'Invitation accpeted succesfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.declineInvitation = async (req, res, next) => {
  const { id } = req.body;
  try {
    const userDecInv = await User.findById(req.userId);
    const userSendInv = await User.findById(id);
    if (!userDecInv || !userSendInv) {
      const error = new Error('Could not find user.');
      error.statusCode = 404;
      throw error;
    }

    [userDecInv, userSendInv].forEach(async (user) => {
      const updatedInvitations = user.invitations.filter((invitation) => invitation.userId.toString() !== userSendInv._id.toString() && invitation.userId.toString() !== userDecInv._id.toString());
      user.invitations = updatedInvitations;
      await user.save();
    });
    if (userSendInv._id.toString() in io.socketUsers) {
      io
        .getIO()
        .to(io.socketUsers[userSendInv._id.toString()].socket)
      // .emit('decline-invitation',
        .emit('send-info',
          {
            name: userDecInv.name,
            text: `${userDecInv.name} declined your invitation.`,
            userId: userDecInv._id.toString(),
            type: 'info',
          });
    }

    res.status(200).json({
      message: 'Invitation accpeted succesfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.addMessage = async (req, res, next) => {
  const { message, chatId, author } = req.body;
  try {
    const chatRoom = await ChatRoom.findById(chatId);
    if (!chatRoom) {
      const error = new Error('Could not find chat.');
      error.statusCode = 404;
      throw error;
    }
    const newMessage = {
      creator: author,
      text: message,
      createdAt: new Date(),
    };
    if (chatRoom.chat.length >= 100) {
      chatRoom.chat.splice(0, chatRoom.chat.length - 99);
    }
    chatRoom.chat.push(newMessage);
    await chatRoom.save();

    chatRoom.participants.forEach((user) => {
      if (user.userId.toString() in io.socketUsers) {
        io
          .getIO()
          .to(io.socketUsers[user.userId.toString()].socket)
          .emit('send-message',
            {
              chatId,
              message: chatRoom.chat[chatRoom.chat.length - 1],
            });
      }
    });
    res.status(200).json({
      message: 'Message save succesfully',
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
