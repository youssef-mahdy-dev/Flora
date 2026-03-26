# 🌿 FLORA Backend API Documentation

نظام متكامل لإدارة وتحليل النباتات والدردشة الذكية، مبني باستخدام **Node.js** و **Express** و **MongoDB**.

---

## 🚀 معلومات التشغيل (Quick Start)
- **Base URL:** `http://localhost:3000/api/v1`
- **Rate Limit:** مسموح بـ 100 طلب كل 5 دقائق لكل مستخدم.
- **Headers:** يجب إرسال التوكن في جميع الطلبات المحمية:
  - `Authorization: Bearer <TOKEN>`

---

## 🔐 نظام الحماية والصلاحيات (Auth & Middleware)
المشروع مزود بأنظمة حماية متقدمة:
- **Authentication:** التحقق من الهوية ومنع التوكنز الملغاة (Blacklisting).
- **Authorization:** تحديد صلاحيات الوصول (User / Admin).
- **Validation:** فحص دقيق لجميع البيانات المدخلة قبل معالجتها (Joi).

---

## 🪴 قسم النباتات (Plant Module)

### 1. تشخيص نبات (Diagnose)
- **URL:** `/plant/diagnose`
- **Method:** `POST`
- **Body Type:** `multipart/form-data`
- **Fields:** - `plantImage` (File): صورة النبات (JPG, PNG).

### 2. تاريخ التشخيص (History)
- **URL:** `/plant/history`
- **Method:** `GET`
- **Description:** عرض جميع العمليات السابقة للمستخدم.

---

## 👤 قسم المستخدم (User Module)

### 1. تحديث الصورة الشخصية
- **URL:** `/user/profile-image`
- **Method:** `PATCH`
- **Body:** `form-data` (`profileImage`).

### 2. تجميد/استعادة الحساب
- **URL:** `/user/freeze-account` | `/user/:userId/restore-account`
- **Method:** `DELETE`
- **Auth:** `ACCESS_TOKEN` مطلوب.

---

## 💬 قسم الرسائل (Chat Module)

### 1. إرسال رسالة
- **URL:** `/message/send`
- **Method:** `POST`
- **Body (JSON):**
```json
{
  "receiverId": "ID_المستلم",
  "content": "نص الرسالة هنا"
}