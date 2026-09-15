# ⚽ Fotbol App - دليل النشر والتشغيل (Deployment Guide)

مرحباً بك في مشروع **Fotbol**! هذا الدليل يحتوي على جميع الأوامر والخطوات اللازمة لرفع التطبيق على الإنترنت (Vercel للواجهة، و Render/Railway للخلفية).

---

## 🏗️ 1. متطلبات ما قبل الرفع (البيئة والمتغيرات)

قبل رفع التطبيق، تأكد من إعداد المتغيرات التالية:

### في الواجهة (Frontend - Vercel):
عند رفع الواجهة على Vercel، ستحتاج إلى إضافة هذا المتغير في إعدادات البيئة (Environment Variables):
- `VITE_API_URL`: الرابط الفعلي لخادم الخلفية (Backend) بعد رفعه (مثال: `https://fotbol-backend.onrender.com/api`).

### في الخلفية (Backend - Render / Railway):
عند رفع الخلفية، يجب أن تحدد هذه المتغيرات في الخادم:
- `DATABASE_URL`: رابط قاعدة البيانات (مثلاً من Supabase أو Neon أو Railway).
- `JWT_SECRET`: مفتاح سري لتشفير الجلسات (مثال: `my_super_secret_key_2026`).
- `PORT`: (اختياري) المنصة ستحدده تلقائياً.

---

## 🚀 2. خطوات الرفع على GitHub (مهم جداً)

أول خطوة هي رفع الكود الخاص بك إلى GitHub لكي تتمكن منصات مثل Vercel من قراءته.
افتح **Terminal** في مجلد المشروع الرئيسي `fotbol` ونفذ الأوامر التالية بالترتيب:

```bash
git add .
git commit -m "Ready for production"
git push origin main
```
*(إذا طلب منك تسجيل الدخول، قم بتسجيل الدخول بحسابك في GitHub).*

---

## 🌐 3. رفع الواجهة (Frontend) على Vercel

1. اذهب إلى موقع [Vercel](https://vercel.com/) وقم بتسجيل الدخول بحسابك (استخدم GitHub).
2. اضغط على **Add New...** ثم اختر **Project**.
3. ابحث عن مستودع `fotbol` واضغط على **Import**.
4. في إعدادات المشروع (Framework Preset)، تأكد أنه مختار **Vite**.
5. في قسم **Root Directory**، اضغط على Edit واختر مجلد `frontend` (مهم جداً لأن الواجهة داخل هذا المجلد).
6. افتح قسم **Environment Variables** وأضف:
   - Name: `VITE_API_URL`
   - Value: (رابط الخلفية الذي ستحصل عليه لاحقاً)
7. اضغط على **Deploy**!

---

## ⚙️ 4. رفع الخلفية (Backend) على Render (موصى به)

منصة Vercel ممتازة للواجهات (Frontend)، لكن خوادم Express + Prisma تعمل بشكل أفضل بكثير وأكثر استقراراً على منصات مثل [Render](https://render.com) أو [Railway](https://railway.app).

**خطوات الرفع على Render:**
1. اذهب إلى [Render.com](https://render.com) وسجل دخولك.
2. اضغط على **New +** واختر **Web Service**.
3. اربط حسابك بـ GitHub واختر مستودع `fotbol`.
4. في قسم **Root Directory**، اكتب `backend`.
5. في قسم **Build Command**، اكتب:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
6. في قسم **Start Command**، اكتب:
   ```bash
   npm start
   ```
7. أضف متغيرات البيئة (Environment Variables):
   - `DATABASE_URL`: (رابط قاعدة البيانات الفعلية).
   - `JWT_SECRET`: (كلمة سر معقدة من اختيارك).
8. اضغط على **Create Web Service**.

> **ملاحظة:** بعد اكتمال رفع الخلفية، ستعطيك منصة Render رابطاً (مثال `https://fotbol-api.onrender.com`). قم بنسخه، ثم اذهب إلى Vercel، وقم بتعديل المتغير `VITE_API_URL` ليصبح `https://fotbol-api.onrender.com/api` وأعد البناء (Redeploy).

---

## 🧪 5. تجربة التطبيق محلياً (باستخدام ngrok)

إذا أردت تجربة التطبيق محلياً في أي وقت مستقبلاً وربط الهاتف بالحاسوب:

1. **تشغيل الخلفية:**
   ```bash
   cd backend
   npm run dev
   ```
   وفي نافذة أخرى:
   ```bash
   ngrok http 5000
   ```

2. **تشغيل الواجهة:**
   قم بنسخ رابط ngrok وضعه في ملف `frontend/.env` هكذا: `VITE_API_URL=https://...ngrok.dev/api`
   ```bash
   cd frontend
   npm run dev
   ```
   وفي نافذة أخرى (باستخدام localtunnel لتجنب قيود ngrok المجانية):
   ```bash
   npx localtunnel --port 5173
   ```
