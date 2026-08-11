# دليل التشغيل والرفع باستخدام Docker و GitHub Actions (ECO Link)

تم تجهيز جميع الملفات الخاصة بـ **Docker** و **Docker Compose** و **GitHub Actions** في المشروع كالتالي:

---

## 📁 الملفات التي تم إنشاؤها:
1. **[backend/Dockerfile](file:///c:/Users/AL-Huda/Documents/ECO_Link/Eco_Link_For_Red_Dev-main/backend/Dockerfile)**: بناء صورة الباك إند (Django + Gunicorn).
2. **[frontend/Dockerfile](file:///c:/Users/AL-Huda/Documents/ECO_Link/Eco_Link_For_Red_Dev-main/frontend/Dockerfile)**: بناء صورة الفرونت إند (React + Nginx Multi-stage).
3. **[frontend/nginx.conf](file:///c:/Users/AL-Huda/Documents/ECO_Link/Eco_Link_For_Red_Dev-main/frontend/nginx.conf)**: إعداد Nginx لتوجيه الـ API والـ Admin والملفات الثابتة تلقائياً للباك إند.
4. **[docker-compose.yml](file:///c:/Users/AL-Huda/Documents/ECO_Link/Eco_Link_For_Red_Dev-main/docker-compose.yml)**: ملف تجميع وتشغيل الخدمات الثلاث (Database + Backend + Frontend).
5. **[.github/workflows/docker-ci-cd.yml](file:///c:/Users/AL-Huda/Documents/ECO_Link/Eco_Link_For_Red_Dev-main/.github/workflows/docker-ci-cd.yml)**: ملف GitHub Actions لبناء صور الدوكر ورفعها تلقائياً على **GitHub Container Registry (ghcr.io)**.

---

## 🐳 1. تشغيل المشروع محلياً باستخدام Docker Compose:

لتشغيل المشروع كاملاً (الفرونت والباك والداتا بيز) بأمر واحد فقط:

```bash
docker-compose up --build -d
```

- **الفرونت إند**: سيعمل على `http://localhost` (Port 80)
- **الباك إند API**: سيعمل على `http://localhost:8000/api/`
- **لوحة أدمين Django**: ستعمل على `http://localhost/admin/`

### 🛑 لإيقاف الخدمات:
```bash
docker-compose down
```

---

## 🚀 2. الرفع والتكامل المستمر مع GitHub Actions:

عند رفع هذا الكود إلى مستودع GitHub على فرع `main`:

1. سيقوم **GitHub Actions** تلقائياً ببدء العمل والتأكد من صحة بناء الـ Docker Image لكل من الفرونت والباك.
2. سيتم بناء الصور وتنزيلها تلقائياً في قسم **Packages** بحسابك على GitHub عبر **GitHub Container Registry (`ghcr.io`)**.
3. يمكنك استخدام الصور المبنية مباشرة على أي سيرفر أو منصة سحابية (مثل Render, Railway, DigitalOcean, VPS).
