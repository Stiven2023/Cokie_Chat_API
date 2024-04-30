import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectToDatabase from "./server/db.js";
import messageRoutes from "./routes/messageRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";

const app = express();
const server = http.createServer(app);

// Asegúrate de que 'http://localhost:3000' está incluido en los orígenes permitidos
export const io = new Server(server, {
  cors: {
    origin: ["https://cokie-chat-api.onrender.com", "http://localhost:3000"], // Agrega aquí tu origen local
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("A user connected from:", socket.handshake.headers.host);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(express.json());

app.use(cors({
  origin: ["https://cokie-chat-api.onrender.com", "http://localhost:3000"], 
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}));

app.use("/messages", messageRoutes);
app.use("/chats", chatRoutes);
app.use("/users", userRoutes);

connectToDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
  });
