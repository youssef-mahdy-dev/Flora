import mongoose from "mongoose";
import { messageModel } from "../../DB/Models/message.model.js";
import * as dbServices from "../../DB/dbService.js";
import { successResponse } from "../../utils/successResponse.js";
import axios from "axios";

export const sendMessage = async (req, res, next) => {
    const { content, conversationId } = req.body;

    // 1. تسجيل رسالة المستخدم (USER)
    const userMessage = await dbServices.create({
        model: messageModel,
        data: [{
            content,
            senderId: req.user._id,
            senderType: 'USER',
            conversationId: conversationId || new mongoose.Types.ObjectId() // لو مفيش ID بنبدأ محادثة جديدة
        }]
    });
    if(userMessage)    return successResponse({
            res,
            status: 201,
            message: "Reply received",
            data: { 
                userMessage
            }
        });

    // try {
    //     // 2. التواصل مع سيرفر الـ NLP (سيف الدين)
    //     const aiResponse = await axios.post("http://ai-nlp-server/chat", {
    //         message: content,
    //         userId: req.user._id
    //     });

    //     const botReply = aiResponse.data.reply;

    //     // 3. تسجيل رد الـ AI (BOT) في الـ DB
    //     const botMessage = await dbServices.create({
    //         model: messageModel,
    //         data: [{
    //             content: botReply,
    //             senderId: req.user._id, // بنربطها بنفس اليوزر عشان تظهر في سجلاته
    //             senderType: 'BOT',
    //             conversationId: userMessage[0].conversationId
    //         }]
    //     });

    //     return successResponse({
    //         res,
    //         status: 201,
    //         message: "Reply received",
    //         data: { 
    //             userMessage: userMessage[0], 
    //             botReply: botMessage[0] 
    //         }
    //     });

    // } catch (error) {
    //     return next(new Error("Chatbot is currently offline"), { cause: 500 });
    // }
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