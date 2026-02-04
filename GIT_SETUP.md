# خطوات رفع المشروع على GitHub

## 1. إعداد Git محلياً

```bash
# الانتقال لمجلد المشروع
cd e:\LG_Celebration

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# أول commit
git commit -m "Initial commit: Guest check-in system for LG Celebration"
```

## 2. ربط المشروع بـ GitHub

```bash
# إضافة الريبو البعيد
git remote add origin https://github.com/hishamprog/Lg_celebration.git

# التحقق من الريبو البعيد
git remote -v

# رفع الكود
git branch -M main
git push -u origin main
```

## 3. إذا كان الريبو موجود مسبقاً

```bash
# حذف الريبو البعيد القديم
git remote remove origin

# إضافة الريبو الجديد
git remote add origin https://github.com/hishamprog/Lg_celebration.git

# فرض الرفع (احذر: سيحذف المحتوى القديم)
git push -f origin main
```

## 4. تحديثات مستقبلية

```bash
# إضافة التغييرات
git add .

# عمل commit
git commit -m "وصف التحديث"

# رفع التحديثات
git push origin main
```

## ملاحظات مهمة

- تأكد من رفع ملف `قائمة المدعويين.xlsx` مع المشروع
- ملف `guests.db` لن يُرفع (موجود في .gitignore)
- عند الرفع على Railway، سيتم إنشاء قاعدة بيانات جديدة تلقائياً
