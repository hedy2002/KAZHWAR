(() => {
  "use strict";

  const translations = {
    en: {
      title: "Get the Gulnar app",
      description: "Download or install the Gulnar plant shop app on iPhone and Android.",
      languageLabel: "Choose language",
      eyebrow: "A little more alive, every day",
      headline: "A greener home<br>is just a tap <em>away.</em>",
      descriptionText: "Bring Gulnar along for lovely plants, thoughtful care tips, and a little more green wherever you are.",
      getFor: "GET IT FOR",
      iosButton: "Download for iPhone",
      androidButton: "Download for Android",
      downloadNote: "Install the web app for free. No app-store account needed.",
      appLinkLabel: "Share this app",
      shareButton: "Share",
      copyButton: "Copy link",
      linkCopied: "App link copied.",
      linkCopyError: "Couldn't copy the app link. Please select the URL and copy it.",
      shareTitle: "Gulnar — Plants for your kind of home",
      shareText: "Explore plants, garden essentials, and helpful care tips with Gulnar.",
      phoneLabel: "Preview of the Gulnar app",
      previewGreeting: "A softer kind of living",
      previewTitle: "Make room for<br><em>something growing.</em>",
      previewFeature: "Bring the outside in",
      previewShop: "Find your green",
      previewSeeAll: "See all",
      previewPlantOne: "Golden Pothos",
      previewPlantTwo: "Little Olive Tree",
      previewHome: "Home",
      previewExplore: "Explore",
      previewSaved: "Saved",
      previewCaption: "Your little green corner, on the go",
      guideEyebrow: "READY WHEN YOU ARE",
      guideTitle: "A few taps to make it yours.",
      iosGuideTitle: "Install on iPhone or iPad",
      iosStepOne: "Open this page in <strong>Safari</strong>.",
      iosStepTwo: "Tap the <strong>Share</strong> button at the bottom of the screen.",
      iosStepThree: "Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.",
      iosTip: "If this page opened in another app, open it in Safari first.",
      androidGuideTitle: "Install on Android",
      androidStepOne: "Open this page in <strong>Chrome</strong> or <strong>Brave</strong>.",
      androidStepTwo: "Tap <strong>Install app</strong> if prompted, or open the browser menu.",
      androidStepThree: "Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.",
      androidTip: "The Android button will open the install prompt when your browser supports it.",
      footerLine: "A little more alive, every day.",
      footerLinksLabel: "Social and contact links",
      instagram: "Instagram",
      whatsapp: "WhatsApp",
      contact: "Contact",
      installStarted: "Opening the Android install prompt…",
      installComplete: "Gulnar is ready to install.",
      installDismissed: "You can install Gulnar any time from the Android browser menu."
    },
    ar: {
      title: "حمّل تطبيق جولنار",
      description: "نزّل أو ثبّت متجر نباتات جولنار على iPhone وAndroid.",
      languageLabel: "اختر اللغة",
      eyebrow: "حياة أكثر خضرة، كل يوم",
      headline: "اجعل منزلك أكثر خضرة<br>بلمسة <em>واحدة.</em>",
      descriptionText: "اصطحب جولنار معك لاكتشاف النباتات الجميلة ونصائح العناية ولمسة خضراء أينما كنت.",
      getFor: "احصل عليه على",
      iosButton: "تنزيل لأجهزة iPhone",
      androidButton: "تنزيل لأجهزة Android",
      downloadNote: "ثبّت تطبيق الويب مجانًا، دون الحاجة إلى حساب متجر التطبيقات.",
      appLinkLabel: "شارك التطبيق",
      shareButton: "مشاركة",
      copyButton: "نسخ الرابط",
      linkCopied: "تم نسخ رابط التطبيق.",
      linkCopyError: "تعذر نسخ الرابط. حدّد الرابط وانسخه.",
      shareTitle: "جولنار — نباتات تناسب منزلك",
      shareText: "اكتشف النباتات ولوازم الحدائق ونصائح العناية المفيدة مع جولنار.",
      phoneLabel: "معاينة تطبيق جولنار",
      previewGreeting: "حياة أكثر هدوءًا",
      previewTitle: "افسح مكانًا<br><em>لشيءٍ ينمو.</em>",
      previewFeature: "أدخل الطبيعة إلى منزلك",
      previewShop: "اكتشف نباتاتك",
      previewSeeAll: "عرض الكل",
      previewPlantOne: "بوتس ذهبي",
      previewPlantTwo: "شجرة زيتون صغيرة",
      previewHome: "الرئيسية",
      previewExplore: "استكشف",
      previewSaved: "المحفوظات",
      previewCaption: "ركنك الأخضر الصغير أينما ذهبت",
      guideEyebrow: "جاهز عندما تكون أنت",
      guideTitle: "بضع خطوات وتصبح جاهزة.",
      iosGuideTitle: "التثبيت على iPhone أو iPad",
      iosStepOne: "افتح هذه الصفحة في <strong>Safari</strong>.",
      iosStepTwo: "اضغط زر <strong>المشاركة</strong> أسفل الشاشة.",
      iosStepThree: "اختر <strong>إضافة إلى الشاشة الرئيسية</strong> ثم اضغط <strong>إضافة</strong>.",
      iosTip: "إذا فتحت الصفحة في تطبيق آخر، افتحها أولًا في Safari.",
      androidGuideTitle: "التثبيت على Android",
      androidStepOne: "افتح هذه الصفحة في <strong>Chrome</strong> أو <strong>Brave</strong>.",
      androidStepTwo: "اضغط <strong>تثبيت التطبيق</strong> عند ظهوره أو افتح قائمة المتصفح.",
      androidStepThree: "اختر <strong>تثبيت التطبيق</strong> أو <strong>إضافة إلى الشاشة الرئيسية</strong>.",
      androidTip: "يفتح زر Android نافذة التثبيت عندما يدعمها المتصفح.",
      footerLine: "حياة أكثر خضرة، كل يوم.",
      footerLinksLabel: "روابط التواصل والاتصال",
      instagram: "إنستغرام",
      whatsapp: "واتساب",
      contact: "اتصل بنا",
      installStarted: "جارٍ فتح نافذة تثبيت Android…",
      installComplete: "جولنار جاهز للتثبيت.",
      installDismissed: "يمكنك تثبيت جولنار لاحقًا من قائمة متصفح Android."
    },
    ckb: {
      title: "ئەپڵیکەیشنی گوڵنار دابەزێنە",
      description: "ئەپڵیکەیشنی فرۆشگای ڕووەکی گوڵنار لە iPhone یان Android دابەزێنە یان دایبمەزرێنە.",
      languageLabel: "زمان هەڵبژێرە",
      eyebrow: "هەموو ڕۆژێک ژیانێکی سەوزتر",
      headline: "ماڵەکەت سەوزتر بکە<br>بە تەنها <em>یەک کرتە.</em>",
      descriptionText: "گوڵنار لەگەڵ خۆت ببە بۆ دۆزینەوەی ڕووەکی جوان، ئامۆژگاری چاودێری و سەوزایی لە هەر شوێنێک بیت.",
      getFor: "بۆ دابەزاندن لەسەر",
      iosButton: "دابەزاندن بۆ iPhone",
      androidButton: "دابەزاندن بۆ Android",
      downloadNote: "ئەپڵیکەیشنی وێب بەخۆڕایی دابمەزرێنە؛ پێویستت بە هەژماری ئەپ ستۆر نییە.",
      appLinkLabel: "ئەم ئەپڵیکەیشنە هاوبەش بکە",
      shareButton: "هاوبەشکردن",
      copyButton: "کۆپیکردنی بەستەر",
      linkCopied: "بەستەری ئەپڵیکەیشنەکە کۆپی کرا.",
      linkCopyError: "کۆپیکردنی بەستەر سەرکەوتوو نەبوو. بەستەرەکە هەڵبژێرە و کۆپی بکە.",
      shareTitle: "گوڵنار — ڕووەک بۆ ماڵی تۆ",
      shareText: "لەگەڵ گوڵنار ڕووەک، پێداویستیی باخچە و ئامۆژگاری چاودێریی بەسوود بدۆزەرەوە.",
      phoneLabel: "پێشبینینی ئەپڵیکەیشنی گوڵنار",
      previewGreeting: "ژیانێکی ئارامتر",
      previewTitle: "شوێنێک بکەرەوە بۆ<br><em>شتێک کە دەڕوێت.</em>",
      previewFeature: "سروشت بهێنە ناو ماڵەوە",
      previewShop: "ڕووەکی خۆت بدۆزەرەوە",
      previewSeeAll: "هەمووی ببینە",
      previewPlantOne: "پۆثۆسی زێڕین",
      previewPlantTwo: "دار زەیتوونی بچووک",
      previewHome: "ماڵەوە",
      previewExplore: "گەڕان",
      previewSaved: "پاشەکەوتکراو",
      previewCaption: "گۆشە سەوزە بچووکەکەت، لە هەر شوێنێک",
      guideEyebrow: "کاتێک ئامادە بیت",
      guideTitle: "بە چەند کرتەیەک ئامادەی بکە.",
      iosGuideTitle: "دامەزراندن لەسەر iPhone یان iPad",
      iosStepOne: "ئەم پەڕەیە لە <strong>Safari</strong> بکەرەوە.",
      iosStepTwo: "دوگمەی <strong>هاوبەشکردن</strong> لە خوارەوەی شاشەکە دابگرە.",
      iosStepThree: "<strong>زیادکردن بۆ شاشەی سەرەکی</strong> هەڵبژێرە و پاشان <strong>زیادکردن</strong> دابگرە.",
      iosTip: "ئەگەر پەڕەکە لە ئەپێکی تر کرایەوە، سەرەتا لە Safari بکەرەوە.",
      androidGuideTitle: "دامەزراندن لەسەر Android",
      androidStepOne: "ئەم پەڕەیە لە <strong>Chrome</strong> یان <strong>Brave</strong> بکەرەوە.",
      androidStepTwo: "ئەگەر پەیامی <strong>دامەزراندنی ئەپ</strong> هات، دایبگرە یان لیستی وێبگەڕەکە بکەرەوە.",
      androidStepThree: "<strong>دامەزراندنی ئەپ</strong> یان <strong>زیادکردن بۆ شاشەی سەرەکی</strong> هەڵبژێرە.",
      androidTip: "دوگمەی Android کاتێک وێبگەڕەکەت پشتگیری بکات پەنجەرەی دامەزراندن دەکاتەوە.",
      footerLine: "هەموو ڕۆژێک ژیانێکی سەوزتر.",
      footerLinksLabel: "بەستەرەکانی پەیوەندی و تۆڕە کۆمەڵایەتییەکان",
      instagram: "ئینستاگرام",
      whatsapp: "واتساپ",
      contact: "پەیوەندی",
      installStarted: "پەنجەرەی دامەزراندنی Android دەکرێتەوە…",
      installComplete: "گوڵنار ئامادەیە بۆ دامەزراندن.",
      installDismissed: "هەر کاتێک دەتوانیت لە لیستی وێبگەڕی Android گوڵنار دابمەزرێنیت."
    }
  };

  const languageMeta = {
    en: { dir: "ltr", locale: "en-IQ" },
    ar: { dir: "rtl", locale: "ar-IQ" },
    ckb: { dir: "rtl", locale: "ar-IQ" }
  };
  const languageStorageKey = "verdant.language";
  const languageSelect = document.querySelector("#share-language");
  const status = document.querySelector("#install-status");
  const installUrls = window.GULNAR_DOWNLOAD_URLS || {};
  const configuredAppUrl = safeDownloadUrl(window.GULNAR_APP_URL);
  const appUrl = configuredAppUrl ? configuredAppUrl.replace(/\/$/, "") : "https://gulzhin.vercel.app";
  const storedLanguage = localStorage.getItem(languageStorageKey);
  let language = new URLSearchParams(location.search).get("lang") || storedLanguage || "en";
  let deferredInstallPrompt = null;

  if (storedLanguage === "en" || storedLanguage === "ar" || storedLanguage === "ckb") {
    localStorage.setItem(languageStorageKey, JSON.stringify(storedLanguage));
  } else if (storedLanguage) {
    try {
      language = new URLSearchParams(location.search).get("lang") || JSON.parse(storedLanguage) || "en";
    } catch (error) {
      console.error("Unable to read the saved app language.", error);
    }
  }

  if (!translations[language]) language = "en";

  function applyLanguage() {
    const meta = languageMeta[language];
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    document.title = translations[language].title;
    document.querySelector("#share-description").content = translations[language].description;
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const value = translations[language][element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(element => {
      const value = translations[language][element.dataset.i18nHtml];
      if (value !== undefined) element.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
      const value = translations[language][element.dataset.i18nAriaLabel];
      if (value !== undefined) element.setAttribute("aria-label", value);
    });
    languageSelect.value = language;
    languageSelect.setAttribute("aria-label", translations[language].languageLabel);
  }

  function safeDownloadUrl(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, location.origin);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function configureDownloadLink(id, url) {
    if (!url) return;
    const link = document.querySelector(id);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  configureDownloadLink("#ios-download", safeDownloadUrl(installUrls.ios));
  configureDownloadLink("#android-download", safeDownloadUrl(installUrls.android));
  const appLink = document.querySelector("#app-link");
  appLink.href = appUrl;
  appLink.textContent = appUrl;
  applyLanguage();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js", { updateViaCache: "none" })
      .catch(error => console.error("Unable to register the app service worker.", error));
  }

  languageSelect.addEventListener("change", event => {
    language = event.target.value;
    localStorage.setItem(languageStorageKey, JSON.stringify(language));
    applyLanguage();
  });

  async function copyAppUrl() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(appUrl);
      return;
    }
    const helper = document.createElement("textarea");
    helper.value = appUrl;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand("copy");
    helper.remove();
    if (!copied) throw new Error("Clipboard access is unavailable.");
  }

  document.querySelector("#share-link-button").addEventListener("click", async () => {
    if (!navigator.share) {
      document.querySelector("#copy-link-button").click();
      return;
    }
    try {
      await navigator.share({
        title: translations[language].shareTitle,
        text: translations[language].shareText,
        url: appUrl
      });
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Unable to share the Gulnar app link.", error);
      try {
        await copyAppUrl();
        status.textContent = translations[language].linkCopied;
      } catch (copyError) {
        console.error("Unable to copy the Gulnar app link after sharing failed.", copyError);
        status.textContent = translations[language].linkCopyError;
      }
    }
  });

  document.querySelector("#copy-link-button").addEventListener("click", async () => {
    try {
      await copyAppUrl();
      status.textContent = translations[language].linkCopied;
    } catch (error) {
      console.error("Unable to copy the Gulnar app link.", error);
      status.textContent = translations[language].linkCopyError;
    }
  });

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });

  document.querySelector("#android-download").addEventListener("click", async event => {
    if (safeDownloadUrl(installUrls.android) || !deferredInstallPrompt) return;
    event.preventDefault();
    status.textContent = translations[language].installStarted;
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    status.textContent = translations[language][choice.outcome === "accepted" ? "installComplete" : "installDismissed"];
  });
})();
