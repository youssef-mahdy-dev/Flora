import mongoose from "mongoose"

export const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: [2, 'message must be at least 2 characters'],
        maxLength: [1000, 'message must be at most 1000 characters'] 
    },
    // مين اللي بعت الرسالة؟
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    // هل الرسالة من المستخدم ولا رد من الـ AI؟
    senderType: {
        type: String,
        enum: ['USER', 'BOT'],
        default: 'USER'
    },
    // لو المزارع بعت صورة مع السؤال
    attachments: [{
        secure_url: String,
        public_id: String
    }],
    // لربط الرسائل ببعضها كـ Conversation واحدة
    conversationId: {
        type: String // ممكن تستخدم UUID أو ObjectId
    }
}, { timestamps: true })

export const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema)