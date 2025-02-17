import "dotenv/config";
import { Server } from "socket.io";

const PORT = process.env.PORT || "";

const io = new Server({
	cors: {
		origin: process.env.CLIENT_URL,
	},
});

let onlineUser = [];

const addUser = (userId, socketId) => {
	const userExits = onlineUser.find((user) => user.userId === userId);
	if (!userExits) {
		onlineUser.push({ userId, socketId });
	}
};

const removeUser = (socketId) => {
	onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
	return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
	socket.on("newUser", (userId) => {
		addUser(userId, socket.id);
	});

	socket.on("sendMessage", ({ receiverId, data }) => {
		const receiver = getUser(receiverId);
		io.to(receiver.socketId).emit("getMessage", data);
	});

	socket.on("disconnect", () => {
		removeUser(socket.id);
	});
});

io.listen(PORT);
