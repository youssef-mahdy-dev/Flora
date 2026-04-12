from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# 1. تحميل الموديل اللي أنت عملته (تأكد من اسم الملف صح)
model = tf.keras.models.load_model('trained_plant_disease_model.keras')
# 2. لستة الأمراض (الـ Classes) بنفس الترتيب اللي في الموديل عندك
class_name = ['Apple___Apple_scab', 'Apple___Black_rot', ...] # كمل باقي الـ 38 نوع

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    img = Image.open(io.BytesIO(file.read()))
    
    # الخطوة اللي كنت بقولك عليها (Resizing)
    # الموديل بتاعك متدرب على 128x128 فلازم نصغر الصورة زيه
    img = img.resize((128, 128)) 
    
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0) # تحويل الصورة لـ Batch

    predictions = model.predict(img_array)
    result_index = np.argmax(predictions) # جلب أعلى توقع
    
    return jsonify({
        "diseaseName": class_name[result_index],
        "confidence": float(np.max(predictions))
    })

if __name__ == '__main__':
    app.run(port=5000) # السيرفر ده هيشتغل على بورت 5000