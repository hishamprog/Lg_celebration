# LG Celebration - نظام استقبال الضيوف 🎉

نظام ويب متكامل لإدارة استقبال الضيوف في الحفلات والمناسبات، مع واجهة عربية جميلة وسهلة الاستخدام.

## المميزات ✨

- 🔍 **البحث السريع**: البحث عن الضيوف بالاسم
- ✅ **تسجيل الحضور**: تسجيل حضور الضيوف بضغطة زر واحدة
- 📊 **إحصائيات مباشرة**: متابعة عدد الحضور والمدعوين
- 🕐 **سجل الحضور**: عرض آخر الضيوف الذين سجلوا حضورهم
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة (كمبيوتر، تابلت، موبايل)
- 🎨 **واجهة جميلة**: تصميم عصري مع تأثيرات حركية

## التقنيات المستخدمة 🛠️

### Backend
- **Flask**: إطار عمل Python للويب
- **SQLite**: قاعدة بيانات خفيفة
- **Pandas**: معالجة ملفات Excel
- **Flask-CORS**: دعم CORS

### Frontend
- **HTML5**: هيكل الصفحة
- **CSS3**: تصميم عصري مع Glassmorphism
- **JavaScript**: تفاعل ديناميكي
- **Google Fonts**: خط Cairo العربي

## التثبيت والتشغيل 🚀

### المتطلبات
- Python 3.11 أو أحدث
- pip (مدير حزم Python)

### خطوات التثبيت

1. **استنساخ المشروع**
```bash
git clone https://github.com/hishamprog/Lg_celebration.git
cd Lg_celebration
```

2. **تثبيت المكتبات**
```bash
pip install -r requirements.txt
```

3. **تشغيل التطبيق**
```bash
python app.py
```

4. **فتح المتصفح**
افتح المتصفح على العنوان: `http://localhost:5000`

## الرفع على Railway 🚂

1. **إنشاء حساب على Railway**
   - اذهب إلى [railway.app](https://railway.app)
   - سجل دخول باستخدام GitHub

2. **إنشاء مشروع جديد**
   - اضغط على "New Project"
   - اختر "Deploy from GitHub repo"
   - اختر repository: `hishamprog/Lg_celebration`

3. **إعدادات التطبيق**
   - سيتم رفع التطبيق تلقائياً
   - ستحصل على رابط مثل: `https://your-app.up.railway.app`

4. **رفع ملف Excel**
   - بعد الرفع، ارفع ملف `توزيع الطاولات (3).xlsx` إلى المشروع
   - أو أضفه في المجلد الرئيسي قبل الرفع

## استخدام النظام 📖

### للموظفين

1. **البحث عن ضيف**
   - أدخل اسم الضيف في خانة البحث
   - اضغط على زر "بحث" أو Enter

2. **تسجيل الحضور**
   - عند ظهور الضيف في النتائج
   - اضغط على زر "تسجيل الحضور"
   - تأكد من البيانات
   - اضغط "تأكيد الحضور"

3. **متابعة الإحصائيات**
   - شاهد عدد الحضور في الأعلى
   - تابع آخر الحضور في القسم السفلي

### البيانات المعروضة

لكل ضيف يتم عرض:
- ✅ الاسم
- 🪑 رقم الطاولة
- 👨‍💼 الموظف المسؤول
- 🕐 وقت الحضور (بعد التسجيل)
- ✅ حالة الحضور

## هيكل المشروع 📁

```
Lg_celebration/
├── app.py                      # التطبيق الرئيسي
├── requirements.txt            # المكتبات المطلوبة
├── Procfile                    # إعدادات Railway
├── runtime.txt                 # إصدار Python
├── قائمة المدعويين.xlsx        # قائمة الضيوف
├── guests.db                   # قاعدة البيانات (تُنشأ تلقائياً)
├── templates/
│   └── index.html             # الصفحة الرئيسية
└── static/
    ├── style.css              # ملف التنسيق
    └── script.js              # ملف JavaScript
```

## API Endpoints 🔌

### البحث عن ضيف
```
POST /api/search
Body: { "search_term": "اسم الضيف" }
```

### تسجيل الحضور
```
POST /api/checkin
Body: { "guest_id": 1, "checked_by": "موظف الاستقبال" }
```

### الإحصائيات
```
GET /api/stats
```

### آخر الحضور
```
GET /api/recent
```

## قاعدة البيانات 💾

### جدول الضيوف (guests)
| العمود | النوع | الوصف |
|--------|------|-------|
| id | INTEGER | المعرف الفريد |
| guest_name | TEXT | اسم الضيف |
| table_number | INTEGER | رقم الطاولة |
| responsible_person | TEXT | الموظف المسؤول |
| attended | BOOLEAN | حالة الحضور |
| attendance_time | TEXT | وقت الحضور |
| checked_by | TEXT | من سجل الحضور |

## التخصيص 🎨

### تغيير الألوان
عدّل المتغيرات في `static/style.css`:
```css
:root {
    --primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    /* ... */
}
```

### تغيير اسم الموظف الافتراضي
في `static/script.js`:
```javascript
checked_by: 'اسم الموظف الجديد'
```

## الأمان 🔒

- ✅ CORS محمي
- ✅ التحقق من البيانات
- ✅ منع التسجيل المكرر
- ✅ معالجة الأخطاء

## المساهمة 🤝

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## الترخيص 📄

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

## الدعم 💬

للأسئلة والدعم:
- GitHub Issues: [github.com/hishamprog/Lg_celebration/issues](https://github.com/hishamprog/Lg_celebration/issues)

## الشكر 🙏

شكراً لاستخدام نظام استقبال الضيوف LG Celebration!

---

صُنع بـ ❤️ للحفلات والمناسبات الناجحة
