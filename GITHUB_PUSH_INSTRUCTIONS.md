# 🔐 تعليمات رفع المشروع على GitHub

## المشكلة الحالية
الحساب `hisham-tabaa` ليس لديه صلاحية للرفع على ريبو `hishamprog/Lg_celebration`

---

## ✅ الحل 1: استخدام Personal Access Token (الأسهل)

### الخطوة 1: إنشاء Token من GitHub

1. اذهب إلى GitHub.com وسجل دخول بحساب `hishamprog`
2. اذهب إلى: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
3. اضغط **"Generate new token"** → **"Generate new token (classic)"**
4. املأ البيانات:
   - **Note**: `LG Celebration Upload`
   - **Expiration**: `90 days` (أو حسب رغبتك)
   - **Scopes**: اختر `repo` (كل الصلاحيات)
5. اضغط **"Generate token"**
6. **انسخ الـ Token فوراً** (لن تراه مرة أخرى!)

### الخطوة 2: استخدام الـ Token للرفع

```bash
# في PowerShell
cd e:\LG_Celebration

# احذف الريبو البعيد القديم
git remote remove origin

# أضف الريبو مع الـ Token
git remote add origin https://YOUR_TOKEN@github.com/hishamprog/Lg_celebration.git

# ارفع الكود
git push -u origin main
```

**استبدل `YOUR_TOKEN` بالـ Token اللي نسخته!**

---

## ✅ الحل 2: استخدام SSH Key

### الخطوة 1: إنشاء SSH Key

```bash
# في PowerShell
ssh-keygen -t ed25519 -C "your_email@example.com"

# اضغط Enter 3 مرات (لتخطي كلمة المرور)
```

### الخطوة 2: إضافة الـ SSH Key لـ GitHub

```bash
# انسخ الـ Public Key
cat ~/.ssh/id_ed25519.pub
```

1. اذهب إلى GitHub: **Settings** → **SSH and GPG keys**
2. اضغط **"New SSH key"**
3. الصق الـ Public Key
4. اضغط **"Add SSH key"**

### الخطوة 3: استخدام SSH للرفع

```bash
cd e:\LG_Celebration

# احذف الريبو البعيد القديم
git remote remove origin

# أضف الريبو بـ SSH
git remote add origin git@github.com:hishamprog/Lg_celebration.git

# ارفع الكود
git push -u origin main
```

---

## ✅ الحل 3: رفع من حساب hishamprog مباشرة

إذا كنت تستخدم جهاز آخر أو متصفح آخر:

1. سجل خروج من GitHub
2. سجل دخول بحساب `hishamprog`
3. نفذ الأوامر من جديد

---

## 🚀 بعد الرفع الناجح

بعد ما ترفع الكود بنجاح، راح تشوف:

```
Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
Delta compression using up to 8 threads
Compressing objects: 100% (16/16), done.
Writing objects: 100% (18/18), 25.67 KiB | 2.85 MiB/s, done.
Total 18 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/hishamprog/Lg_celebration.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

تحقق من الريبو على:
```
https://github.com/hishamprog/Lg_celebration
```

---

## 📝 ملاحظات مهمة

1. **الـ Token**: احفظه في مكان آمن، راح تحتاجه لأي تحديثات مستقبلية
2. **الأمان**: لا تشارك الـ Token مع أحد
3. **الصلاحيات**: تأكد إنك مسجل دخول بالحساب الصحيح

---

## 🔄 للتحديثات المستقبلية

بعد ما ترفع الكود أول مرة، أي تحديثات:

```bash
git add .
git commit -m "وصف التحديث"
git push origin main
```

---

**اختر الحل الأسهل لك وكمل! 🚀**
