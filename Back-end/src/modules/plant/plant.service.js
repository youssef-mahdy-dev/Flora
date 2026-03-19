import { plantModel } from "../../DB/Models/plant.model.js";
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
    // 1. التأكد من وجود الصورة
    if (!req.file) return next(new Error("Plant image is required"), { cause: 400 });

    // 2. تفعيل إعدادات كلاوديناري ورفع الصورة
    const cloud = cloudinaryConfig();
    const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
        folder: `FLORA/plants/${req.user._id}`
    });

    try {
        // 3. إرسال رابط الصورة لموديلات أحمد وشهاب (AI Server)
        // ملاحظة: استبدل URL السيرفر ببيانات زمايلك
        const aiResponse = await axios.post("http://ai-api.flora.com/predict", {
            image_url: secure_url
        });

        const { plantType, diseaseName, treatment, confidence } = aiResponse.data;

        // 4. حفظ النتيجة في قاعدة البيانات
        const newDiagnosis = await dbServices.create({
            model: plantModel,
            data: [{
                userId: req.user._id,
                image: { secure_url, public_id },
                plantType: plantType,
                diagnosis: {
                    diseaseName,
                    treatment,
                    confidence
                },
                status: 'completed'
            }]
        });

        return successResponse({
            res,
            status: 201,
            message: "Plant diagnosed successfully",
            data: { diagnosis: newDiagnosis }
        });

    } catch (error) {
        // في حالة فشل الاتصال بسيرفر الـ AI
        return next(new Error("AI Analysis failed, please try again later"), { cause: 500 });
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