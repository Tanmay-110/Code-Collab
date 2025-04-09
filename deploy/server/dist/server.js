"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_1 = require("./types/socket");
const user_1 = require("./types/user");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Configure CORS for production
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://code-sync.vercel.app', /\.vercel\.app$/]
        : '*',
    methods: ['GET', 'POST'],
    credentials: true
}));
// Serve static files from the public directory
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? ['https://code-sync.vercel.app', /\.vercel\.app$/]
            : '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
});
let userSocketMap = [];
// Function to get all users in a room
function getUsersInRoom(roomId) {
    return userSocketMap.filter((user) => user.roomId == roomId);
}
// Function to get room id by socket id
function getRoomId(socketId) {
    const roomId = userSocketMap.find((user) => user.socketId === socketId)?.roomId;
    if (!roomId) {
        console.error("Room ID is undefined for socket ID:", socketId);
        return null;
    }
    return roomId;
}
function getUserBySocketId(socketId) {
    const user = userSocketMap.find((user) => user.socketId === socketId);
    if (!user) {
        console.error("User not found for socket ID:", socketId);
        return null;
    }
    return user;
}
io.on("connection", (socket) => {
    // Handle user actions
    socket.on(socket_1.SocketEvent.JOIN_REQUEST, ({ roomId, username }) => {
        // Check is username exist in the room
        const isUsernameExist = getUsersInRoom(roomId).filter((u) => u.username === username);
        if (isUsernameExist.length > 0) {
            io.to(socket.id).emit(socket_1.SocketEvent.USERNAME_EXISTS);
            return;
        }
        const user = {
            username,
            roomId,
            status: user_1.USER_CONNECTION_STATUS.ONLINE,
            cursorPosition: 0,
            typing: false,
            socketId: socket.id,
            currentFile: null,
        };
        userSocketMap.push(user);
        socket.join(roomId);
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.USER_JOINED, { user });
        const users = getUsersInRoom(roomId);
        io.to(socket.id).emit(socket_1.SocketEvent.JOIN_ACCEPTED, { user, users });
    });
    socket.on("disconnecting", () => {
        const user = getUserBySocketId(socket.id);
        if (!user)
            return;
        const roomId = user.roomId;
        socket.broadcast
            .to(roomId)
            .emit(socket_1.SocketEvent.USER_DISCONNECTED, { user });
        userSocketMap = userSocketMap.filter((u) => u.socketId !== socket.id);
        socket.leave(roomId);
    });
    // Handle file actions
    socket.on(socket_1.SocketEvent.SYNC_FILE_STRUCTURE, ({ fileStructure, openFiles, activeFile, socketId }) => {
        io.to(socketId).emit(socket_1.SocketEvent.SYNC_FILE_STRUCTURE, {
            fileStructure,
            openFiles,
            activeFile,
        });
    });
    socket.on(socket_1.SocketEvent.DIRECTORY_CREATED, ({ parentDirId, newDirectory }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.DIRECTORY_CREATED, {
            parentDirId,
            newDirectory,
        });
    });
    socket.on(socket_1.SocketEvent.DIRECTORY_UPDATED, ({ dirId, children }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.DIRECTORY_UPDATED, {
            dirId,
            children,
        });
    });
    socket.on(socket_1.SocketEvent.DIRECTORY_RENAMED, ({ dirId, newName }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.DIRECTORY_RENAMED, {
            dirId,
            newName,
        });
    });
    socket.on(socket_1.SocketEvent.DIRECTORY_DELETED, ({ dirId }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast
            .to(roomId)
            .emit(socket_1.SocketEvent.DIRECTORY_DELETED, { dirId });
    });
    socket.on(socket_1.SocketEvent.FILE_CREATED, ({ parentDirId, newFile }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast
            .to(roomId)
            .emit(socket_1.SocketEvent.FILE_CREATED, { parentDirId, newFile });
    });
    socket.on(socket_1.SocketEvent.FILE_UPDATED, ({ fileId, newContent }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.FILE_UPDATED, {
            fileId,
            newContent,
        });
    });
    socket.on(socket_1.SocketEvent.FILE_RENAMED, ({ fileId, newName }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.FILE_RENAMED, {
            fileId,
            newName,
        });
    });
    socket.on(socket_1.SocketEvent.FILE_DELETED, ({ fileId }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.FILE_DELETED, { fileId });
    });
    // Handle user status
    socket.on(socket_1.SocketEvent.USER_OFFLINE, ({ socketId }) => {
        userSocketMap = userSocketMap.map((user) => {
            if (user.socketId === socketId) {
                return { ...user, status: user_1.USER_CONNECTION_STATUS.OFFLINE };
            }
            return user;
        });
        const roomId = getRoomId(socketId);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.USER_OFFLINE, { socketId });
    });
    socket.on(socket_1.SocketEvent.USER_ONLINE, ({ socketId }) => {
        userSocketMap = userSocketMap.map((user) => {
            if (user.socketId === socketId) {
                return { ...user, status: user_1.USER_CONNECTION_STATUS.ONLINE };
            }
            return user;
        });
        const roomId = getRoomId(socketId);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.USER_ONLINE, { socketId });
    });
    // Handle chat actions
    socket.on(socket_1.SocketEvent.SEND_MESSAGE, ({ message }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast
            .to(roomId)
            .emit(socket_1.SocketEvent.RECEIVE_MESSAGE, { message });
    });
    // Handle cursor position
    socket.on(socket_1.SocketEvent.TYPING_START, ({ cursorPosition }) => {
        userSocketMap = userSocketMap.map((user) => {
            if (user.socketId === socket.id) {
                return { ...user, typing: true, cursorPosition };
            }
            return user;
        });
        const user = getUserBySocketId(socket.id);
        if (!user)
            return;
        const roomId = user.roomId;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.TYPING_START, { user });
    });
    socket.on(socket_1.SocketEvent.TYPING_PAUSE, () => {
        userSocketMap = userSocketMap.map((user) => {
            if (user.socketId === socket.id) {
                return { ...user, typing: false };
            }
            return user;
        });
        const user = getUserBySocketId(socket.id);
        if (!user)
            return;
        const roomId = user.roomId;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.TYPING_PAUSE, { user });
    });
    socket.on(socket_1.SocketEvent.REQUEST_DRAWING, () => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast
            .to(roomId)
            .emit(socket_1.SocketEvent.REQUEST_DRAWING, { socketId: socket.id });
    });
    socket.on(socket_1.SocketEvent.SYNC_DRAWING, ({ drawingData, socketId }) => {
        socket.broadcast
            .to(socketId)
            .emit(socket_1.SocketEvent.SYNC_DRAWING, { drawingData });
    });
    socket.on(socket_1.SocketEvent.DRAWING_UPDATE, ({ snapshot }) => {
        const roomId = getRoomId(socket.id);
        if (!roomId)
            return;
        socket.broadcast.to(roomId).emit(socket_1.SocketEvent.DRAWING_UPDATE, {
            snapshot,
        });
    });
});
const PORT = process.env.PORT || 3000;
// Health check route for Vercel
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Catch-all route to serve the index.html for client-side routing
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "index.html"));
});
// Only start the server if this file is run directly
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
exports.default = app;
