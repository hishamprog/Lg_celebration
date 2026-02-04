# Git Setup Script for LG Celebration

Write-Host "=== إعداد Git للمشروع ===" -ForegroundColor Green

# Initialize Git
Write-Host "`n1. تهيئة Git..." -ForegroundColor Yellow
git init

# Configure Git (optional - update with your info)
Write-Host "`n2. إعداد معلومات Git..." -ForegroundColor Yellow
# git config user.name "Your Name"
# git config user.email "your.email@example.com"

# Add all files
Write-Host "`n3. إضافة جميع الملفات..." -ForegroundColor Yellow
git add .

# Check status
Write-Host "`n4. التحقق من الحالة..." -ForegroundColor Yellow
git status

# First commit
Write-Host "`n5. عمل أول commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Guest check-in system for LG Celebration"

# Add remote
Write-Host "`n6. إضافة الريبو البعيد..." -ForegroundColor Yellow
git remote add origin https://github.com/hishamprog/Lg_celebration.git

# Check remote
Write-Host "`n7. التحقق من الريبو البعيد..." -ForegroundColor Yellow
git remote -v

# Push to GitHub
Write-Host "`n8. رفع الكود على GitHub..." -ForegroundColor Yellow
Write-Host "تنفيذ: git branch -M main" -ForegroundColor Cyan
git branch -M main

Write-Host "`nتنفيذ: git push -u origin main" -ForegroundColor Cyan
Write-Host "ملاحظة: قد تحتاج لإدخال اسم المستخدم وكلمة المرور لـ GitHub" -ForegroundColor Magenta
git push -u origin main

Write-Host "`n=== تم الانتهاء! ===" -ForegroundColor Green
Write-Host "يمكنك الآن زيارة: https://github.com/hishamprog/Lg_celebration" -ForegroundColor Cyan
