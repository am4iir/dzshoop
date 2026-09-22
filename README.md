# NOIR & BLANC - Clothing Landing & Instant Checkout

متجر هبوط عصري وخفيف مخصص لروابط البايو في إنستغرام وتيك توك (Instagram Bio Store).

## 🚀 كيفية الرفع على Vercel (في دقيقة واحدة)

المشروع جاهز ومُبنى ومجرب بدون أخطاء. لرفعه على Vercel:

### الطريقة 1 (عبر GitHub - الأسهل والأفضل):
1. ارفع مجلد `C:\Projects\store-drop` إلى مستودع جديد على حسابك في GitHub:
   ```bash
   cd C:\Projects\store-drop
   git init
   git add .
   git commit -m "Initial commit - Store Drop"
   git branch -M main
   git remote add origin https://github.com/USERNAME/store-drop.git
   git push -u origin main
   ```
2. ادخل إلى [vercel.com](https://vercel.com) وسجل الدخول بحساب GitHub.
3. اضغط **Add New Project** واختر مستودع `store-drop`.
4. اضغط مباشرة على **Deploy** دون الحاجة لتغيير أي إعدادات! سيعطيك Vercel رابطاً مجانياً ومؤمناً بشهادة SSL (HTTPS).

### الطريقة 2 (عبر سطر الأوامر مباشرة):
افتح التيرمينال في مجلد المشروع وشغّل:
```bash
npx vercel
```
ثم اتبع التعليمات على الشاشة لتسجيل الدخول والنشر مباشرة.
