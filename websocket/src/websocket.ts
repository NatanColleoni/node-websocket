import { io } from "./http";

interface RoomUser {
  socket_id: string;
  username: string;
  room: string;
}

interface Message {
  room: string;
  username: string;
  text: string;
  createdAt: Date;
}

const roomUsers: RoomUser[] = [];
const messages: Message[] = [];

io.on("connection", (socket) => {
  socket.on("join_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = roomUsers.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socket_id = socket.id;
    }

    roomUsers.push({
      socket_id: socket.id,
      username: data.username,
      room: data.room,
    });

    const messagesRoom = getMessageRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {
    const message: Message = {
      room: data.room,
      username: data.username,
      text: data.message,
      createdAt: new Date(),
    };

    messages.push(message);

    io.to(data.room).emit("message", message);
  });
});

function getMessageRoom(room: string) {
  const messageRoom = messages.filter((message) => message.room === room);
  return messageRoom;
}
