/* eslint-disable max-len */
/* eslint-disable global-require */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const relationsRoutes = require('./routes/realations');
const User = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/auth', authRoutes);
app.use('/', relationsRoutes);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-xaqtt.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    // eslint-disable-next-line no-console
    const server = app.listen(process.env.PORT || 8080, () => console.log('Server listening!'));
    const io = require('../socket').init(server);
    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
        const { socketUsers } = require('../socket');
        let disconnectedUserId;
        Object.keys(socketUsers).forEach((userId) => {
          if (socketUsers[userId].socket === socket.id) {
            disconnectedUserId = userId;
          }
        });
        delete socketUsers[disconnectedUserId];
        setTimeout(async () => {
          if (!(disconnectedUserId in socketUsers)) {
            try {
              const user = await User.findById(disconnectedUserId);
              if (user) {
                const userRelations = user.relations;
                userRelations.forEach((relation) => {
                  const relationUserId = relation.userId.toString();
                  if (relationUserId in socketUsers) {
                    io.to(socketUsers[relationUserId].socket).emit('disconnectRelationUser', user._id.toString());
                  }
                });
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log(err);
            }
          }
        }, 5000);
      });

      socket.on('new-user', async (id) => {
        const user = await User.findById(id);
        if (user) {
          const { socketUsers } = require('../socket');
          socketUsers[id] = { socket: socket.id };
        }
      });

      socket.on('end', async (userId) => {
        const { socketUsers } = require('../socket');
        let disconnectedUserId;
        Object.keys(socketUsers).forEach(() => {
          if (socketUsers[userId].socket === socket.id) {
            disconnectedUserId = userId;
          }
        });
        delete socketUsers[disconnectedUserId];
        setTimeout(async () => {
          // const socket = require('../socket');
          if (!(disconnectedUserId in socketUsers)) {
            try {
              const user = await User.findById(disconnectedUserId);
              if (user) {
                const userRelations = user.relations;
                userRelations.forEach((relation) => {
                  const relationUserId = relation.userId.toString();
                  if (relationUserId in socketUsers) {
                    io.to(socketUsers[relationUserId].socket).emit('disconnectRelationUser', user._id.toString());
                  }
                });
              }
            } catch (err) {
              // eslint-disable-next-line no-console
              console.log(err);
            }
          }
        }, 2000);
      });
    });
  })
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));
