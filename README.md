# 🎓 Winter Study Planner - لوحة الدراسة الشتوية

**خطة دراسية احترافية لتنظيم الدروس والاختبارات للتاسع 2027**

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Language](https://img.shields.io/badge/language-JavaScript-yellow)

---

## 📋 نظرة عامة

تطبيق ويب تفاعلي لإدارة الخطة الدراسية الشتوية للتاسع في العام 2027. يوفر واجهة احترافية سهلة الاستخدام لتتبع الدروس والاختبارات ومراقبة التقدم.

### ✨ المميزات الرئيسية

- 📅 **إدارة الأسابيع**: عرض منظم للأسابيع الدراسية
- 📚 **جدول الدروس**: تنظيم الدروس حسب اليوم والمادة
- ✅ **تتبع الإنجاز**: رصد نسبة التقدم في الدراسة
- 🎨 **تصميم احترافي**: واجهة جذابة وسهلة الاستخدام
- 🌙 **وضع ليلي**: دعم كامل للوضع الليلي
- 📱 **تصميم متجاوب**: يعمل على جميع الأجهزة
- 🔍 **بحث متقدم**: البحث عن الدروس والمواد
- 💾 **حفظ محلي**: حفظ البيانات في الجهاز

---

## 🚀 البدء السريع

### المتطلبات
- متصفح حديث (Chrome, Firefox, Safari, Edge)
- اتصال إنترنت (للتحميل الأول فقط)

### التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/yasserhurib-netizen/WinterStudyPlanner.git
cd WinterStudyPlanner
```

2. **تشغيل التطبيق**
- افتح ملف `index.html` في المتصفح مباشرة
- أو استخدم أي خادم محلي:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

3. **الوصول**
- الويب: [https://yasserhurib-netizen.github.io/WinterStudyPlanner/](https://yasserhurib-netizen.github.io/WinterStudyPlanner/)

---

## 📁 هيكل المشروع

```
WinterStudyPlanner/
├── css/
│   ├── core.css           # الأنماط الأساسية
│   ├── layout.css         # تخطيط الصفحة
│   ├── components.css     # مكونات واجهة المستخدم
│   ├── dashboard.css      # أنماط لوحة التحكم
│   ├── modal.css          # نماذج النوافذ المنبثقة
│   ├── animations.css     # الرسوم المتحركة
│   └── responsive.css     # التصميم المتجاوب
├── js/
│   ├── core/
│   │   └── app.js         # التطبيق الرئيسي
│   └── modules/
│       ├── data.js        # إدارة البيانات
│       ├── ui.js          # إدارة واجهة المستخدم
│       ├── state.js       # إدارة الحالة
│       ├── events.js      # نظام الأحداث
│       ├── utils.js       # دوال مساعدة
│       ├── notifications.js  # الإشعارات
│       └── analytics.js   # التحليلات
├── data/
│   └── schedule.json      # بيانات الجدول الدراسي
├── index.html             # صفحة HTML الرئيسية
├── README.md              # هذا الملف
└── .gitignore             # ملف تجاهل Git
```

---

## 🎯 الميزات التفصيلية

### 1. لوحة التحكم الرئيسية
- عرض إحصائيات شاملة (عدد الأسابيع، الدروس، الاختبارات)
- نسبة التقدم الكلية مع رسم بياني دائري
- شريط تقدم مرئي

### 2. إدارة الأسابيع
- عرض الأسابيع الدراسية الأربعة
- التنقل بين الأسابيع بسهولة
- عرض تفاصيل كل أسبوع

### 3. جدول الدروس
- تنظيم الدروس حسب اليوم
- عرض معلومات كل درس (المادة، الوصف، المدة)
- تحديد حالة الدرس (مكتمل، قيد الدراسة، لم يبدأ)
- ألوان مميزة لكل مادة

### 4. إدارة الحالة
- تتبع حالة كل درس
- حساب نسبة الإنجاز التلقائية
- حفظ التقدم محلياً

### 5. المواد الدراسية
- 6 مواد دراسية (رياضيات، عربي، إنجليزي، علوم، تاريخ، إسلامي)
- ألوان مميزة لكل مادة
- رموز تعبيرية للتمييز السريع

---

## 🎨 التصميم

### الألوان الأساسية
- **الأساسي**: `#5b6eff` (أزرق فاتح)
- **النجاح**: `#10b981` (أخضر)
- **التحذير**: `#f59e0b` (برتقالي)
- **الخطأ**: `#ef4444` (أحمر)

### خطوط النص
- **الخط الرئيسي**: Segoe UI
- **محاذاة النصوص**: RTL (من اليمين لليسار)

---

## 💻 التكنولوجيا المستخدمة

- **HTML5**: لهيكل الصفحة
- **CSS3**: للتصميم والأنماط
- **JavaScript (ES6+)**: للوظائف التفاعلية
- **LocalStorage**: لحفظ البيانات
- **JSON**: لتنسيق البيانات

---

## 📊 البيانات

### هيكل البيانات
```json
{
  "weeks": [
    {
      "id": 1,
      "number": 1,
      "name": "الأسبوع الأول",
      "startDate": "2026-01-18",
      "endDate": "2026-01-24",
      "days": [
        {
          "id": 1,
          "name": "الأحد",
          "date": "2026-01-18",
          "lessons": [...]
        }
      ]
    }
  ]
}
```

---

## 🔧 التطوير

### إضافة درس جديد
```javascript
const lesson = {
  id: 46,
  subject: 'math',
  title: 'عنوان الدرس',
  description: 'وصف الدرس',
  status: 'pending',
  duration: 60
};
```

### الأحداث المتاحة
- `lesson_completed`: عند إكمال درس
- `week_changed`: عند تغيير الأسبوع
- `theme_changed`: عند تغيير المظهر
- `search_performed`: عند البحث

---

## 🤝 المساهمة

نرحب بمساهماتك! يمكنك:

1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

---

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

---

## 👤 المؤلف

**يسر حريب** - [@yasserhurib-netizen](https://github.com/yasserhurib-netizen)

---

## 📞 التواصل والدعم

- 🐛 **الإبلاغ عن الأخطاء**: [Issues](https://github.com/yasserhurib-netizen/WinterStudyPlanner/issues)
- 💬 **النقاشات**: [Discussions](https://github.com/yasserhurib-netizen/WinterStudyPlanner/discussions)
- 📧 **البريد الإلكتروني**: yasserhurib@gmail.com

---

## 🎓 الهدف التعليمي

هذا المشروع يهدف إلى:
- تنظيم الدراسة بشكل فعال
- تتبع التقدم الأكاديمي
- تحسين الإنتاجية الدراسية
- توفير أداة سهلة الاستخدام للطلاب

---

## 🌟 شكر وتقدير

شكر خاص لجميع الطلاب والمدرسين الذين استخدموا هذا التطبيق ويساهمون في تحسينه.

---

## 📅 خارطة الطريق

- [ ] إضافة ميزة المشاركة مع الآخرين
- [ ] دعم الإشعارات البوش
- [ ] تقارير تفصيلية
- [ ] تطبيق موبايل
- [ ] دعم التعاون الجماعي

---

**آخر تحديث**: 29 يونيو 2026

---

<div align="center">

### ⭐ إذا أعجبك المشروع، لا تنسَ إضافة نجمة!

[GitHub Stars](https://github.com/yasserhurib-netizen/WinterStudyPlanner) • [Live Demo](https://yasserhurib-netizen.github.io/WinterStudyPlanner/)

</div>