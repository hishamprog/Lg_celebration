# دليل الرفع على Railway 🚂

## الخطوات التفصيلية

### 1. إنشاء حساب على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. اضغط على **"Login"**
3. سجل دخول باستخدام حساب GitHub الخاص بك
4. امنح Railway الصلاحيات المطلوبة

### 2. رفع الكود على GitHub أولاً

قبل الرفع على Railway، يجب رفع الكود على GitHub:

```bash
cd e:\LG_Celebration
git init
git add .
git commit -m "Initial commit: Guest check-in system"
git remote add origin https://github.com/hishamprog/Lg_celebration.git
git branch -M main
git push -u origin main
```

### 3. إنشاء مشروع جديد على Railway

1. من لوحة التحكم في Railway، اضغط **"New Project"**
2. اختر **"Deploy from GitHub repo"**
3. ابحث عن repository: `hishamprog/Lg_celebration`
4. اضغط **"Deploy Now"**

### 4. انتظر عملية البناء

- سيقوم Railway تلقائياً بـ:
  - تثبيت Python 3.11
  - تثبيت المكتبات من `requirements.txt`
  - تشغيل التطبيق باستخدام `gunicorn`

### 5. الحصول على رابط التطبيق

1. بعد اكتمال البناء، اذهب إلى تبويب **"Settings"**
2. في قسم **"Domains"**، اضغط **"Generate Domain"**
3. ستحصل على رابط مثل: `https://lg-celebration.up.railway.app`

### 6. اختبار التطبيق

1. افتح الرابط في المتصفح
2. جرب البحث عن ضيف
3. سجل حضور ضيف للتأكد من عمل قاعدة البيانات

## ملاحظات مهمة ⚠️

### قاعدة البيانات

- قاعدة البيانات SQLite ستُنشأ تلقائياً عند أول تشغيل
- البيانات ستُستورد من ملف Excel تلقائياً
- **مهم**: قاعدة البيانات ستُحذف عند إعادة النشر!

### للحفاظ على البيانات

إذا أردت الحفاظ على بيانات الحضور:

**الخيار 1: استخدام Railway Volume**
```bash
# في إعدادات Railway
1. اذهب إلى "Variables"
2. أضف متغير جديد:
   - Name: RAILWAY_VOLUME_MOUNT_PATH
   - Value: /app/data
```

ثم عدّل `app.py`:
```python
import os
DB_NAME = os.path.join(os.environ.get('RAILWAY_VOLUME_MOUNT_PATH', '.'), 'guests.db')
```

**الخيار 2: استخدام PostgreSQL**
- أضف PostgreSQL من Railway Marketplace
- عدّل الكود لاستخدام PostgreSQL بدلاً من SQLite

### المتغيرات البيئية (اختياري)

يمكنك إضافة متغيرات في Railway:
- `PORT`: يتم تعيينه تلقائياً
- `FLASK_ENV`: production (افتراضي)

### تحديث التطبيق

عند عمل تحديثات:
```bash
git add .
git commit -m "وصف التحديث"
git push origin main
```

سيقوم Railway تلقائياً بإعادة النشر!

## استكشاف الأخطاء 🔧

### التطبيق لا يعمل؟

1. **تحقق من السجلات (Logs)**
   - في Railway، اذهب إلى تبويب "Deployments"
   - اضغط على آخر deployment
   - شاهد السجلات للبحث عن أخطاء

2. **تحقق من الملفات المطلوبة**
   - ✅ `requirements.txt`
   - ✅ `Procfile`
   - ✅ `runtime.txt`
   - ✅ `app.py`
   - ✅ `توزيع الطاولات (3).xlsx`

3. **تحقق من Build Logs**
   - تأكد من تثبيت جميع المكتبات بنجاح
   - تأكد من عدم وجود أخطاء في Python

### خطأ "Application failed to respond"

- تأكد من أن التطبيق يستمع على `0.0.0.0`
- تأكد من استخدام المنفذ من متغير `PORT`

```python
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

### ملف Excel غير موجود

- تأكد من رفع الملف على GitHub
- تأكد من اسم الملف الصحيح في `app.py`

## الأمان 🔒

### للإنتاج الفعلي:

1. **أوقف Debug Mode**
   ```python
   app.run(host='0.0.0.0', port=port, debug=False)
   ```

2. **أضف مصادقة للموظفين**
   - استخدم Flask-Login
   - أضف نظام تسجيل دخول

3. **حماية قاعدة البيانات**
   - استخدم PostgreSQL
   - عمل نسخ احتياطية دورية

## الدعم 💬

إذا واجهت مشاكل:
- تحقق من [Railway Docs](https://docs.railway.app)
- تحقق من السجلات في Railway
- راجع ملف README.md

---

**نصيحة**: احتفظ بنسخة من قاعدة البيانات محلياً للتطوير والاختبار!
