
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const io = require('../../socket');

function emitInfoToRelationsOnline(user) {
  const userRelations = user.relations;
  userRelations.forEach(async (relation) => {
    const relationUserId = relation.userId.toString();
    if (relationUserId in io.socketUsers) {
      await io
        .getIO()
        .to(io.socketUsers[relationUserId].socket)
        .emit('connected-info', user._id.toString());
    }
  });
}

function createInvitationList(user) {
  const invitations = [];
  user.invitations.forEach((invitation) => {
    invitations.push(
      {
        userId: invitation.userId.toString(),
        name: invitation.name,
        text: `${invitation.name} send you an invitation`,
        type: 'invitation',
      },
    );
  });
  return invitations;
}

function createChatsList(user) {
  const chats = [];
  user.chatRooms.forEach((chat) => {
    const interlocutor = chat.chatRoomId.participants.filter((chatUser) => chatUser.userId.toString() !== user._id.toString());
    chats.push({
      chatId: chat.chatRoomId._id.toString(),
      interlocutor: interlocutor[0].name,
      interlocutorId: interlocutor[0].userId,
      chat: chat.chatRoomId.chat,
    });
  });
  return chats;
}

function createOnlineRelationsList(user) {
  const onlineUsers = [];
  user.relations.forEach((relationUser) => {
    if (relationUser.userId.toString() in io.socketUsers) {
      onlineUsers.push(relationUser.userId.toString());
    }
  });
  return onlineUsers;
}


exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.msg = errors.msg;
    throw error;
  }
  const { name } = req.body;
  const { password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      password: hashedPw,
      name,
    });
    const result = await user.save();
    res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.login = async (req, res, next) => {
  const { password } = req.body;
  const { name } = req.body;
  try {
    const user = await User.findOne({ name });
    await user.populate('chatRooms.chatRoomId').execPopulate();
    if (!user) {
      const error = new Error('A user with this name not found.');
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id.toString(),
      },
      'secret',
      { expiresIn: '1h' },
    );
    const invitations = createInvitationList(user);
    const chats = createChatsList(user);
    const onlineUsers = createOnlineRelationsList(user);
    res.status(200).json({
      token, userId: user._id.toString(), userName: user.name, invitations, chats, onlineUsers,
    });
    emitInfoToRelationsOnline(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.autoLogin = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('A user with this name not found.');
      error.statusCode = 401;
      throw error;
    }
    await user.populate('chatRooms.chatRoomId').execPopulate();
    const invitations = createInvitationList(user);
    const chats = createChatsList(user);
    const onlineUsers = createOnlineRelationsList(user);
    if (user._id.toString() in io.socketUsers) {
      delete io.socketUsers[user._id.toString()];
    }
    res.status(200).json({
      userId: user._id.toString(), userName: user.name, invitations, chats, onlineUsers,
    });
    emitInfoToRelationsOnline(user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
