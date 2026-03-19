import joi from 'joi';
import { generalFields } from "../../Middlewares/validation.middleware.js";

export const diagnoseSchema = {
    body: joi.object({
        notes: joi.string().max(200).optional()

    }),
    file: generalFields.file, 
};

export const getByIdSchema = {
    params: joi.object({
        id: generalFields.id.required()
    })
};