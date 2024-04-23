import mongoose from "mongoose";

const { Schema } = mongoose;

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  content: String,
  mediaURL: String,
  createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema({
  name: [{type : String, required: true}],
  participantNames: [{ type: String }],
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  createdAt: { type: Date, default: Date.now },
});

const options = {
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.createdAt = ret.createdAt.toISOString().split("T")[0];
        return ret;
      },
    },
};
  
MessageSchema.set("toJSON", options);
ChatSchema.set("toJSON", options);

const MessageModel = mongoose.model("Message", MessageSchema);
const ChatModel = mongoose.model("Chat", ChatSchema);

export { MessageModel, ChatModel };