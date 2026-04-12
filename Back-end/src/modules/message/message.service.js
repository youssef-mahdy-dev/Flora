import mongoose from "mongoose";
import { messageModel } from "../../DB/Models/message.model.js";
import * as dbServices from "../../DB/dbService.js";
import { successResponse } from "../../utils/successResponse.js";
import axios from "axios";

// message.service.js

import FormData from "form-data"; // لازم تسطب المكتبة دي: npm install form-data

export const sendMessage = async (req, res, next) => {
    const { content, conversationId } = req.body;
    const file = req.file; // لو اليوزر رافع صورة مع الرسالة

    // 1. تسجيل رسالة المستخدم في الداتا بيز (كودك القديم سليم)
    const userMessage = await dbServices.create({
        model: messageModel,
        data: [{
            content,
            senderId: req.user._id,
            senderType: 'USER',
            conversationId: conversationId || new mongoose.Types.ObjectId()
        }]
    });

    try {
        let botReply = "";

        // 2. لو الرسالة فيها صورة (يعني تشخيص مرض)
        if (file) {
            const form = new FormData();
            // بنحول الـ buffer اللي جاي من multer لـ stream عشان يتبعت للـ Python
            form.append('file', file.buffer, { filename: file.originalname });

            const aiResponse = await axios.post("http://127.0.0.1:8000/predict", form, {
                headers: { ...form.getHeaders() }
            });

            const { prediction, confidence } = aiResponse.data;
            botReply = `I have analyzed the plant. Result: ${prediction} with ${Math.round(confidence * 100)}% confidence.`;
        } else {
            // 3. لو رسالة نصية عادية تروح للـ Ollama/Chatbot (بورت 5000 زي ما كنت عامل)
            const chatResponse = await axios.post("http://127.0.0.1:5000/chat", { 
                message: content 
            });
            botReply = chatResponse.data.reply;
        }

        // 4. تسجيل رد الـ AI في الـ DB
        const botMessage = await dbServices.create({
            model: messageModel,
            data: [{
                content: botReply,
                senderId: req.user._id,
                senderType: 'BOT',
                conversationId: userMessage[0].conversationId
            }]
        });

        return successResponse({
            res, status: 201, message: "Success",
            data: { userMessage: userMessage[0], botReply: botMessage[0] }
        });

    } catch (error) {
        console.error("AI Server Error:", error.message);
        return successResponse({
            res, status: 201,
            message: "Message saved, but AI service is unreachable",
            data: { userMessage: userMessage[0] }
        });
    }
};
// موديول لجلب شات معين بالكامل
export const getChatHistory = async (req, res, next) => {
    const { conversationId } = req.params;

    const messages = await dbServices.find({
        model: messageModel,
        filter: { conversationId },
        options: { sort: { createdAt: 1 } } // ترتيب من الأقدم للأحدث عشان الشات يكون منطقي
    });

    return successResponse({
        res,
        data: { messages }
    });
};

// جلب قائمة بكل المحادثات الفريدة للمستخدم
export const getUserConversations = async (req, res, next) => {
    const userId = req.user._id;

    // بنعمل aggregation عشان نجمع الرسايل بـ conversationId 
    // ونطلع آخر رسالة حصلت في كل محادثة عشان تظهر في القائمة
    const conversations = await messageModel.aggregate([
        { $match: { senderId: userId } }, // بنجيب كل رسايل اليوزر ده
        { $sort: { createdAt: -1 } }, // بنرتبهم من الأحدث للأقدم
        {
            $group: {
                _id: "$conversationId", // بنجمعهم بناءً على ID المحادثة
                lastMessage: { $first: "$content" }, // بناخد أول رسالة (اللي هي الأحدث بسبب الـ sort)
                updatedAt: { $first: "$createdAt" },
                senderType: { $first: "$senderType" }
            }
        },
        { $sort: { updatedAt: -1 } } // بنرتب المحادثات نفسها بحيث الأحدث تظهر فوق
    ]);

    return successResponse({
        res,
        status: 200,
        data: { conversations }
    });
};