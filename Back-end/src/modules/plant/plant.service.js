import { plantModel } from "../../DB/Models/plant.model.js";
import FormData from 'form-data';
import * as dbServices from "../../DB/dbService.js";
import { cloudinaryConfig } from "../../utils/multer/cloudinary.config.js";
import axios from "axios"; // هتحتاج تعمل npm i axios
import { successResponse } from "../../utils/successResponse.js";



// موديول لجلب تاريخ الفحوصات للمزارع
export const getMyHistory = async (req, res, next) => {
    const history = await dbServices.find({
        model: plantModel,
        filter: { userId: req.user._id },
        options: { sort: { createdAt: -1 } }
    });

    return successResponse({
        res,
        data: { history }
    });
};





export const diagnosePlant = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image" });
        }

        // 1. تجهيز الصورة عشان تتبعت للبايثون
        const formData = new FormData();
        formData.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        // 2. نبعت الصورة لسيرفر البايثون (بورت 5000)
        const aiResponse = await axios.post('http://127.0.0.1:5000/predict', formData, {
            headers: formData.getHeaders(),
        });

        // 3. نرد بالنتيجة للـ Frontend
        return res.status(200).json({
            message: "Success",
            data: {
                diagnosis: aiResponse.data // هيرجع الـ diseaseName والـ confidence
            }
        });

    } catch (error) {
        console.error("AI Server Error:", error.message);
        return res.status(500).json({ message: "AI Analysis failed, please try again later" });
    }
};

// ضيف دي في ملف plant.service.js
export const getPlantDetails = async (req, res, next) => {
    const { id } = req.params;

    const plant = await dbServices.findOne({
        model: plantModel,
        filter: { _id: id, userId: req.user._id } // التأكد إن اللي بيشوفها هو صاحبها
    });

    if (!plant) {
        return next(new Error("Diagnosis not found"), { cause: 404 });
    }

    return successResponse({
        res,
        data: { plant }
    });
};