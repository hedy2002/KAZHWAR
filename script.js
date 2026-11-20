(() => {
  "use strict";

  const FIB_DEFAULT = "+9647728503201";
  const FIB_LEGACY_DEFAULT = "7000000000000";
  const LANGUAGE_STORAGE = "verdant.language";
  const SUPABASE_CONFIG = window.VERDANT_SUPABASE_CONFIG || {};
  const APP_SHARE_URL = window.GULNAR_APP_URL || "https://gulzhin.vercel.app";
  const supabaseSettingsPresent = Boolean(SUPABASE_CONFIG.url || SUPABASE_CONFIG.anonKey);
  let supabaseClient = null;
  if (supabaseSettingsPresent && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
    try {
      if (!window.supabase?.createClient) throw new Error("Supabase client library did not load.");
      const freshApiFetch = (input, init = {}) => {
        const method = (init.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
        return fetch(input, method === "GET" ? { ...init, cache: "no-store" } : init);
      };
      supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
        global: { fetch: freshApiFetch }
      });
    } catch (error) {
      console.error("Unable to initialize the Supabase client.", error);
    }
  }
  const languageMeta = {
    en: { dir: "ltr", locale: "en-IQ" },
    ar: { dir: "rtl", locale: "ar-IQ" },
    ckb: { dir: "rtl", locale: "ar-IQ" }
  };
  const STORAGE = {
    products: "verdant.products",
    cart: "verdant.cart",
    orders: "verdant.orders",
    settings: "verdant.settings"
  };
  const seedProducts = [
    { id: "monstera", name: "Monstera Deliciosa", category: "Indoor Plants", image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80", wholesale: 18000, retail: 28000, stock: 12, notes: "A bold, easygoing beauty. Loves bright, indirect light." },
    { id: "olive", name: "Little Olive Tree", category: "Outdoor Plants", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80", wholesale: 23000, retail: 36000, stock: 8, notes: "A sun-loving little tree for patios and bright corners." },
    { id: "pothos", name: "Golden Pothos", category: "Indoor Plants", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80", wholesale: 9000, retail: 16000, stock: 18, notes: "A cheerful trailing plant that is happy in most rooms." },
    { id: "terracotta", name: "Terracotta Planter", category: "Outdoor Plants", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80", wholesale: 11000, retail: 19000, stock: 10, notes: "A classic home for your favorite leafy friend." },
    { id: "fertilizer", name: "Everyday Plant Food", category: "Medicines & Food", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80", wholesale: 6000, retail: 11000, stock: 25, notes: "A gentle feed to keep your growing things happy." },
    { id: "snake", name: "Snake Plant", category: "Indoor Plants", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80", wholesale: 14000, retail: 22000, stock: 9, notes: "Architectural, resilient, and wonderfully low fuss." },
    { id: "lavender", name: "Garden Lavender", category: "Outdoor Plants", image: "https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=80", wholesale: 12000, retail: 20000, stock: 11, notes: "Fragrant purple blooms that love a sunny spot." },
    { id: "leaf-care", name: "Leaf & Root Care", category: "Medicines & Food", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80", wholesale: 7000, retail: 13000, stock: 16, notes: "A handy plant care essential for your home jungle." },
    { id: "peat-moss", name: "Peat Moss", category: "Peat Moss", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80", wholesale: 5000, retail: 8000, stock: 20, notes: "A moisture-retaining growing medium for garden mixes." },
    { id: "ornamental-olive", name: "Ornamental Olive", category: "Ornamental Olive", image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80", wholesale: 30000, retail: 45000, stock: 6, notes: "A sun-loving ornamental olive for patios and bright spaces." }
  ];
  const translations = {
    en: {
      pageTitle: "Gulnar — Plants for your kind of home", pageDescription: "Thoughtfully grown plants and garden essentials, delivered to your door.",
      discountLead: "A little something for your space:", discountTail: "off everything", brandLabel: "Gulnar home", mainNavigation: "Main navigation", adminOpen: "Open admin panel", adminTitle: "Shop studio", bag: "Bag", openBag: "Open bag", navShop: "Shop all", navIndoor: "Indoor plants", navOutdoor: "Outdoor plants", navStory: "Our story", languageLabel: "Choose language",
      heroEyebrow: "A softer kind of living", heroTitle: "Make room<br>for <em>something</em><br>growing.", heroDescription: "Thoughtfully grown plants and garden essentials to make your everyday a little more alive.", heroCta: "Find your green", heroLoved: "Loved by plant people", heroHome: "in every kind of home", heroImageAlt: "Sunlit leafy plants in a warm home", heroSticker: "GROW<br>AT YOUR<br>OWN PACE", heroCaption: "Bring the outside in", heroSide: "ROOTED IN THE EVERYDAY · EST. 2024",
      benefitsLabel: "Our promises", benefitGrown: "Grown with care", benefitHealthy: "Happy, healthy plants", benefitDoor: "At your doorstep", benefitDelivery: "Delivery for {fee}", benefitHelp: "Here to help", benefitAdvice: "Real people, real advice",
      shopEyebrow: "A little green goes a long way", shopTitle: "Find your <em>happy place.</em>", shopDescription: "From the sunniest windowsill to your garden gate, there's a plant for that.", categoryFilters: "Filter products by category", categoryAll: "Everything", categoryIndoor: "Indoor plants", categoryOutdoor: "Outdoor plants", categoryCare: "Medicines & fertilizers", searchPlaceholder: "Find a plant...", searchLabel: "Search products", emptyProductsTitle: "No leaves found.", emptyProductsText: "Try another search or category.",
      storyImageAlt: "Potted green plants and plant cuttings", storyEyebrow: "A note from our little corner", storyTitle: "More green.<br><em>Less perfect.</em>", storyDescription: "We think plants make a place feel like yours. So we pick the good ones, share what we know, and leave the rest to you. No green thumb required.", storyLink: "A plant for every pace", footerLine: "A little more alive, every day.", footerMade: "Made for growing things", getApp: "Get the app", shareApp: "Share Gulnar", shareCopied: "Gulnar link copied.", shareCopyError: "Couldn't copy the Gulnar link. Please try again.", shareTitle: "Gulnar — Plants for your kind of home", shareMessage: "Explore plants, garden essentials, and helpful care tips with Gulnar.",
      closeCart: "Close cart", cartTitle: "Your bag", cartEyebrow: "YOUR LITTLE GREEN HAUL", progressBag: "Your bag", progressDetails: "Your details", cartEmptyTitle: "Your bag is taking a breather.", cartEmptyText: "Let's find a plant to bring home.", keepBrowsing: "Keep browsing", deliveryNoteLabel: "A note for your delivery", optional: "optional", deliveryNotePlaceholder: "Anything we should know? A gate code, a sunny spot...", subtotal: "Subtotal", discountLine: "Little green discount", delivery: "Delivery", fixedFee: "fixed fee", total: "Total", continueCheckout: "Continue to details", deliveryFeeNotice: "A fixed delivery fee of {fee} applies to every order.", backToBag: "Back to your bag",
      checkoutAddressTitle: "Where should we find you?", yourName: "Your name", namePlaceholder: "e.g. Noor Ahmed", phoneNumber: "Phone number", phonePlaceholder: "+964 7XX XXX XXXX", deliveryAddress: "Delivery address", addressPlaceholder: "Area, street, building, apartment...", deliveryPreference: "Delivery preference", instructionCall: "Call me on arrival", instructionLeave: "Leave it at the door", instructionHand: "Hand it to me", instructionBefore: "Call before delivery", paymentTitle: "How would you like to pay?", paymentFib: "FIB transfer", paymentFibHint: "Upload your transfer receipt", fibAccountLabel: "Transfer to this account", copy: "Copy", receiptLabel: "Payment receipt screenshot", receiptHint: "required · JPG, PNG or WebP", paymentCard: "QiCard / Mastercard", paymentCardHint: "Debit or credit card", useSavedCard: "Use saved card", savedCardLabel: "Saved card", savedQiCard: "QiCard ending 4821", savedMastercard: "Mastercard ending 0936", useNewCard: "Use a new card instead", cardNumber: "Card number", cardNumberPlaceholder: "0000 0000 0000 0000", expiry: "Expiry", expiryPlaceholder: "MM/YY", cvv: "CVV", cvvPlaceholder: "•••", cardPrivacy: "Card details are used for this demo checkout only and are not saved.", paymentCash: "Cash on delivery", paymentCashHint: "Pay when your plants arrive", currency: "IQD", totalIncludingDelivery: "Total including delivery", placeOrder: "Place your order", deliveryTerms: "By placing your order, you agree to our delivery terms.",
      successEyebrow: "A LITTLE SOMETHING IS GROWING", successTitle: "Order placed,<br><em>plant parent.</em>", successFib: "We have your order and receipt. We'll be in touch once your transfer is confirmed.", successOther: "Your order is in good hands. We'll be in touch before it arrives.", finishOrder: "Back to the garden",
      closeAdmin: "Close admin panel", adminEyebrow: "YOUR LITTLE GREEN EMPIRE", adminNotice: "Demo admin panel · changes are saved in this browser only.", products: "Products", orders: "Orders", settings: "Settings", adminProductsEyebrow: "THE GOOD STUFF", addPlant: "+ Add a plant", addProduct: "Add a product", editProduct: "A little product update", productName: "Product name", category: "Category", imageUrl: "Image URL", imagePlaceholder: "https://...", wholesalePrice: "Wholesale price (IQD)", retailPrice: "Retail price (IQD)", stockQuantity: "Stock quantity", notes: "Notes", productNotesPlaceholder: "Plant care, size, details...", cancel: "Cancel", saveProduct: "Save product", adminOrdersEyebrow: "FROM YOUR CUSTOMERS", adminSettingsEyebrow: "SET THE MOOD", shopSettings: "Shop settings", storewideDiscount: "Storewide discount", discountHelp: "Applied to all product prices and cart totals", fixedDeliveryFee: "Fixed delivery fee", deliveryHelp: "Applied to every order", fibAccountNumber: "FIB account number", fibHelp: "Shown at checkout", saveSettings: "Save settings", profitEyebrow: "YOUR GROWING BUSINESS", profitTitle: "Retail margin, before discount", profitDescription: "Per-product profit and margin are based on retail price less wholesale cost.",
      categoryIndoorDisplay: "Indoor plants", categoryOutdoorDisplay: "Outdoor plants", categoryCareDisplay: "Plant care", stockAvailable: "{count} ready to grow", stockUnavailable: "Currently out of stock", each: "each", remove: "Remove", removeOne: "Remove one {name}", addOne: "Add one {name}", addProductToBag: "Add {name} to bag", anItem: "An item", receiptPreviewAlt: "Selected payment receipt preview", productsInShop: "products in the shop", itemsInStock: "items in stock", retailStockValue: "retail stock value", profitPotential: "Potential profit across current stock", productEmpty: "No products yet. Add something lovely.", stockLabel: "Stock", wholesaleLabel: "Wholesale", retailLabel: "Retail", profitLabel: "Profit", perItem: "/ item", marginLabel: "margin", edit: "Edit", delete: "Delete", deleteConfirm: "Delete \"{name}\" from the shop?", productUpdated: "Product updated", productAdded: "A new plant has taken root", productRemoved: "{name} removed from the shop", retailTooLow: "Retail price should be at least the wholesale price.",
      noOrders: "No orders just yet. Good things take root.", receiptTitle: "Transfer receipt", receiptAlt: "Payment receipt for {id}", openReceipt: "Open receipt in a new tab", orderPhone: "Phone", orderAddress: "Address", orderDelivery: "Delivery", orderNote: "Note", orderPayment: "Payment", orderSubtotal: "Subtotal", orderTotal: "Total", approve: "Approve", reject: "Reject", statusPending: "Pending", statusApproved: "Approved", statusRejected: "Rejected", orderApproved: "Order {id} approved", orderRejected: "Order {id} rejected", paymentDisplayFib: "FIB transfer", paymentDisplayCard: "QiCard / Mastercard", paymentDisplayCash: "Cash on delivery", cardNew: "New {last4} (details not stored)",
      noStorage: "Couldn't save changes in this browser. Check available storage.", unavailable: "{name} is no longer available in that quantity.", stockLimit: "That's all the stock we have right now.", addedToBag: "{name} added to your bag", receiptTypeError: "Please choose a JPG, PNG, or WebP screenshot.", receiptSizeError: "Please choose a receipt image smaller than 2 MB.", receiptReadError: "Couldn't read that receipt. Please try another image.", receiptReady: "Receipt ready: {name}", fibCopied: "FIB account number copied", copyUnavailable: "Copy isn't available here. Please select the account number.", browserBlocked: "Your browser blocked the receipt preview.", settingsSaved: "Shop settings saved", orderPlacedToast: "Your order is on its way to growing!", receiptRequired: "Please upload your payment receipt screenshot.", cardNumberInvalid: "Enter a valid card number.", expiryInvalid: "Use MM/YY format.", cvvInvalid: "Enter a 3 or 4 digit security code.", orderSuccessId: "ORDER {id}",
      product_monstera: "Monstera Deliciosa", notes_monstera: "A bold, easygoing beauty. Loves bright, indirect light.", product_olive: "Little Olive Tree", notes_olive: "A sun-loving little tree for patios and bright corners.", product_pothos: "Golden Pothos", notes_pothos: "A cheerful trailing plant that is happy in most rooms.", product_terracotta: "Terracotta Planter", notes_terracotta: "A classic home for your favorite leafy friend.", product_fertilizer: "Everyday Plant Food", notes_fertilizer: "A gentle feed to keep your growing things happy.", product_snake: "Snake Plant", notes_snake: "Architectural, resilient, and wonderfully low fuss.", product_lavender: "Garden Lavender", notes_lavender: "Fragrant purple blooms that love a sunny spot.", "product_leaf-care": "Leaf & Root Care", "notes_leaf-care": "A handy plant care essential for your home jungle."
    },
    ar: {
      pageTitle: "جولنار — نباتات تناسب منزلك", pageDescription: "نباتات مختارة بعناية ولوازم للحدائق، تصلك حتى باب منزلك.",
      discountLead: "هدية صغيرة لمساحتك:", discountTail: "خصم على كل المنتجات", brandLabel: "الرئيسية — جولنار", mainNavigation: "التنقل الرئيسي", adminOpen: "فتح لوحة الإدارة", adminTitle: "إدارة المتجر", bag: "السلة", openBag: "فتح السلة", navShop: "تسوق الكل", navIndoor: "نباتات داخلية", navOutdoor: "نباتات خارجية", navStory: "قصتنا", languageLabel: "اختر اللغة",
      heroEyebrow: "حياة أكثر هدوءًا", heroTitle: "افسح مكانًا<br>لشيءٍ <em>ينمو</em><br>بجوارك.", heroDescription: "نباتات مزروعة بعناية ولوازم للحدائق تضفي حياة أكثر على يومك.", heroCta: "اكتشف نباتاتك", heroLoved: "محبوبة من عشاق النباتات", heroHome: "في كل بيت", heroImageAlt: "نباتات خضراء مورقة في ضوء الشمس داخل منزل دافئ", heroSticker: "ازرع<br>على<br>مهلك", heroCaption: "أدخل الطبيعة إلى منزلك", heroSide: "جذورنا في تفاصيل الحياة · منذ ٢٠٢٤",
      benefitsLabel: "وعودنا", benefitGrown: "مزروعة بعناية", benefitHealthy: "نباتات سعيدة وصحية", benefitDoor: "حتى باب منزلك", benefitDelivery: "التوصيل {fee}", benefitHelp: "نحن هنا لمساعدتك", benefitAdvice: "نصيحة من أشخاص حقيقيين",
      shopEyebrow: "لمسة خضراء تصنع فرقًا", shopTitle: "اعثر على <em>مساحتك السعيدة.</em>", shopDescription: "من نافذة مشمسة إلى حديقة منزلك، ستجد نباتًا يناسبك.", categoryFilters: "تصفية المنتجات حسب الفئة", categoryAll: "كل المنتجات", categoryIndoor: "نباتات داخلية", categoryOutdoor: "نباتات خارجية", categoryCare: "الأدوية والأسمدة", searchPlaceholder: "ابحث عن نبات...", searchLabel: "ابحث عن المنتجات", emptyProductsTitle: "لم نعثر على نباتات.", emptyProductsText: "جرّب بحثًا أو فئة أخرى.",
      storyImageAlt: "نباتات خضراء في أصص وعُقل نباتية", storyEyebrow: "رسالة من ركننا الصغير", storyTitle: "مزيد من الخضرة.<br><em>بلا تكلف.</em>", storyDescription: "نؤمن أن النباتات تجعل المكان أقرب إليك. نختار أجملها ونشاركك ما نعرفه، والباقي متروك لك. لا تحتاج إلى خبرة في الزراعة.", storyLink: "نبات يناسب كل إيقاع", footerLine: "حياة أكثر خضرة، كل يوم.", footerMade: "صُنع لمحبي النباتات", getApp: "حمّل التطبيق", shareApp: "شارك جولنار", shareCopied: "تم نسخ رابط جولنار.", shareCopyError: "تعذر نسخ رابط جولنار. حاول مرة أخرى.", shareTitle: "جولنار — نباتات تناسب منزلك", shareMessage: "اكتشف النباتات ولوازم الحدائق ونصائح العناية المفيدة مع جولنار.",
      closeCart: "إغلاق السلة", cartTitle: "سلتك", cartEyebrow: "نباتاتك الصغيرة بانتظارك", progressBag: "السلة", progressDetails: "بياناتك", cartEmptyTitle: "سلتك تأخذ استراحة قصيرة.", cartEmptyText: "هيا نبحث عن نبات جديد لمنزلك.", keepBrowsing: "تابع التسوق", deliveryNoteLabel: "ملاحظة للتوصيل", optional: "اختياري", deliveryNotePlaceholder: "هل هناك ما ينبغي أن نعرفه؟ رمز البوابة أو مكان مشمس...", subtotal: "المجموع الفرعي", discountLine: "خصم النباتات", delivery: "التوصيل", fixedFee: "رسوم ثابتة", total: "الإجمالي", continueCheckout: "تابع إلى بياناتك", deliveryFeeNotice: "تُضاف رسوم توصيل ثابتة قدرها {fee} إلى كل طلب.", backToBag: "العودة إلى السلة",
      checkoutAddressTitle: "إلى أين نوصل طلبك؟", yourName: "الاسم", namePlaceholder: "مثال: نور أحمد", phoneNumber: "رقم الهاتف", phonePlaceholder: "+964 7XX XXX XXXX", deliveryAddress: "عنوان التوصيل", addressPlaceholder: "المنطقة، الشارع، المبنى، الشقة...", deliveryPreference: "تعليمات التوصيل", instructionCall: "اتصل بي عند الوصول", instructionLeave: "اتركه عند الباب", instructionHand: "سلّمه لي مباشرة", instructionBefore: "اتصل قبل التوصيل", paymentTitle: "كيف تود الدفع؟", paymentFib: "تحويل FIB", paymentFibHint: "ارفع إيصال التحويل", fibAccountLabel: "حوّل إلى هذا الحساب", copy: "نسخ", receiptLabel: "صورة إيصال الدفع", receiptHint: "مطلوبة · JPG أو PNG أو WebP", paymentCard: "QiCard / Mastercard", paymentCardHint: "بطاقة خصم أو ائتمان", useSavedCard: "استخدم بطاقة محفوظة", savedCardLabel: "البطاقة المحفوظة", savedQiCard: "QiCard ينتهي بـ 4821", savedMastercard: "Mastercard ينتهي بـ 0936", useNewCard: "استخدم بطاقة جديدة", cardNumber: "رقم البطاقة", cardNumberPlaceholder: "0000 0000 0000 0000", expiry: "تاريخ الانتهاء", expiryPlaceholder: "MM/YY", cvv: "رمز الأمان", cvvPlaceholder: "•••", cardPrivacy: "تُستخدم بيانات البطاقة لهذا الطلب التجريبي فقط ولا يتم حفظها.", paymentCash: "الدفع نقدًا عند الاستلام", paymentCashHint: "ادفع عند وصول نباتاتك", currency: "د.ع", totalIncludingDelivery: "الإجمالي مع التوصيل", placeOrder: "تأكيد الطلب", deliveryTerms: "بتأكيد الطلب، فإنك توافق على شروط التوصيل.",
      successEyebrow: "هناك شيء جميل في طريقه إليك", successTitle: "تم طلبك،<br><em>يا صديق النباتات.</em>", successFib: "وصلنا طلبك وإيصال التحويل. سنتواصل معك بعد تأكيد التحويل.", successOther: "طلبك بأيدٍ أمينة. سنتواصل معك قبل وصوله.", finishOrder: "العودة إلى الحديقة",
      closeAdmin: "إغلاق لوحة الإدارة", adminEyebrow: "مساحتك الخضراء الصغيرة", adminNotice: "لوحة تجريبية · تُحفظ التغييرات في هذا المتصفح فقط.", products: "المنتجات", orders: "الطلبات", settings: "الإعدادات", adminProductsEyebrow: "منتجاتنا المختارة", addPlant: "+ أضف نبتة", addProduct: "إضافة منتج", editProduct: "تعديل المنتج", productName: "اسم المنتج", category: "الفئة", imageUrl: "رابط الصورة", imagePlaceholder: "https://...", wholesalePrice: "سعر الجملة (د.ع)", retailPrice: "سعر البيع (د.ع)", stockQuantity: "كمية المخزون", notes: "ملاحظات", productNotesPlaceholder: "العناية بالنبات، الحجم، التفاصيل...", cancel: "إلغاء", saveProduct: "حفظ المنتج", adminOrdersEyebrow: "طلبات عملائك", adminSettingsEyebrow: "إعدادات متجرك", shopSettings: "إعدادات المتجر", storewideDiscount: "خصم على المتجر بالكامل", discountHelp: "يُطبّق على أسعار المنتجات وإجمالي السلة", fixedDeliveryFee: "رسوم التوصيل الثابتة", deliveryHelp: "تُطبّق على كل طلب", fibAccountNumber: "رقم حساب FIB", fibHelp: "يظهر عند إتمام الطلب", saveSettings: "حفظ الإعدادات", profitEyebrow: "مشروعك الأخضر", profitTitle: "هامش البيع قبل الخصم", profitDescription: "يُحسب ربح وهامش كل منتج من سعر البيع مطروحًا منه سعر الجملة.",
      categoryIndoorDisplay: "نباتات داخلية", categoryOutdoorDisplay: "نباتات خارجية", categoryCareDisplay: "عناية بالنباتات", stockAvailable: "{count} متوفر للنمو", stockUnavailable: "غير متوفر حاليًا", each: "للوحدة", remove: "إزالة", removeOne: "إزالة واحدة من {name}", addOne: "إضافة واحدة من {name}", addProductToBag: "أضف {name} إلى السلة", anItem: "عنصر", receiptPreviewAlt: "معاينة إيصال الدفع المحدد", productsInShop: "منتج في المتجر", itemsInStock: "قطعة في المخزون", retailStockValue: "قيمة المخزون بسعر البيع", profitPotential: "الربح المتوقع من المخزون الحالي", productEmpty: "لا توجد منتجات بعد. أضف شيئًا جميلًا.", stockLabel: "المخزون", wholesaleLabel: "الجملة", retailLabel: "البيع", profitLabel: "الربح", perItem: "للوحدة", marginLabel: "هامش", edit: "تعديل", delete: "حذف", deleteConfirm: "هل تريد حذف «{name}» من المتجر؟", productUpdated: "تم تحديث المنتج", productAdded: "أُضيفت نبتة جديدة إلى المتجر", productRemoved: "تمت إزالة {name} من المتجر", retailTooLow: "يجب ألا يقل سعر البيع عن سعر الجملة.",
      noOrders: "لا توجد طلبات بعد. كل شيء ينمو في وقته.", receiptTitle: "إيصال التحويل", receiptAlt: "إيصال الدفع للطلب {id}", openReceipt: "فتح الإيصال في نافذة جديدة", orderPhone: "الهاتف", orderAddress: "العنوان", orderDelivery: "التوصيل", orderNote: "ملاحظة", orderPayment: "الدفع", orderSubtotal: "المجموع الفرعي", orderTotal: "الإجمالي", approve: "قبول", reject: "رفض", statusPending: "قيد الانتظار", statusApproved: "مقبول", statusRejected: "مرفوض", orderApproved: "تم قبول الطلب {id}", orderRejected: "تم رفض الطلب {id}", paymentDisplayFib: "تحويل FIB", paymentDisplayCard: "QiCard / Mastercard", paymentDisplayCash: "الدفع نقدًا عند الاستلام", cardNew: "جديدة تنتهي بـ {last4} (لا تُحفظ البيانات)",
      noStorage: "تعذر حفظ التغييرات في هذا المتصفح. تحقق من مساحة التخزين.", unavailable: "لم تعد الكمية المطلوبة من {name} متوفرة.", stockLimit: "هذه كل الكمية المتوفرة لدينا حاليًا.", addedToBag: "تمت إضافة {name} إلى سلتك", receiptTypeError: "اختر صورة إيصال بصيغة JPG أو PNG أو WebP.", receiptSizeError: "يجب أن يكون حجم صورة الإيصال أقل من ٢ ميغابايت.", receiptReadError: "تعذرت قراءة الإيصال. جرّب صورة أخرى.", receiptReady: "الإيصال جاهز: {name}", fibCopied: "تم نسخ رقم حساب FIB", copyUnavailable: "النسخ غير متاح هنا. يرجى تحديد رقم الحساب.", browserBlocked: "منع المتصفح فتح معاينة الإيصال.", settingsSaved: "تم حفظ إعدادات المتجر", orderPlacedToast: "طلبك بدأ رحلته إليك!", receiptRequired: "يرجى رفع صورة إيصال الدفع.", cardNumberInvalid: "أدخل رقم بطاقة صحيحًا.", expiryInvalid: "استخدم صيغة MM/YY.", cvvInvalid: "أدخل رمز أمان من ٣ أو ٤ أرقام.", orderSuccessId: "رقم الطلب {id}",
      product_monstera: "مونستيرا دليسيوسا", notes_monstera: "نبتة جميلة وسهلة العناية، تحب الضوء الساطع غير المباشر.", product_olive: "شجرة زيتون صغيرة", notes_olive: "شجرة صغيرة محبة للشمس، مناسبة للشرفات والزوايا المضيئة.", product_pothos: "بوتس ذهبي", notes_pothos: "نبتة متدلية مبهجة تنمو بسعادة في معظم الغرف.", product_terracotta: "أصيص فخاري", notes_terracotta: "بيت كلاسيكي لنبتتك الخضراء المفضلة.", product_fertilizer: "غذاء النباتات اليومي", notes_fertilizer: "سماد لطيف يساعد نباتاتك على النمو بسعادة.", product_snake: "نبتة جلد النمر", notes_snake: "أنيقة وقوية وسهلة العناية.", product_lavender: "خزامى الحديقة", notes_lavender: "أزهار بنفسجية عطرة تحب الأماكن المشمسة.", "product_leaf-care": "عناية الأوراق والجذور", "notes_leaf-care": "مستلزم عملي للعناية بنباتات منزلك."
    },
    ckb: {
      pageTitle: "گوڵنار — ڕووەک بۆ ماڵی تۆ", pageDescription: "ڕووەک و پێداویستیی باخچە کە بە وریایی گەشەیان پێدراوە، تا دەرگای ماڵت.",
      discountLead: "دیارییەکی بچووک بۆ شوێنی تۆ:", discountTail: "داشکاندن لەسەر هەموو شتێک", brandLabel: "سەرەتا — گوڵنار", mainNavigation: "ڕێنیشاندەری سەرەکی", adminOpen: "کردنەوەی پانێڵی بەڕێوەبەرایەتی", adminTitle: "بەڕێوەبردنی فرۆشگا", bag: "سەبەتە", openBag: "کردنەوەی سەبەتە", navShop: "هەموو بەرهەمەکان", navIndoor: "ڕووەکی ناوماڵ", navOutdoor: "ڕووەکی دەرەوە", navStory: "چیرۆکی ئێمە", languageLabel: "زمان هەڵبژێرە",
      heroEyebrow: "ژیانێکی ئارامتر", heroTitle: "شوێنێک بکەرەوە<br>بۆ شتێک کە <em>دەڕوێت</em><br>لە تەنیشتت.", heroDescription: "ڕووەک و پێداویستیی باخچە کە بە وریایی گەشەیان پێدراوە، ڕۆژانت زیندووتر دەکەن.", heroCta: "ڕووەکی خۆت بدۆزەرەوە", heroLoved: "خۆشەویستی خەڵکی ڕووەک", heroHome: "لە هەموو جۆرە ماڵێکدا", heroImageAlt: "ڕووەکی گەڵادار لە ژێر تیشکی خۆر لە ماڵێکی گەرمدا", heroSticker: "بڕوێنە<br>بە<br>هێواشی", heroCaption: "سروشت بهێنە ناو ماڵەوە", heroSide: "ڕەگمان لە ژیانی ڕۆژانەدایە · لە ٢٠٢٤ەوە",
      benefitsLabel: "بەڵێنییەکانمان", benefitGrown: "بە وریایی چێندراوە", benefitHealthy: "ڕووەکی تەندروست و دڵخۆش", benefitDoor: "تا دەرگای ماڵت", benefitDelivery: "گەیاندن {fee}", benefitHelp: "ئێمە لێرەین بۆ یارمەتیت", benefitAdvice: "ڕاوێژ لە کەسانی ڕاستەقینەوە",
      shopEyebrow: "کەمێک سەوزایی زۆر دەگۆڕێت", shopTitle: "<em>شوێنی دڵخۆشی</em> خۆت بدۆزەرەوە.", shopDescription: "لە پەنجەرەیەکی خۆرگیرەوە تا دەرگای باخچەکەت، ڕووەکێک هەیە بۆ تۆ.", categoryFilters: "پاڵاوتنی بەرهەم بەپێی جۆر", categoryAll: "هەموو بەرهەمەکان", categoryIndoor: "ڕووەکی ناوماڵ", categoryOutdoor: "ڕووەکی دەرەوە", categoryCare: "دەرمان و پەین", searchPlaceholder: "بگەڕێ بۆ ڕووەکێک...", searchLabel: "گەڕان بۆ بەرهەم", emptyProductsTitle: "هیچ ڕووەکێک نەدۆزرایەوە.", emptyProductsText: "وشەیەک یان جۆرێکی تر تاقی بکەرەوە.",
      storyImageAlt: "ڕووەکی سەوز لە گۆزە و لقە ڕووەکییەکان", storyEyebrow: "پەیامێک لە گوێرەکەی بچووکمانەوە", storyTitle: "سەوزایی زیاتر.<br><em>کەمتر تەواو.</em>", storyDescription: "باوەڕمان وایە ڕووەک شوێنەکە دەکاتە هی تۆ. ڕووەکە باشەکان هەڵدەبژێرین، ئەوەی دەیزانین پێت دەڵێین و ماوەکەی بۆ تۆ جێدەهێڵین. پێویستت بە ئەزموونی باخچەوانی نییە.", storyLink: "ڕووەکێک بۆ هەر شێوازێک", footerLine: "هەموو ڕۆژێک، کەمێک زیاتر زیندوو.", footerMade: "بۆ خۆشەویستانی ڕووەک دروستکراوە", getApp: "ئەپڵیکەیشن دابەزێنە", shareApp: "گوڵنار هاوبەش بکە", shareCopied: "بەستەری گوڵنار کۆپی کرا.", shareCopyError: "کۆپیکردنی بەستەری گوڵنار سەرکەوتوو نەبوو. دووبارە هەوڵ بدەوە.", shareTitle: "گوڵنار — ڕووەک بۆ ماڵی تۆ", shareMessage: "لەگەڵ گوڵنار ڕووەک، پێداویستیی باخچە و ئامۆژگاری چاودێریی بەسوود بدۆزەرەوە.",
      closeCart: "داخستنی سەبەتە", cartTitle: "سەبەتەکەت", cartEyebrow: "ڕووەکە بچووکەکانت چاوەڕێتن", progressBag: "سەبەتە", progressDetails: "زانیارییەکانت", cartEmptyTitle: "سەبەتەکەت پشوویەکی کورت دەدات.", cartEmptyText: "با ڕووەکێک بۆ ماڵەوە بدۆزینەوە.", keepBrowsing: "بگەڕێوە بۆ گەڕان", deliveryNoteLabel: "تێبینی بۆ گەیاندن", optional: "ئارەزوومەندانە", deliveryNotePlaceholder: "شتێک هەیە پێویست بزانین؟ کۆدی دەرگا یان شوێنێکی خۆرگیر...", subtotal: "کۆی لاوەکی", discountLine: "داشکاندنی ڕووەک", delivery: "گەیاندن", fixedFee: "کرێی جێگیر", total: "کۆی گشتی", continueCheckout: "بەردەوام بە بۆ زانیارییەکان", deliveryFeeNotice: "کرێی گەیاندنی جێگیری {fee} بۆ هەر داواکارییەک زیاد دەکرێت.", backToBag: "گەڕانەوە بۆ سەبەتە",
      checkoutAddressTitle: "داواکارییەکەت بۆ کوێ بنێرین؟", yourName: "ناوت", namePlaceholder: "بۆ نموونە: نور ئەحمەد", phoneNumber: "ژمارەی تەلەفۆن", phonePlaceholder: "+964 7XX XXX XXXX", deliveryAddress: "ناونیشانی گەیاندن", addressPlaceholder: "ناوچە، شەقام، بینا، ژوور...", deliveryPreference: "ڕێنمایی گەیاندن", instructionCall: "کاتێک گەیشت پەیوەندیم پێوە بکە", instructionLeave: "لەبەر دەرگا دایبنێ", instructionHand: "ڕاستەوخۆ پێم بدە", instructionBefore: "پێش گەیاندن پەیوەندیم پێوە بکە", paymentTitle: "چۆن دەتەوێت پارە بدەیت؟", paymentFib: "گواستنەوەی FIB", paymentFibHint: "وێنەی پسووڵەی گواستنەوە باربکە", fibAccountLabel: "بۆ ئەم هەژمارە بگوازەرەوە", copy: "لەبەرگرتنەوە", receiptLabel: "وێنەی پسووڵەی پارەدان", receiptHint: "پێویستە · JPG یان PNG یان WebP", paymentCard: "QiCard / Mastercard", paymentCardHint: "کارتی بانکی یان کرێدیت", useSavedCard: "کارتی پاشەکەوتکراو بەکاربهێنە", savedCardLabel: "کارتی پاشەکەوتکراو", savedQiCard: "QiCard کۆتایی بە 4821", savedMastercard: "Mastercard کۆتایی بە 0936", useNewCard: "لەبری ئەوە کارتی نوێ بەکاربهێنە", cardNumber: "ژمارەی کارت", cardNumberPlaceholder: "0000 0000 0000 0000", expiry: "بەسەرچوون", expiryPlaceholder: "MM/YY", cvv: "کۆدی پاراستن", cvvPlaceholder: "•••", cardPrivacy: "زانیاریی کارت تەنها بۆ ئەم داواکارییە تاقیکارییە بەکاردێت و پاشەکەوت ناکرێت.", paymentCash: "پارەدان لە کاتی وەرگرتن", paymentCashHint: "کاتێک ڕووەکەکانت گەیشتن پارە بدە", currency: "دینار", totalIncludingDelivery: "کۆی گشتی لەگەڵ گەیاندن", placeOrder: "داواکارییەکە پشتڕاست بکەرەوە", deliveryTerms: "بە ناردنی داواکارییەکەت، ڕازییت بە مەرجەکانی گەیاندن.",
      successEyebrow: "شتێکی جوان لە ڕێگادایە", successTitle: "داواکارییەکەت نێردرا،<br><em>خاوەنی ڕووەک.</em>", successFib: "داواکارییەکەت و پسووڵەکەت وەرگیرا. دوای پشتڕاستکردنەوەی گواستنەوەکە پەیوەندیت پێوە دەکەین.", successOther: "داواکارییەکەت لە دەستی ئێمەدا پارێزراوە. پێش گەیشتنی پەیوەندیت پێوە دەکەین.", finishOrder: "گەڕانەوە بۆ باخچە",
      closeAdmin: "داخستنی پانێڵی بەڕێوەبەرایەتی", adminEyebrow: "جیهانی سەوزی بچووکەکەت", adminNotice: "پانێڵی تاقیکاری · گۆڕانکارییەکان تەنها لەم وێبگەڕەدا پاشەکەوت دەکرێن.", products: "بەرهەمەکان", orders: "داواکارییەکان", settings: "ڕێکخستنەکان", adminProductsEyebrow: "باشترینەکان", addPlant: "+ ڕووەکێک زیاد بکە", addProduct: "زیادکردنی بەرهەم", editProduct: "دەستکاریکردنی بەرهەم", productName: "ناوی بەرهەم", category: "جۆر", imageUrl: "بەستەری وێنە", imagePlaceholder: "https://...", wholesalePrice: "نرخی کۆ (دینار)", retailPrice: "نرخی فرۆشتن (دینار)", stockQuantity: "بڕی کۆگا", notes: "تێبینی", productNotesPlaceholder: "چاودێری ڕووەک، قەبارە، وردەکاری...", cancel: "پاشگەزبوونەوە", saveProduct: "پاشەکەوتکردنی بەرهەم", adminOrdersEyebrow: "داواکاریی کڕیارەکانت", adminSettingsEyebrow: "ڕێکخستنەکانی فرۆشگا", shopSettings: "ڕێکخستنەکانی فرۆشگا", storewideDiscount: "داشکاندنی هەموو فرۆشگا", discountHelp: "لەسەر نرخی هەموو بەرهەم و کۆی سەبەتە جێبەجێ دەبێت", fixedDeliveryFee: "کرێی جێگیری گەیاندن", deliveryHelp: "بۆ هەر داواکارییەک جێبەجێ دەبێت", fibAccountNumber: "ژمارەی هەژماری FIB", fibHelp: "لە کاتی داواکاری پیشان دەدرێت", saveSettings: "پاشەکەوتکردنی ڕێکخستنەکان", profitEyebrow: "بازرگانییە سەوزەکەت", profitTitle: "قازانجی فرۆشتن پێش داشکاندن", profitDescription: "قازانج و ڕێژەی قازانجی هەر بەرهەمێک بە کەمکردنەوەی نرخی کۆ لە نرخی فرۆشتن هەژمار دەکرێت.",
      categoryIndoorDisplay: "ڕووەکی ناوماڵ", categoryOutdoorDisplay: "ڕووەکی دەرەوە", categoryCareDisplay: "چاودێری ڕووەک", stockAvailable: "{count} ئامادەیە بۆ گەشەکردن", stockUnavailable: "ئێستا بەردەست نییە", each: "بۆ هەر دانەیەک", remove: "لابردن", removeOne: "یەک دانە {name} لاببە", addOne: "یەک دانە {name} زیاد بکە", addProductToBag: "{name} بخەرە ناو سەبەتە", anItem: "شتێک", receiptPreviewAlt: "پێشبینینی پسووڵەی پارەدان", productsInShop: "بەرهەم لە فرۆشگا", itemsInStock: "دانە لە کۆگا", retailStockValue: "بەهای کۆگا بە نرخی فرۆشتن", profitPotential: "قازانجی چاوەڕوانکراوی کۆگای ئێستا", productEmpty: "هێشتا بەرهەم نییە. شتێکی جوان زیاد بکە.", stockLabel: "کۆگا", wholesaleLabel: "کۆ", retailLabel: "فرۆشتن", profitLabel: "قازانج", perItem: "بۆ هەر دانەیەک", marginLabel: "ڕێژە", edit: "دەستکاری", delete: "سڕینەوە", deleteConfirm: "دڵنیایت دەتەوێت «{name}» لە فرۆشگا بسڕیتەوە؟", productUpdated: "بەرهەم نوێکرایەوە", productAdded: "ڕووەکێکی نوێ زیادکرا", productRemoved: "{name} لە فرۆشگا سڕایەوە", retailTooLow: "نرخی فرۆشتن نابێت لە نرخی کۆ کەمتر بێت.",
      noOrders: "هێشتا داواکاری نییە. هەموو شتێک بە کاتی خۆی دەڕوێت.", receiptTitle: "پسووڵەی گواستنەوە", receiptAlt: "پسووڵەی پارەدانی داواکاری {id}", openReceipt: "کردنەوەی پسووڵە لە پەنجەرەیەکی نوێ", orderPhone: "تەلەفۆن", orderAddress: "ناونیشان", orderDelivery: "گەیاندن", orderNote: "تێبینی", orderPayment: "پارەدان", orderSubtotal: "کۆی لاوەکی", orderTotal: "کۆی گشتی", approve: "پەسەندکردن", reject: "ڕەتکردنەوە", statusPending: "چاوەڕوان", statusApproved: "پەسەندکرا", statusRejected: "ڕەتکرایەوە", orderApproved: "داواکاری {id} پەسەندکرا", orderRejected: "داواکاری {id} ڕەتکرایەوە", paymentDisplayFib: "گواستنەوەی FIB", paymentDisplayCard: "QiCard / Mastercard", paymentDisplayCash: "پارەدان لە کاتی وەرگرتن", cardNew: "نوێ کۆتایی بە {last4} (زانیاری پاشەکەوت نەکراوە)",
      noStorage: "گۆڕانکارییەکان لەم وێبگەڕەدا پاشەکەوت نەکران. شوێنی بەردەست بپشکنە.", unavailable: "ئەو بڕەی {name} چیتر بەردەست نییە.", stockLimit: "ئەمە هەموو ئەو بڕەیە کە ئێستا لە کۆگادا هەمانە.", addedToBag: "{name} خرایە ناو سەبەتەکەت", receiptTypeError: "وێنەیەکی JPG یان PNG یان WebP هەڵبژێرە.", receiptSizeError: "قەبارەی وێنەی پسووڵەکە دەبێت لە ٢ مێگابایت کەمتر بێت.", receiptReadError: "نەتوانرا پسووڵەکە بخوێندرێتەوە. وێنەیەکی تر تاقی بکەرەوە.", receiptReady: "پسووڵە ئامادەیە: {name}", fibCopied: "ژمارەی هەژماری FIB لەبەرگیرا", copyUnavailable: "لەبەرگرتنەوە لێرە بەردەست نییە. ژمارەی هەژمارەکە دیاری بکە.", browserBlocked: "وێبگەڕەکەت پێشگیری لە کردنەوەی وێنەی پسووڵەکە کرد.", settingsSaved: "ڕێکخستنەکانی فرۆشگا پاشەکەوت کران", orderPlacedToast: "داواکارییەکەت بەرەو تۆ دێت!", receiptRequired: "تکایە وێنەی پسووڵەی پارەدان باربکە.", cardNumberInvalid: "ژمارەیەکی دروستی کارت بنووسە.", expiryInvalid: "شێوازی MM/YY بەکاربهێنە.", cvvInvalid: "کۆدی پاراستنی ٣ یان ٤ ژمارە بنووسە.", orderSuccessId: "ژمارەی داواکاری {id}",
      product_monstera: "مونستیرا دێلیسیۆسا", notes_monstera: "ڕووەکێکی جوان و ئاسان بۆ چاودێرییە؛ ڕووناکیی زۆر بەڵام ناڕاستەوخۆی خۆش دەوێت.", product_olive: "دار زەیتوونی بچووک", notes_olive: "دارێکی بچووک کە خۆری خۆش دەوێت، بۆ بالکۆن و گۆشە ڕووناکەکان.", product_pothos: "پۆتۆسی زێڕین", notes_pothos: "ڕووەکێکی خۆشحاڵ و هەڵواسراوە کە لە زۆربەی ژوورەکاندا باش دەڕوێت.", product_terracotta: "گۆزەی قوڕین", notes_terracotta: "شوێنێکی کلاسیکی جوان بۆ ڕووەکە دڵخوازەکەت.", product_fertilizer: "خۆراکی ڕۆژانەی ڕووەک", notes_fertilizer: "پەینێکی نەرم بۆ گەشەکردنی دڵخۆشانەی ڕووەکەکانت.", product_snake: "ڕووەکی مار", notes_snake: "جوان، بەهێز و زۆر ئاسان بۆ چاودێری.", product_lavender: "لاڤەندەری باخچە", notes_lavender: "گوڵی مۆری بۆنخۆش کە شوێنی خۆرگیری خۆش دەوێت.", "product_leaf-care": "چاودێری گەڵا و ڕەگ", "notes_leaf-care": "پێداویستییەکی بەسوود بۆ چاودێریی ڕووەکەکانی ماڵەوەت."
    }
  };

  const chatbotTranslations = {
    en: {
      chatTitle: "🌿 Golstan AI", chatOpen: "Open plant assistant", chatClose: "Close plant assistant", chatInputLabel: "Ask the plant assistant", chatSend: "Send message",
      chatWelcome: "Hello! I can help with plant care, watering, fertilizers, and delivery.",
      chatPlaceholder: "Ask about plants, watering, or delivery...",
      chatReplyPlants: "Most plants do well with bright, indirect light and a pot with drainage. Check the product's care notes—light and space needs vary by plant.",
      chatReplyWater: "Check the top 2–3 cm (about 1 in) of soil; water when it feels dry, then let excess drain. Needs vary by plant, light, pot, and season—don't leave roots sitting in water.",
      chatReplyFertilizer: "Choose a fertilizer labeled for your plant and follow its package directions. Don't exceed the dose or mix products, and keep chemicals away from children and pets.",
      chatReplyDelivery: "Delivery fee varies based on product size. The admin will share a price for your approval before payment.",
      chatReplyGreeting: "Hi! What can I help you with—plant care, watering, fertilizer, or delivery?",
      chatReplyFallback: "I can help with plant care, watering, fertilizers, and delivery. Try asking about one of those."
    },
    ar: {
      chatTitle: "🌿 مساعد النباتات AI", chatOpen: "فتح مساعد النباتات", chatClose: "إغلاق مساعد النباتات", chatInputLabel: "اسأل مساعد النباتات", chatSend: "إرسال الرسالة",
      chatWelcome: "مرحبًا! أستطيع مساعدتك في العناية بالنباتات والري والأسمدة والتوصيل.",
      chatPlaceholder: "اسأل عن النباتات أو الري أو التوصيل...",
      chatReplyPlants: "تنمو معظم النباتات جيدًا في ضوء ساطع غير مباشر وأصيص به فتحات تصريف. راجع ملاحظات العناية بالمنتج، فاحتياجات الضوء والمساحة تختلف من نبتة لأخرى.",
      chatReplyWater: "تحقق من جفاف أول ٢–٣ سم من التربة؛ اسقِ النبات عندما تجف، واترك الماء الزائد يتصرف. تختلف الحاجة حسب النبتة والضوء والأصيص والفصل، ولا تترك الجذور في الماء.",
      chatReplyFertilizer: "اختر سمادًا مناسبًا لنوع نباتك واتبع تعليمات العبوة. لا تزد الجرعة ولا تخلط المنتجات، وأبعد المواد الكيميائية عن الأطفال والحيوانات الأليفة.",
      chatReplyDelivery: "تختلف رسوم التوصيل حسب حجم المنتج. سيشاركك المتجر السعر لموافقتك قبل الدفع.",
      chatReplyGreeting: "أهلًا! كيف أساعدك؟ اسأل عن العناية بالنباتات أو الري أو الأسمدة أو التوصيل.",
      chatReplyFallback: "أستطيع مساعدتك في العناية بالنباتات والري والأسمدة والتوصيل. جرّب سؤالًا عن أحد هذه المواضيع."
    },
    ckb: {
      chatTitle: "🌿 گوڵستانی AI", chatOpen: "کردنەوەی یاریدەدەری ڕووەک", chatClose: "داخستنی یاریدەدەری ڕووەک", chatInputLabel: "پرسیار لە یاریدەدەری ڕووەک بکە", chatSend: "ناردنی پەیام",
      chatWelcome: "سڵاو! دەتوانم یارمەتیت بدەم لە چاودێریی ڕووەک، ئاودان، پەین و گەیاندن.",
      chatPlaceholder: "پرسیارێک لەسەر ڕووەک، ئاودان یان گەیاندن...",
      chatReplyPlants: "زۆربەی ڕووەکەکان لە ڕووناکیی زۆر بەڵام ناڕاستەوخۆ و گۆزەیەک بە کونەکانی دەرچوونی ئاو باش دەڕوێن. تێبینیی چاودێریی بەرهەمەکە ببینە، چونکە پێویستییەکان جیاوازن.",
      chatReplyWater: "سەرەوەی خاک (نزیکەی ٢–٣ سم) بپشکنە؛ کاتێک وشک بوو ئاوی بدە و با ئاوی زیادە بڕوات. پێویستی بە ڕووەک، ڕووناکی، گۆزە و وەرز دەگۆڕێت؛ ڕەگ لە ناو ئاو مەهێڵە.",
      chatReplyFertilizer: "پەینێکی گونجاو بۆ ڕووەکەکە هەڵبژێرە و ڕێنمایی سەر پاکەتەکە جێبەجێ بکە. بڕەکە زیاد مەکە و بەرهەمە کیمیاییەکان تێکەڵ مەکە؛ لە منداڵ و ئاژەڵە ماڵییەکان دووریان بخەرەوە.",
      chatReplyDelivery: "کرێی گەیاندن بەپێی قەبارەی بەرهەم دەگۆڕێ. فرۆشگا نرخێکت پێ دەڵێت و پێش پارەدان دەتوانیت ڕازی بیت.",
      chatReplyGreeting: "سڵاو! لە چی یارمەتیت بدەم؟ لەسەر چاودێریی ڕووەک، ئاودان، پەین یان گەیاندن بپرسە.",
      chatReplyFallback: "دەتوانم لە چاودێریی ڕووەک، ئاودان، پەین و گەیاندن یارمەتیت بدەم. یەکێک لەم بابەتانە بپرسە."
    }
  };
  const featureTranslations = {
    en: {
      deliveryVaries: "Delivery fee varies based on product size", categoryCare: "Medicines & Food (دەرمان و خۆراک)", categoryPeat: "Peat Moss (پیدمۆز)", categoryOlive: "Ornamental Olive (زەیتوونی زینە)",
      categoryCareDisplay: "Medicines & Food", categoryPeatDisplay: "Peat Moss", categoryOliveDisplay: "Ornamental Olive", myOrders: "My orders", ordersEyebrow: "YOUR GARDEN JOURNEY", closeOrders: "Close orders", localOrderNotice: "Orders in this demo are saved in this browser.", noCustomerOrders: "No orders yet.", quoteRequested: "Delivery price requested", requestDeliveryPrice: "Request delivery price", completePayment: "Continue to payment", continuePayment: "Continue to payment", deliveryPricePending: "Delivery price pending", awaitingAgreement: "Price set · your agreement needed", awaitingPayment: "Price agreed · payment needed", deliveryPrice: "Delivery price", adminSetPrice: "Set delivery price", saveDeliveryPrice: "Set price", agreePrice: "I Agree (ڕازیم)", priceAgreed: "Delivery price agreed", priceSaved: "Delivery price saved", priceInvalid: "Enter a valid delivery price.", adminPasswordPrompt: "Enter admin password", adminPasswordIncorrect: "Incorrect admin password.", orderStatus: "Status", paymentPending: "Awaiting payment", orderScheduled: "Scheduled delivery", orderGift: "Gift", greetingCard: "Greeting card", deliveryDate: "Delivery date", deliveryTime: "Time slot", timeMorning: "Morning (9 am–12 pm)", timeAfternoon: "Afternoon (12–4 pm)", timeEvening: "Evening (4–8 pm)", isGift: "Is this a gift?", giftMessage: "Greeting card message", giftMessagePlaceholder: "Write a greeting for the card...", chooseImage: "Gallery / Files", takePhoto: "Use camera", receiptCompressing: "Preparing receipt image…", receiptImageError: "Please choose a valid image.", youMightLike: "You might also like", viewDetails: "View details", addToBag: "Add to bag", productDetails: "Product details", careEyebrow: "A little care goes a long way", careTitle: "A happier plant starts here.", careIntro: "Simple guidance for healthy roots, leaves, and blooms.", careWaterTitle: "Watering", careWaterText: "Check the top 2–3 cm of soil. Water when dry and let excess drain away.", careLightTitle: "Sunlight", careLightText: "Most indoor plants prefer bright, indirect light; protect leaves from harsh midday sun.", careRoutineTitle: "Everyday care", careRoutineText: "Use a pot with drainage, turn plants occasionally, and follow care notes for each variety.", faqTitle: "Frequently asked questions", faqDeliveryQuestion: "How is the delivery fee decided?", faqDeliveryAnswer: "It depends on product size. We’ll share a delivery price for your approval before payment.", faqPaymentQuestion: "Which payment methods are available?", faqPaymentAnswer: "Pay by FIB transfer with a receipt, or QiCard / Mastercard after agreeing to the delivery price.", faqPlantQuestion: "How often should I water my plant?", faqPlantAnswer: "It varies by plant and season. Check the soil first and water when the top layer is dry.", orderGiftYes: "Yes", "product_peat-moss": "Peat Moss", "notes_peat-moss": "A moisture-retaining growing medium for garden mixes.", "product_ornamental-olive": "Ornamental Olive", "notes_ornamental-olive": "A sun-loving ornamental olive for patios and bright spaces."
    },
    ar: {
      deliveryVaries: "تختلف رسوم التوصيل حسب حجم المنتج", categoryCare: "الأدوية والغذاء", categoryPeat: "بيتموس", categoryOlive: "زيتون زينة", categoryCareDisplay: "الأدوية والغذاء", categoryPeatDisplay: "بيتموس", categoryOliveDisplay: "زيتون زينة", myOrders: "طلباتي", ordersEyebrow: "رحلتك الخضراء", closeOrders: "إغلاق الطلبات", localOrderNotice: "تُحفظ طلبات هذا العرض التجريبي في هذا المتصفح.", noCustomerOrders: "لا توجد طلبات بعد.", quoteRequested: "تم طلب سعر التوصيل", requestDeliveryPrice: "اطلب سعر التوصيل", completePayment: "تابع إلى الدفع", continuePayment: "تابع إلى الدفع", deliveryPricePending: "سعر التوصيل قيد الانتظار", awaitingAgreement: "تم تحديد السعر · ننتظر موافقتك", awaitingPayment: "تمت الموافقة · الدفع مطلوب", deliveryPrice: "سعر التوصيل", adminSetPrice: "تحديد سعر التوصيل", saveDeliveryPrice: "تحديد السعر", agreePrice: "أوافق", priceAgreed: "تمت الموافقة على سعر التوصيل", priceSaved: "تم حفظ سعر التوصيل", priceInvalid: "أدخل سعر توصيل صحيحًا.", adminPasswordPrompt: "أدخل كلمة مرور الإدارة", adminPasswordIncorrect: "كلمة مرور الإدارة غير صحيحة.", orderStatus: "الحالة", paymentPending: "بانتظار الدفع", orderScheduled: "موعد التوصيل", orderGift: "هدية", greetingCard: "بطاقة تهنئة", deliveryDate: "تاريخ التوصيل", deliveryTime: "الفترة الزمنية", timeMorning: "صباحًا (9–12)", timeAfternoon: "ظهرًا (12–4)", timeEvening: "مساءً (4–8)", isGift: "هل هذه هدية؟", giftMessage: "رسالة بطاقة التهنئة", giftMessagePlaceholder: "اكتب رسالة للبطاقة...", chooseImage: "المعرض / الملفات", takePhoto: "استخدم الكاميرا", receiptCompressing: "جارٍ تجهيز صورة الإيصال…", receiptImageError: "اختر صورة صالحة.", youMightLike: "قد يعجبك أيضًا", viewDetails: "عرض التفاصيل", addToBag: "أضف إلى السلة", productDetails: "تفاصيل المنتج", careEyebrow: "العناية البسيطة تصنع فرقًا", careTitle: "نبات أسعد يبدأ من هنا.", careIntro: "إرشادات بسيطة لجذور وأوراق وأزهار صحية.", careWaterTitle: "الري", careWaterText: "تحقق من أول ٢–٣ سم من التربة. اسقِ عندما تجف واترك الماء الزائد يتصرف.", careLightTitle: "ضوء الشمس", careLightText: "تفضل معظم النباتات الداخلية الضوء الساطع غير المباشر؛ احمِ الأوراق من شمس الظهيرة القوية.", careRoutineTitle: "العناية اليومية", careRoutineText: "استخدم أصيصًا بفتحات تصريف، ودوّر النباتات أحيانًا، واتبع تعليمات كل نوع.", faqTitle: "الأسئلة الشائعة", faqDeliveryQuestion: "كيف يتم تحديد رسوم التوصيل؟", faqDeliveryAnswer: "تعتمد على حجم المنتج. سنرسل لك السعر للموافقة عليه قبل الدفع.", faqPaymentQuestion: "ما طرق الدفع المتاحة؟", faqPaymentAnswer: "الدفع عبر FIB مع رفع الإيصال، أو QiCard / Mastercard بعد الموافقة على سعر التوصيل.", faqPlantQuestion: "كم مرة أروي النبتة؟", faqPlantAnswer: "يختلف ذلك حسب نوع النبات والفصل. افحص التربة واسقِ عندما تجف الطبقة العلوية.", orderGiftYes: "نعم", "product_peat-moss": "بيتموس", "product_ornamental-olive": "زيتون زينة"
    },
    ckb: {
      deliveryVaries: "بەپێی قەبارەی بەرهەم دەگۆڕێ", categoryCare: "دەرمان و خۆراک", categoryPeat: "پیدمۆز", categoryOlive: "زەیتوونی زینە", categoryCareDisplay: "دەرمان و خۆراک", categoryPeatDisplay: "پیدمۆز", categoryOliveDisplay: "زەیتوونی زینە", myOrders: "داواکارییەکانم", ordersEyebrow: "گەشتی سەوزت", closeOrders: "داخستنی داواکارییەکان", localOrderNotice: "لەو نموونەیەدا داواکارییەکان لەم وێبگەڕەدا پاشەکەوت دەکرێن.", noCustomerOrders: "هێشتا داواکارییەک نییە.", quoteRequested: "نرخی گەیاندن داواکرا", requestDeliveryPrice: "داوای نرخی گەیاندن بکە", completePayment: "بەردەوام بە بۆ پارەدان", continuePayment: "بەردەوام بە بۆ پارەدان", deliveryPricePending: "نرخی گەیاندن چاوەڕێیە", awaitingAgreement: "نرخ دیاریکرا · چاوەڕێی ڕەزامەندیی تۆین", awaitingPayment: "ڕازیت · پارەدان پێویستە", deliveryPrice: "نرخی گەیاندن", adminSetPrice: "نرخی گەیاندن دابنێ", saveDeliveryPrice: "نرخ دابنێ", agreePrice: "ڕازیم", priceAgreed: "ڕەزامەندی لەسەر نرخی گەیاندن درا", priceSaved: "نرخی گەیاندن پاشەکەوت کرا", priceInvalid: "نرخێکی دروستی گەیاندن بنووسە.", adminPasswordPrompt: "وشەی نهێنیی بەڕێوەبەر بنووسە", adminPasswordIncorrect: "وشەی نهێنیی بەڕێوەبەر هەڵەیە.", orderStatus: "دۆخ", paymentPending: "چاوەڕێی پارەدان", orderScheduled: "کاتی گەیاندن", orderGift: "دیاری", greetingCard: "پەیامی کارتی پیرۆزبایی", deliveryDate: "بەرواری گەیاندن", deliveryTime: "کاتی گەیاندن", timeMorning: "بەیانی (٩–١٢)", timeAfternoon: "نیوەڕۆ (١٢–٤)", timeEvening: "ئێوارە (٤–٨)", isGift: "ئایا ئەمە دیارییە؟", giftMessage: "پەیامی کارتی پیرۆزبایی", giftMessagePlaceholder: "پەیامێک بۆ کارتەکە بنووسە...", chooseImage: "گەلەری / فایلەکان", takePhoto: "کامێرا بەکاربهێنە", receiptCompressing: "وێنەی پسووڵە ئامادە دەکرێت…", receiptImageError: "وێنەیەکی دروست هەڵبژێرە.", youMightLike: "لەوانەیە ئەمانەشت پێ خۆش بێت", viewDetails: "بینینی وردەکاری", addToBag: "زیادکردن بۆ سەبەتە", productDetails: "وردەکاریی بەرهەم", careEyebrow: "چاودێرییەکی کەم جیاوازییەکی زۆر دروست دەکات", careTitle: "ڕووەکێکی دڵخۆش لێرەوە دەست پێ دەکات.", careIntro: "ڕێنماییی سادە بۆ ڕەگ و گەڵا و گوڵی تەندروست.", careWaterTitle: "ئاودان", careWaterText: "٢–٣ سم لە سەرەوەی خاک بپشکنە. کاتێک وشک بوو ئاوی بدە و با ئاوی زیادە بڕوات.", careLightTitle: "ڕووناکی خۆر", careLightText: "زۆربەی ڕووەکی ناوماڵ ڕووناکیی زۆر و ناڕاستەوخۆیان پێ باشە؛ لە خۆری توندی نیوەڕۆ بیانپارێزە.", careRoutineTitle: "چاودێریی ڕۆژانە", careRoutineText: "گۆزەی کوندار بەکاربهێنە، جاروبار ڕووەکەکە بسووڕێنەوە و ڕێنماییی تایبەتی جۆرەکە جێبەجێ بکە.", faqTitle: "پرسیارە باوەکان", faqDeliveryQuestion: "کرێی گەیاندن چۆن دیاری دەکرێت؟", faqDeliveryAnswer: "بەپێی قەبارەی بەرهەمەکەیە. پێش پارەدان نرخێکت پێ دەڵێین تا ڕازی بیت.", faqPaymentQuestion: "کام شێوازی پارەدان بەردەستە؟", faqPaymentAnswer: "پارەدان بە FIB و بارکردنی پسووڵە، یان QiCard / Mastercard دوای ڕەزامەندی لەسەر نرخی گەیاندن.", faqPlantQuestion: "چەند جارێک ڕووەکەکەم ئاوی بدەم؟", faqPlantAnswer: "بەپێی جۆری ڕووەک و وەرز دەگۆڕێت. خاکەکە بپشکنە و کاتێک چینی سەرەوە وشک بوو ئاوی بدە.", orderGiftYes: "بەڵێ", "product_peat-moss": "پیدمۆز", "product_ornamental-olive": "زەیتوونی زینە"
    }
  };
  Object.assign(featureTranslations.en, { adminLoginTitle: "Admin sign in", adminPasswordLabel: "Admin password", adminLoginButton: "Open admin" });
  Object.assign(featureTranslations.ar, { adminLoginTitle: "تسجيل دخول الإدارة", adminPasswordLabel: "كلمة مرور الإدارة", adminLoginButton: "فتح لوحة الإدارة" });
  Object.assign(featureTranslations.ckb, { adminLoginTitle: "چوونەژوورەوەی بەڕێوەبەر", adminPasswordLabel: "وشەی نهێنیی بەڕێوەبەر", adminLoginButton: "کردنەوەی پانێڵ" });
  Object.assign(featureTranslations.en, { receiptHint: "required · JPG, PNG, WebP or camera image" });
  Object.assign(featureTranslations.ar, { receiptHint: "مطلوب · JPG أو PNG أو WebP أو صورة من الكاميرا" });
  Object.assign(featureTranslations.ckb, { receiptHint: "پێویستە · JPG یان PNG یان WebP یان وێنەی کامێرا" });
  Object.assign(featureTranslations.en, { paymentAccountLabel: "Send payment to this number", fibPaymentHint: "Complete the transfer in FIB, then upload your receipt.", qiCardPaymentHint: "Complete payment with QiCard to this number. Your order will be verified manually.", paymentNumberLabel: "FIB / Qi Card payment number", paymentNumberCopied: "Payment number copied" });
  Object.assign(featureTranslations.ar, { paymentAccountLabel: "حوّل المبلغ إلى هذا الرقم", fibPaymentHint: "أكمل التحويل عبر FIB ثم ارفع الإيصال.", qiCardPaymentHint: "أكمل الدفع عبر QiCard إلى هذا الرقم. سيتم التحقق من طلبك يدويًا.", paymentNumberLabel: "رقم الدفع لـ FIB وQi Card", paymentNumberCopied: "تم نسخ رقم الدفع" });
  Object.assign(featureTranslations.ckb, { paymentAccountLabel: "پارە بۆ ئەم ژمارەیە بنێرە", fibPaymentHint: "گواستنەوەکە لە FIB تەواو بکە و پاشان پسووڵەکە باربکە.", qiCardPaymentHint: "پارەدان بە QiCard بۆ ئەم ژمارەیە تەواو بکە. داواکارییەکەت بە دەستی پشتڕاست دەکرێتەوە.", paymentNumberLabel: "ژمارەی پارەدان بۆ FIB و Qi Card", paymentNumberCopied: "ژمارەی پارەدان لەبەرگیرا" });
  Object.assign(featureTranslations.en, { paymentCardHint: "Pay to the displayed number using QiCard / Mastercard." });
  Object.assign(featureTranslations.ar, { paymentCardHint: "أرسل المبلغ إلى الرقم الظاهر باستخدام QiCard أو Mastercard." });
  Object.assign(featureTranslations.ckb, { paymentCardHint: "بە QiCard یان Mastercard پارە بۆ ژمارەی پیشاندراو بنێرە." });
  Object.assign(featureTranslations.en, { installTitle: "Take Gulnar with you", installReady: "Install Gulnar for quick access on this device.", installAndroidHelp: "Open your browser menu and choose Install app or Add to Home screen.", installIOSHelp: "Tap Share, then choose Add to Home Screen.", installIOSOpenSafari: "Not in Safari? Open this link in Safari, then tap Share → Add to Home Screen.", installDesktopHelp: "Use your browser’s install option to add Gulnar to your desktop.", installAction: "Install", installDismiss: "Not now", installFailed: "Gulnar could not be installed. Try your browser’s install menu." });
  Object.assign(featureTranslations.ar, { installTitle: "اصطحب جولنار معك", installReady: "ثبّت جولنار للوصول السريع من هذا الجهاز.", installAndroidHelp: "افتح قائمة المتصفح واختر تثبيت التطبيق أو الإضافة إلى الشاشة الرئيسية.", installIOSHelp: "اضغط على زر المشاركة ثم اختر «إضافة إلى الشاشة الرئيسية».", installIOSOpenSafari: "لست في Safari؟ افتح هذا الرابط في Safari، ثم اضغط على مشاركة ← إضافة إلى الشاشة الرئيسية.", installDesktopHelp: "استخدم خيار التثبيت في المتصفح لإضافة جولنار إلى سطح المكتب.", installAction: "تثبيت", installDismiss: "ليس الآن", installFailed: "تعذر تثبيت جولنار. جرّب قائمة التثبيت في المتصفح." });
  Object.assign(featureTranslations.ckb, { installTitle: "گوڵنار لەگەڵ خۆت ببە", installReady: "گوڵنار دابمەزرێنە بۆ دەستگەیشتنی خێرا لەم ئامێرە.", installAndroidHelp: "لیستی وێبگەڕەکەت بکەرەوە و دامەزراندن یان زیادکردن بۆ شاشەی سەرەتا هەڵبژێرە.", installIOSHelp: "دوگمەی هاوبەشکردن بکە و زیادکردن بۆ شاشەی سەرەتا هەڵبژێرە.", installIOSOpenSafari: "لە Safari نیت؟ ئەم لینکە لە Safari بکەرەوە، پاشان Share بکە و Add to Home Screen هەڵبژێرە.", installDesktopHelp: "لە لیستی وێبگەڕەکەتدا هەڵبژاردەی دامەزراندن بەکاربهێنە بۆ زیادکردنی گوڵنار بۆ سەر مێز.", installAction: "دامەزراندن", installDismiss: "ئێستا نا", installFailed: "دامەزراندنی گوڵنار سەرکەوتوو نەبوو. لیستی دامەزراندنی وێبگەڕەکەت تاقی بکەرەوە." });
  Object.assign(featureTranslations.en, { refreshApp: "Refresh", refreshingApp: "Refreshing…", refreshFailed: "Unable to refresh right now. Please try again." });
  Object.assign(featureTranslations.ar, { refreshApp: "تحديث", refreshingApp: "جارٍ التحديث…", refreshFailed: "تعذر التحديث الآن. يرجى المحاولة مرة أخرى." });
  Object.assign(featureTranslations.ckb, { refreshApp: "نوێکردنەوە", refreshingApp: "نوێ دەکرێتەوە...", refreshFailed: "ئێستا نوێکردنەوە سەرکەوتوو نەبوو. تکایە دووبارە هەوڵ بدەرەوە." });
  Object.assign(featureTranslations.en, { backToShop: "Back to shop" });
  Object.assign(featureTranslations.ar, { backToShop: "العودة إلى المتجر" });
  Object.assign(featureTranslations.ckb, { backToShop: "گەڕانەوە بۆ فرۆشگا" });
  const readStore = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      console.error(`Unable to read ${key} from local storage.`, error);
      return fallback;
    }
  };
  const saveStore = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Unable to save ${key} to local storage.`, error);
      showToast(t("noStorage"));
      return false;
    }
  };

  let products = readStore(STORAGE.products, null) || seedProducts.map(product => ({ ...product }));
  let cart = readStore(STORAGE.cart, []);
  let orders = readStore(STORAGE.orders, []);
  let settings = { discount: 0, fibAccount: FIB_DEFAULT, ...readStore(STORAGE.settings, {}) };
  if (settings.fibAccount === FIB_LEGACY_DEFAULT) settings.fibAccount = FIB_DEFAULT;
  delete settings.deliveryFee;
  products = products.map(product => ({
    ...product,
    category: product.category === "Chemical Medicines/Fertilizers" ? "Medicines & Food" : product.category
  }));
  let activeQuoteId = readStore("verdant.activeQuote", "");
  let activeCategory = "All";
  let cloudCatalogReady = false;
  let realtimeSubscribed = false;
  let cloudRefreshGeneration = 0;
  let isSupabaseAdmin = false;
  let currentAdminUser = null;
  let adminProfile = { fullName: "", title: "", avatarUrl: "", phone: "", notes: "" };
  let adminPublicProfiles = {};
  let adminActivities = readStore("verdant.adminActivity", []);
  let deferredInstallPrompt = window.__gulnarInstallPrompt || null;
  window.__gulnarInstallPrompt = null;
  let installPromptDismissed = false;
  let appInstalled = false;
  let serviceWorkerReloading = false;
  const userAgent = navigator.userAgent;
  const isIOSDevice = /iphone|ipad|ipod/i.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isIOSSafari = isIOSDevice
    && /version\/[\d.]+/i.test(userAgent)
    && /safari\//i.test(userAgent)
    && !/(crios|fxios|edgios|opios|brave|duckduckgo|fban|fbav|fbios|instagram|telegram|tiktok|twitter|whatsapp|line\/|micromessenger|snapchat|linkedinapp|pinterest)/i.test(userAgent);
  const isAndroidDevice = /android/i.test(navigator.userAgent);
  let pendingProductImages = [];
  let pendingProductVideo = null;
  let catalogStatusKey = supabaseSettingsPresent ? "catalogSyncing" : "catalogLocalMode";
  let catalogStatusValues = {};
  let receiptData = "";
  let receiptFileName = "";
  let lastOrderPayment = "FIB";
  let lastOrderId = "";
  let toastTimer;
  let language = readStore(LANGUAGE_STORAGE, "en");
  if (!Object.prototype.hasOwnProperty.call(languageMeta, language)) language = "en";

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const t = (key, values = {}) => {
    const text = featureTranslations[language]?.[key] || translations[language][key] || chatbotTranslations[language][key] || featureTranslations.en[key] || translations.en[key] || chatbotTranslations.en[key] || key;
    return text.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
  };
  const chatPanel = $("#plant-chat-panel");
  const chatToggle = $("#plant-chat-toggle");
  const syncChatToggle = () => {
    const isOpen = !chatPanel.hidden;
    chatToggle.setAttribute("aria-expanded", String(isOpen));
    chatToggle.setAttribute("aria-label", t(isOpen ? "chatClose" : "chatOpen"));
  };
  const setChatOpen = isOpen => {
    chatPanel.hidden = !isOpen;
    syncChatToggle();
    if (isOpen) $("#plant-chat-input").focus();
    else chatToggle.focus();
  };
  const formatNumber = amount => new Intl.NumberFormat(languageMeta[language].locale, { maximumFractionDigits: 1 }).format(Number(amount) || 0);
  const formatMoney = amount => `${new Intl.NumberFormat(languageMeta[language].locale, { maximumFractionDigits: 0 }).format(Math.round(Number(amount) || 0))} ${t("currency")}`;
  const formatUsd = amount => `$${new Intl.NumberFormat(languageMeta[language].locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(amount) || 0)}`;
  const formatDualMoney = (iqd, usd) => [Number(iqd) > 0 ? formatMoney(iqd) : "", Number(usd) > 0 ? formatUsd(usd) : ""].filter(Boolean).join(" · ") || "—";
  const discountedPrice = product => Math.round(product.retail * (1 - settings.discount / 100));
  const discountedPriceUsd = product => Math.round((Number(product.retailUsd) || 0) * (1 - settings.discount / 100) * 100) / 100;
  const productPrice = product => formatDualMoney(discountedPrice(product), discountedPriceUsd(product));
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const categoryLabel = category => ({
    "Indoor Plants": t("categoryIndoorDisplay"),
    "Outdoor Plants": t("categoryOutdoorDisplay"),
    "Medicines & Food": t("categoryCareDisplay"),
    "Peat Moss": t("categoryPeatDisplay"),
    "Ornamental Olive": t("categoryOliveDisplay"),
    "Agricultural Tools": t("categoryToolsDisplay")
  })[category] || category;
  const localizedProductText = (product, field) => {
    const property = field === "product" ? "name" : "notes";
    const original = seedProducts.find(seed => seed.id === product.id);
    if (original && product[property] !== original[property]) return product[property];
    return featureTranslations[language]?.[`${field}_${product.id}`] || translations[language][`${field}_${product.id}`] || product[property];
  };
  const productById = id => products.find(product => product.id === id);
  const saveProducts = () => saveStore(STORAGE.products, products);
  const saveCart = () => saveStore(STORAGE.cart, cart);
  const saveOrders = () => saveStore(STORAGE.orders, orders);
  const saveSettings = () => saveStore(STORAGE.settings, settings);

  Object.assign(featureTranslations.en, {
    categoryTools: "Agricultural Tools", categoryToolsDisplay: "Agricultural Tools",
    catalogLocalMode: "Local demo mode: products are saved in this browser.", catalogSyncing: "Connecting to the shared product catalog…", catalogConnected: "Product catalog is connected and updates live.", catalogConfigMissing: "Supabase settings are incomplete or its client library failed to load. Product changes are disabled.", catalogUnavailable: "The shared product catalog is unavailable. Try again after reconnecting.", catalogSyncError: "Catalog sync failed: {detail}",
    adminNoticeLocal: "Demo admin panel · changes are saved in this browser only.", adminNoticeCloud: "Products are shared across devices. Orders remain local to this browser.", adminEmailLabel: "Admin email", adminLoginFailure: "Could not sign in: {detail}", adminNotAuthorized: "This account is not authorized to manage products.", adminConfigError: "Supabase is not configured. See SUPABASE_SETUP.md.", adminSignOut: "Sign out", adminSignedOut: "Signed out.", adminSignOutError: "Could not sign out: {detail}",
    imageRequired: "Add an image URL or choose a photo.", imageUrlInvalid: "Enter a valid image URL or choose a photo.", imageCompressing: "Compressing image…", imageReady: "Image ready (compressed)", imageCurrent: "Current product image", productImagePreview: "Product image preview", productImageError: "Could not read or compress this image.", productSaveError: "Could not save product: {detail}", productDeleteError: "Could not delete product: {detail}", productImageCleanupError: "The catalog update succeeded, but unused product media could not be removed."
  });
  Object.assign(featureTranslations.ar, {
    categoryTools: "الأدوات الزراعية", categoryToolsDisplay: "الأدوات الزراعية",
    catalogLocalMode: "وضع تجريبي محلي: تُحفظ المنتجات في هذا المتصفح.", catalogSyncing: "جارٍ الاتصال بكتالوج المنتجات المشترك…", catalogConnected: "كتالوج المنتجات متصل والتحديثات مباشرة.", catalogConfigMissing: "إعدادات Supabase غير مكتملة أو تعذر تحميل مكتبته. تم تعطيل تغييرات المنتجات.", catalogUnavailable: "كتالوج المنتجات المشترك غير متاح. حاول مجددًا بعد إعادة الاتصال.", catalogSyncError: "فشل مزامنة الكتالوج: {detail}",
    adminNoticeLocal: "لوحة تجريبية · تُحفظ التغييرات في هذا المتصفح فقط.", adminNoticeCloud: "المنتجات مشتركة بين الأجهزة. تبقى الطلبات محلية في هذا المتصفح.", adminEmailLabel: "البريد الإلكتروني للإدارة", adminLoginFailure: "تعذر تسجيل الدخول: {detail}", adminNotAuthorized: "هذا الحساب غير مصرح له بإدارة المنتجات.", adminConfigError: "لم يتم إعداد Supabase. راجع SUPABASE_SETUP.md.", adminSignOut: "تسجيل الخروج", adminSignedOut: "تم تسجيل الخروج.", adminSignOutError: "تعذر تسجيل الخروج: {detail}",
    imageRequired: "أضف رابط صورة أو اختر صورة.", imageUrlInvalid: "أدخل رابط صورة صحيحًا أو اختر صورة.", imageCompressing: "جارٍ ضغط الصورة…", imageReady: "الصورة جاهزة (مضغوطة)", imageCurrent: "صورة المنتج الحالية", productImagePreview: "معاينة صورة المنتج", productImageError: "تعذرت قراءة الصورة أو ضغطها.", productSaveError: "تعذر حفظ المنتج: {detail}", productDeleteError: "تعذر حذف المنتج: {detail}", productImageCleanupError: "نجح تحديث الكتالوج، لكن تعذرت إزالة وسائط منتج لم تعد مستخدمة."
  });
  Object.assign(featureTranslations.ckb, {
    categoryTools: "کەرەستەکانی کشتوکاڵ", categoryToolsDisplay: "کەرەستەکانی کشتوکاڵ",
    catalogLocalMode: "دۆخی نموونەییی ناوخۆیی: بەرهەمەکان لەم وێبگەڕەدا پاشەکەوت دەکرێن.", catalogSyncing: "پەیوەندی بە کەتەلۆگی هاوبەشی بەرهەمەکانەوە دەکرێت…", catalogConnected: "کەتەلۆگی بەرهەمەکان پەیوەستە و نوێکارییەکان ڕاستەوخۆن.", catalogConfigMissing: "ڕێکخستنەکانی Supabase تەواو نین یان کتێبخانەکەی بار نەکرا. گۆڕانکاریی بەرهەمەکان ناچالاک کراوە.", catalogUnavailable: "کەتەلۆگی هاوبەشی بەرهەمەکان بەردەست نییە. دوای پەیوەندییەوە هەوڵ بدەرەوە.", catalogSyncError: "هاوکاتکردنی کەتەلۆگ سەرکەوتوو نەبوو: {detail}",
    adminNoticeLocal: "پانێڵی نموونەیی · گۆڕانکارییەکان تەنها لەم وێبگەڕەدا پاشەکەوت دەکرێن.", adminNoticeCloud: "بەرهەمەکان لە نێوان ئامێرەکاندا هاوبەشن. داواکارییەکان لەم وێبگەڕەدا دەمێننەوە.", adminEmailLabel: "ئیمەیڵی بەڕێوەبەر", adminLoginFailure: "چوونەژوورەوە سەرکەوتوو نەبوو: {detail}", adminNotAuthorized: "ئەم هەژمارە مۆڵەتی بەڕێوەبردنی بەرهەمەکانی نییە.", adminConfigError: "Supabase ڕێک نەخراوە. SUPABASE_SETUP.md ببینە.", adminSignOut: "چوونەدەرەوە", adminSignedOut: "چوونەدەرەوە سەرکەوتوو بوو.", adminSignOutError: "چوونەدەرەوە سەرکەوتوو نەبوو: {detail}",
    imageRequired: "لینکی وێنە دابنێ یان وێنەیەک هەڵبژێرە.", imageUrlInvalid: "لینکێکی دروستی وێنە بنووسە یان وێنەیەک هەڵبژێرە.", imageCompressing: "وێنەکە پەستاندەکرێت…", imageReady: "وێنە ئامادەیە (پەستاندراو)", imageCurrent: "وێنەی ئێستای بەرهەم", productImagePreview: "پێشبینینی وێنەی بەرهەم", productImageError: "خوێندنەوە یان پەستاندنی وێنەکە سەرکەوتوو نەبوو.", productSaveError: "پاشەکەوتکردنی بەرهەم سەرکەوتوو نەبوو: {detail}", productDeleteError: "سڕینەوەی بەرهەم سەرکەوتوو نەبوو: {detail}", productImageCleanupError: "نوێکردنەوەی کەتەلۆگ سەرکەوتوو بوو، بەڵام میدیای بەکارنەهاتووی بەرهەم نەسڕایەوە."
  });
  Object.assign(featureTranslations.en, {
    imageUrls: "Image URLs (one per line, optional)", productVideo: "Product video URL (optional)", uploadVideo: "Upload video",
    wholesaleUsd: "Wholesale price (USD)", retailUsd: "Retail price (USD)", creator: "Added by",
    adminProfile: "Profile", adminActivity: "Activity", profileEyebrow: "YOUR ADMIN IDENTITY", activityEyebrow: "A RECORD OF CHANGES",
    fullName: "Full name", displayTitle: "Display title / role", avatarUrl: "Avatar photo URL", adminNotes: "Private notes", saveProfile: "Save profile",
    profileSaved: "Admin profile saved", activityEmpty: "No admin activity yet.", activityLoadError: "Could not load admin activity: {detail}",
    activityProductAdded: "Added product", activityProductEdited: "Edited product", activityProductDeleted: "Deleted product",
    activityOrderUpdated: "Updated order", activityProfileUpdated: "Updated profile", orderPrint: "Print",
    videoUploadError: "Could not upload the video: {detail}", videoUrlInvalid: "Enter a valid video URL or choose a video file.",
    productMediaError: "Could not save product media: {detail}", imageUrlInvalid: "Enter valid image URLs or choose photos.",
    profileSaveError: "Could not save admin profile: {detail}", orderSaveError: "Could not save order: {detail}",
    deletedBy: "Deleted by", orderCreated: "Created", retailRequired: "Enter a retail price in IQD or USD."
  });
  Object.assign(featureTranslations.ar, {
    imageUrls: "روابط الصور (رابط في كل سطر، اختياري)", productVideo: "رابط فيديو المنتج (اختياري)", uploadVideo: "رفع فيديو",
    wholesaleUsd: "سعر الجملة (دولار)", retailUsd: "سعر البيع (دولار)", creator: "أُضيف بواسطة",
    adminProfile: "الملف الشخصي", adminActivity: "النشاط", profileEyebrow: "هوية المسؤول", activityEyebrow: "سجل التغييرات",
    fullName: "الاسم الكامل", displayTitle: "المسمى / الدور", avatarUrl: "رابط الصورة الشخصية", adminNotes: "ملاحظات خاصة", saveProfile: "حفظ الملف",
    profileSaved: "تم حفظ ملف المسؤول", activityEmpty: "لا يوجد نشاط بعد.", activityLoadError: "تعذر تحميل النشاط: {detail}",
    activityProductAdded: "أضاف منتجًا", activityProductEdited: "عدّل منتجًا", activityProductDeleted: "حذف منتجًا",
    activityOrderUpdated: "حدّث طلبًا", activityProfileUpdated: "حدّث الملف الشخصي", orderPrint: "طباعة",
    videoUploadError: "تعذر رفع الفيديو: {detail}", videoUrlInvalid: "أدخل رابط فيديو صحيحًا أو اختر ملف فيديو.",
    productMediaError: "تعذر حفظ وسائط المنتج: {detail}", imageUrlInvalid: "أدخل روابط صور صحيحة أو اختر صورًا.",
    profileSaveError: "تعذر حفظ ملف المسؤول: {detail}", orderSaveError: "تعذر حفظ الطلب: {detail}",
    deletedBy: "حُذف بواسطة", orderCreated: "أُنشئ", retailRequired: "أدخل سعر بيع بالدينار أو الدولار."
  });
  Object.assign(featureTranslations.ckb, {
    imageUrls: "بەستەری وێنەکان (هەر بەستەرێک لە هێڵێکدا، ئارەزوومەندانە)", productVideo: "بەستەری ڤیدیۆی بەرهەم (ئارەزوومەندانە)", uploadVideo: "بارکردنی ڤیدیۆ",
    wholesaleUsd: "نرخی کۆ (دۆلار)", retailUsd: "نرخی فرۆشتن (دۆلار)", creator: "زیادی کردووە",
    adminProfile: "پرۆفایل", adminActivity: "چالاکی", profileEyebrow: "ناسنامەی بەڕێوەبەر", activityEyebrow: "تۆماری گۆڕانکارییەکان",
    fullName: "ناوی تەواو", displayTitle: "ناونیشان / ڕۆڵ", avatarUrl: "بەستەری وێنەی پرۆفایل", adminNotes: "تێبینی تایبەت", saveProfile: "پاشەکەوتکردنی پرۆفایل",
    profileSaved: "پرۆفایلی بەڕێوەبەر پاشەکەوت کرا", activityEmpty: "هێشتا چالاکی نییە.", activityLoadError: "بارکردنی چالاکی سەرکەوتوو نەبوو: {detail}",
    activityProductAdded: "بەرهەمێکی زیاد کرد", activityProductEdited: "بەرهەمێکی دەستکاری کرد", activityProductDeleted: "بەرهەمێکی سڕییەوە",
    activityOrderUpdated: "داواکارییەکی نوێ کردەوە", activityProfileUpdated: "پرۆفایلەکەی نوێ کردەوە", orderPrint: "چاپکردن",
    videoUploadError: "بارکردنی ڤیدیۆ سەرکەوتوو نەبوو: {detail}", videoUrlInvalid: "بەستەری ڤیدیۆی دروست بنووسە یان فایلێکی ڤیدیۆ هەڵبژێرە.",
    productMediaError: "پاشەکەوتکردنی میدیای بەرهەم سەرکەوتوو نەبوو: {detail}", imageUrlInvalid: "بەستەری وێنەی دروست بنووسە یان وێنە هەڵبژێرە.",
    profileSaveError: "پاشەکەوتکردنی پرۆفایل سەرکەوتوو نەبوو: {detail}", orderSaveError: "پاشەکەوتکردنی داواکاری سەرکەوتوو نەبوو: {detail}",
    deletedBy: "سڕایەوە لەلایەن", orderCreated: "دروستکرا", retailRequired: "نرخی فرۆشتن بە دینار یان دۆلار بنووسە."
  });

  const rowToProduct = row => ({
    id: row.id,
    name: row.name,
    category: row.category,
    image: row.image,
    imagePath: row.image_path || "",
    images: Array.isArray(row.images) && row.images.length ? row.images : [{ url: row.image, path: row.image_path || "" }],
    videoUrl: row.video_url || "",
    videoPath: row.video_path || "",
    wholesale: Number(row.wholesale),
    retail: Number(row.retail),
    wholesaleUsd: Number(row.wholesale_usd) || 0,
    retailUsd: Number(row.retail_usd) || 0,
    stock: Number(row.stock),
    notes: row.notes || "",
    createdBy: row.created_by || ""
  });
  const productToRow = product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
    image_path: product.imagePath || null,
    images: product.images || [{ url: product.image, path: product.imagePath || "" }],
    video_url: product.videoUrl || "",
    video_path: product.videoPath || null,
    wholesale: product.wholesale,
    retail: product.retail,
    wholesale_usd: product.wholesaleUsd || 0,
    retail_usd: product.retailUsd || 0,
    stock: product.stock,
    notes: product.notes,
    created_by: product.createdBy || null,
    updated_at: new Date().toISOString()
  });

  const rowToOrder = row => {
    const createdAt = row.created_at || new Date().toISOString();
    return {
      id: row.id,
      createdAt,
      date: new Intl.DateTimeFormat(languageMeta[language].locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(createdAt)),
      name: row.customer_name,
      phone: row.customer_phone,
      address: row.customer_address,
      instruction: row.instruction || "",
      deliveryDate: row.delivery_date || "",
      deliveryTime: row.delivery_time || "",
      isGift: Boolean(row.is_gift),
      giftMessage: row.gift_message || "",
      notes: row.notes || "",
      payment: row.payment || "",
      card: row.card || "",
      receipt: row.receipt || "",
      customerToken: row.customer_token || "",
      items: Array.isArray(row.items) ? row.items : [],
      subtotal: Number(row.subtotal_iqd) || 0,
      subtotalUsd: Number(row.subtotal_usd) || 0,
      deliveryFee: row.delivery_fee_iqd == null ? null : Number(row.delivery_fee_iqd) || 0,
      deliveryFeeUsd: row.delivery_fee_usd == null ? null : Number(row.delivery_fee_usd) || 0,
      total: row.total_iqd == null ? null : Number(row.total_iqd) || 0,
      totalUsd: row.total_usd == null ? null : Number(row.total_usd) || 0,
      agreed: Boolean(row.agreed),
      status: row.status || "Pending"
    };
  };
  const orderToRow = order => ({
    id: order.id,
    created_at: order.createdAt || new Date().toISOString(),
    customer_name: order.name,
    customer_phone: order.phone,
    customer_address: order.address,
    instruction: order.instruction || "",
    delivery_date: order.deliveryDate || null,
    delivery_time: order.deliveryTime || "",
    is_gift: Boolean(order.isGift),
    gift_message: order.giftMessage || "",
    notes: order.notes || "",
    payment: order.payment || "",
    card: order.card || "",
    receipt: order.receipt || "",
    customer_token: order.customerToken || "",
    items: order.items || [],
    subtotal_iqd: order.subtotal || 0,
    subtotal_usd: order.subtotalUsd || 0,
    delivery_fee_iqd: order.deliveryFee,
    delivery_fee_usd: order.deliveryFeeUsd ?? null,
    total_iqd: order.total,
    total_usd: order.totalUsd ?? null,
    agreed: Boolean(order.agreed),
    status: order.status,
    updated_at: new Date().toISOString()
  });

  function adminDisplayName() {
    return adminProfile.fullName || currentAdminUser?.email || "Shop admin";
  }

  function renderAdminIdentity() {
    $("#admin-display-name").textContent = adminDisplayName();
    $("#admin-display-title").textContent = adminProfile.title || (supabaseSettingsPresent ? currentAdminUser?.email || "" : "Store administrator");
    const avatar = $("#admin-avatar");
    if (adminProfile.avatarUrl) {
      avatar.src = adminProfile.avatarUrl;
      avatar.hidden = false;
    } else {
      avatar.removeAttribute("src");
      avatar.hidden = true;
    }
  }

  async function loadAdminProfile() {
    if (supabaseSettingsPresent && currentAdminUser) {
      const { data, error } = await supabaseClient.from("admin_profiles")
        .select("user_id,full_name,title,avatar_url,phone,notes")
        .eq("user_id", currentAdminUser.id)
        .maybeSingle();
      if (error) throw error;
      adminProfile = data ? {
        fullName: data.full_name || "",
        title: data.title || "",
        avatarUrl: data.avatar_url || "",
        phone: data.phone || "",
        notes: data.notes || ""
      } : {
        fullName: currentAdminUser.user_metadata?.full_name || currentAdminUser.email || "",
        title: "Administrator",
        avatarUrl: "",
        phone: "",
        notes: ""
      };
    } else {
      adminProfile = readStore("verdant.adminProfile", { fullName: "Shop administrator", title: "Store administrator", avatarUrl: "", phone: "", notes: "" });
    }
    const form = $("#admin-profile-form");
    form.elements.fullName.value = adminProfile.fullName;
    form.elements.title.value = adminProfile.title;
    form.elements.avatarUrl.value = adminProfile.avatarUrl;
    form.elements.phone.value = adminProfile.phone;
    form.elements.notes.value = adminProfile.notes;
    if (currentAdminUser) {
      adminPublicProfiles[currentAdminUser.id] = {
        user_id: currentAdminUser.id,
        full_name: adminProfile.fullName,
        title: adminProfile.title,
        avatar_url: adminProfile.avatarUrl
      };
    }
    renderAdminIdentity();
  }

  async function refreshAdminProfiles() {
    const ids = [...new Set(products.map(product => product.createdBy).filter(Boolean))];
    if (!ids.length || !supabaseClient) {
      adminPublicProfiles = {};
      return;
    }
    const { data, error } = await supabaseClient.from("admin_public_profiles")
      .select("user_id,full_name,title,avatar_url")
      .in("user_id", ids);
    if (error) throw error;
    adminPublicProfiles = {
      ...adminPublicProfiles,
      ...Object.fromEntries((data || []).map(profile => [profile.user_id, profile]))
    };
  }

  async function persistOrder(order, isNew = false) {
    if (!supabaseSettingsPresent) return;
    if (!supabaseClient) throw new Error(t("catalogUnavailable"));
    const query = supabaseClient.from("orders");
    const response = isNew
      ? await query.insert(orderToRow(order))
      : await query.update(orderToRow(order)).eq("id", order.id);
    if (response.error) throw response.error;
  }

  async function persistCustomerOrderAction(order, action) {
    if (!supabaseSettingsPresent) return;
    if (!supabaseClient || !order.customerToken) throw new Error(t("catalogUnavailable"));
    const rpc = action === "agree" ? "customer_agree_to_order" : "customer_complete_order";
    const args = action === "agree" ? {
      p_order_id: order.id,
      p_access_token: order.customerToken
    } : {
      p_order_id: order.id,
      p_access_token: order.customerToken,
      p_payment: order.payment,
      p_card: order.card || "",
      p_receipt: order.receipt || ""
    };
    const { data, error } = await supabaseClient.rpc(rpc, args);
    if (error) throw error;
    if (data !== true) throw new Error("Order could not be updated. Refresh and try again.");
  }

  async function refreshCloudOrders() {
    if (!supabaseClient || !isSupabaseAdmin) return;
    const { data, error } = await supabaseClient.from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const cloudOrders = (data || []).map(rowToOrder);
    const cloudIds = new Set(cloudOrders.map(order => order.id));
    orders = [...cloudOrders, ...orders.filter(order => !cloudIds.has(order.id))];
    saveOrders();
    renderOrders();
    renderCustomerOrders();
  }

  async function recordAdminActivity(action, targetType, targetId, targetName, details = {}) {
    const entry = {
      adminId: currentAdminUser?.id || "",
      adminName: adminDisplayName(),
      action,
      targetType,
      targetId: String(targetId || ""),
      targetName: String(targetName || ""),
      details,
      createdAt: new Date().toISOString()
    };
    adminActivities.unshift(entry);
    adminActivities = adminActivities.slice(0, 100);
    saveStore("verdant.adminActivity", adminActivities);
    renderAdminActivity();
    if (supabaseSettingsPresent && supabaseClient && isSupabaseAdmin) {
      try {
        const { error } = await supabaseClient.from("admin_activity").insert({
          admin_id: entry.adminId || null,
          admin_name: entry.adminName,
          action: entry.action,
          target_type: entry.targetType,
          target_id: entry.targetId,
          target_name: entry.targetName,
          details: entry.details
        });
        if (error) throw error;
      } catch (error) {
        console.error("Unable to record admin activity.", error);
        showToast(t("activityLoadError", { detail: error.message }));
      }
    }
  }

  async function refreshAdminActivity() {
    if (!supabaseSettingsPresent || !supabaseClient || !isSupabaseAdmin) {
      adminActivities = readStore("verdant.adminActivity", []);
      renderAdminActivity();
      return;
    }
    const { data, error } = await supabaseClient.from("admin_activity").select("*").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    adminActivities = (data || []).map(row => ({
      adminId: row.admin_id || "",
      adminName: row.admin_name,
      action: row.action,
      targetType: row.target_type,
      targetId: row.target_id,
      targetName: row.target_name,
      details: row.details || {},
      createdAt: row.created_at
    }));
    renderAdminActivity();
  }

  function renderAdminActivity() {
    $("#activity-list").innerHTML = adminActivities.length ? adminActivities.map(item => `<article class="activity-row">
      <strong>${escapeHtml(item.adminName)}</strong><span>${escapeHtml(t(item.action) === item.action ? item.action : t(item.action))}</span>
      <span>${escapeHtml(item.targetName || item.targetType)}${item.targetId ? ` · ${escapeHtml(item.targetId)}` : ""}</span>
      <time datetime="${escapeHtml(item.createdAt)}">${escapeHtml(new Intl.DateTimeFormat(languageMeta[language].locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.createdAt)))}</time>
    </article>`).join("") : `<div class="empty-admin">${t("activityEmpty")}</div>`;
  }

  async function refreshCloudProducts() {
    if (!supabaseClient) return true;
    const requestGeneration = ++cloudRefreshGeneration;
    let response;
    try {
      response = await supabaseClient.from("products").select("*").order("name");
    } catch (error) {
      if (requestGeneration !== cloudRefreshGeneration) return true;
      cloudCatalogReady = false;
      console.error("Unable to load products from Supabase.", error);
      setCatalogStatus("catalogSyncError", { detail: error.message });
      return false;
    }
    if (requestGeneration !== cloudRefreshGeneration) return true;
    const { data, error } = response;
    if (error) {
      cloudCatalogReady = false;
      console.error("Unable to load products from Supabase.", error);
      setCatalogStatus("catalogSyncError", { detail: error.message });
      return false;
    }
    if (!Array.isArray(data)) {
      cloudCatalogReady = false;
      const error = new Error("Supabase returned an invalid product list.");
      console.error("Unable to load products from Supabase.", error);
      setCatalogStatus("catalogSyncError", { detail: error.message });
      return false;
    }
    products = data.map(rowToProduct);
    try {
      await refreshAdminProfiles();
    } catch (error) {
      console.error("Unable to load public admin profiles.", error);
    }
    cloudCatalogReady = true;
    saveProducts();
    renderProducts();
    renderCart();
    renderAdminProducts();
    setCatalogStatus(realtimeSubscribed ? "catalogConnected" : "catalogSyncing");
    return true;
  }

  async function restoreAdminSession() {
    let response;
    try {
      response = await supabaseClient.auth.getSession();
    } catch (error) {
      console.error("Unable to restore the Supabase session.", error);
      return;
    }
    const { data, error } = response;
    if (error) {
      console.error("Unable to restore the Supabase session.", error);
      return;
    }
    if (!data.session) return;
    currentAdminUser = data.session.user;
    let membershipResponse;
    try {
      membershipResponse = await supabaseClient
        .from("product_admins")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();
    } catch (membershipError) {
      console.error("Unable to check the product admin membership.", membershipError);
      return;
    }
    const { data: membership, error: membershipError } = membershipResponse;
    if (membershipError) {
      console.error("Unable to check the product admin membership.", membershipError);
      return;
    }
    isSupabaseAdmin = Boolean(membership);
    if (isSupabaseAdmin) {
      try {
        await loadAdminProfile();
      } catch (error) {
        console.error("Unable to load the restored admin profile.", error);
      }
    } else {
      currentAdminUser = null;
    }
  }

  async function initializeCatalogSync() {
    if (!supabaseSettingsPresent) {
      setCatalogStatus("catalogLocalMode");
      window.addEventListener("storage", event => {
        if (event.key !== STORAGE.products) return;
        try {
          products = event.newValue ? JSON.parse(event.newValue) : seedProducts.map(product => ({ ...product }));
          renderProducts();
          renderCart();
          renderAdminProducts();
        } catch (error) {
          console.error("Unable to refresh products from another browser tab.", error);
          setCatalogStatus("catalogSyncError", { detail: error.message });
        }
      });
      return;
    }
    if (!supabaseClient) {
      setCatalogStatus("catalogConfigMissing");
      return;
    }

    setCatalogStatus("catalogSyncing");
    try {
      supabaseClient
        .channel("verdant-product-catalog")
        .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => { void refreshCloudProducts(); })
        .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
          if (isSupabaseAdmin) {
            refreshCloudOrders().catch(error => {
              console.error("Unable to refresh admin orders after a database update.", error);
              showToast(t("orderSaveError", { detail: error.message }));
            });
          }
        })
        .subscribe(status => {
          if (status === "SUBSCRIBED") {
            realtimeSubscribed = true;
            if (cloudCatalogReady) setCatalogStatus("catalogConnected");
            void refreshCloudProducts();
          }
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            realtimeSubscribed = false;
            setCatalogStatus("catalogUnavailable");
            console.error(`Supabase Realtime subscription status: ${status}`);
          }
        });
    } catch (error) {
      setCatalogStatus("catalogUnavailable");
      console.error("Unable to subscribe to Supabase Realtime.", error);
    }
    try {
      await Promise.all([refreshCloudProducts(), restoreAdminSession()]);
    } catch (error) {
      cloudCatalogReady = false;
      console.error("Unable to initialize the shared product catalog.", error);
      setCatalogStatus("catalogSyncError", { detail: error.message });
    }
  }

  function compressProductImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error(t("productImageError")));
        return;
      }
      const sourceUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        try {
          URL.revokeObjectURL(sourceUrl);
          const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          if (!context) throw new Error(t("productImageError"));
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error(t("productImageError")));
          }, "image/jpeg", 0.78);
        } catch (error) {
          URL.revokeObjectURL(sourceUrl);
          reject(error);
        }
      };
      image.onerror = () => {
        URL.revokeObjectURL(sourceUrl);
        reject(new Error(t("productImageError")));
      };
      image.src = sourceUrl;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error(t("productImageError")));
      reader.readAsDataURL(blob);
    });
  }

  function clearPendingProductImage() {
    pendingProductImages.forEach(image => URL.revokeObjectURL(image.previewUrl));
    pendingProductImages = [];
    pendingProductVideo = null;
  }

  async function uploadProductImage(blob) {
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.jpg`;
    const { error } = await supabaseClient.storage
      .from("product-images")
      .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
    if (error) throw error;
    return { path, url: supabaseClient.storage.from("product-images").getPublicUrl(path).data.publicUrl };
  }

  async function removeCloudImage(path) {
    if (!path) return;
    const { error } = await supabaseClient.storage.from("product-images").remove([path]);
    if (error) throw error;
  }

  async function uploadProductVideo(file) {
    const extension = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${extension}`;
    const { error } = await supabaseClient.storage
      .from("product-videos")
      .upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) throw error;
    return { path, url: supabaseClient.storage.from("product-videos").getPublicUrl(path).data.publicUrl };
  }

  async function removeCloudVideo(path) {
    if (!path) return;
    const { error } = await supabaseClient.storage.from("product-videos").remove([path]);
    if (error) throw error;
  }

  async function persistProduct(product, existingProduct, imageUrls, videoUrl) {
    let imageCleanupFailed = false;
    const existingImages = existingProduct?.images || [{ url: existingProduct?.image, path: existingProduct?.imagePath || "" }];
    const retainedUrls = imageUrls.length ? imageUrls : existingImages.map(image => image.url).filter(Boolean);
    const images = retainedUrls.map(url => existingImages.find(image => image.url === url) || { url, path: "" });
    const uploadedImages = [];
    let uploadedVideo = null;
    const cleanupUploads = async () => {
      await Promise.all(uploadedImages.map(image => removeCloudImage(image.path).catch(error => console.error("Unable to remove an image uploaded for a failed product save.", error))));
      if (uploadedVideo) {
        await removeCloudVideo(uploadedVideo.path).catch(error => console.error("Unable to remove the video uploaded for a failed product save.", error));
      }
    };
    try {
      for (const pendingImage of pendingProductImages) {
        if (supabaseSettingsPresent) {
          if (!supabaseClient || !cloudCatalogReady || !isSupabaseAdmin) throw new Error(t("catalogUnavailable"));
          const uploaded = await uploadProductImage(pendingImage.blob);
          images.push(uploaded);
          uploadedImages.push(uploaded);
        } else {
          const url = await blobToDataUrl(pendingImage.blob);
          images.push({ url, path: "" });
        }
      }
      if (pendingProductVideo) {
        if (supabaseSettingsPresent) {
          if (!supabaseClient || !cloudCatalogReady || !isSupabaseAdmin) throw new Error(t("catalogUnavailable"));
          uploadedVideo = await uploadProductVideo(pendingProductVideo);
          product.videoUrl = uploadedVideo.url;
          product.videoPath = uploadedVideo.path;
        } else {
          if (pendingProductVideo.size > 1_500_000) throw new Error("Video uploads in local demo mode are limited to 1.5 MB. Configure Supabase or use a video URL.");
          product.videoUrl = await blobToDataUrl(pendingProductVideo);
          product.videoPath = "";
        }
      } else if (videoUrl) {
        product.videoUrl = videoUrl;
        product.videoPath = existingProduct?.videoUrl === videoUrl ? existingProduct.videoPath || "" : "";
      } else {
        product.videoUrl = existingProduct?.videoUrl || "";
        product.videoPath = existingProduct?.videoPath || "";
      }
    } catch (error) {
      await cleanupUploads();
      throw error;
    }
    if (!images.length) throw new Error(t("imageRequired"));
    product.images = images;
    product.image = images[0].url;
    product.imagePath = images[0].path || "";

    if (supabaseSettingsPresent) {
      if (!supabaseClient || !cloudCatalogReady || !isSupabaseAdmin) throw new Error(t("catalogUnavailable"));
      let saveResponse;
      try {
        saveResponse = await supabaseClient.from("products").upsert(productToRow(product)).select("*").single();
      } catch (error) {
        await cleanupUploads();
        throw error;
      }
      const { data, error } = saveResponse;
      if (error) {
        await cleanupUploads();
        throw error;
      }
      const savedProduct = { ...rowToProduct(data), createdByName: product.createdByName };
      products = products.filter(item => item.id !== savedProduct.id).concat(savedProduct);
      saveProducts();
      renderProducts();
      renderCart();
      renderAdminProducts();
      const retainedImagePaths = new Set(savedProduct.images.map(image => image.path).filter(Boolean));
      const obsoleteImagePaths = existingImages.map(image => image.path).filter(path => path && !retainedImagePaths.has(path));
      for (const path of obsoleteImagePaths) {
        try {
          await removeCloudImage(path);
        } catch (error) {
          console.error("Unable to remove a replaced product image.", error);
          imageCleanupFailed = true;
        }
      }
      if (existingProduct?.videoPath && existingProduct.videoPath !== savedProduct.videoPath) {
        try {
          await removeCloudVideo(existingProduct.videoPath);
        } catch (error) {
          console.error("Unable to remove the replaced product video.", error);
          imageCleanupFailed = true;
        }
      }
      return { imageCleanupFailed };
    }

    const existingIndex = products.findIndex(item => item.id === product.id);
    const previousProducts = products;
    products = [...products];
    if (existingIndex >= 0) products[existingIndex] = product;
    else products.push(product);
    if (!saveProducts()) {
      products = previousProducts;
      return;
    }
    renderProducts();
    renderCart();
    renderAdminProducts();
    return { imageCleanupFailed: false };
  }
  const chatIntentKeywords = {
    delivery: ["delivery", "deliver", "shipping", "ship", "fee", "توصيل", "التوصيل", "الشحن", "رسوم", "گەیاندن", "کرێی گەیاندن"],
    fertilizer: ["fertiliz", "chemical", "pesticide", "سماد", "أسمدة", "الأسمدة", "تسميد", "مبيد", "پەین", "کیمیاوی", "دەرمان"],
    watering: ["watering", "water", "irrigation", "سقي", "الري", "ري", "ماء", "اسقي", "ئاودان", "ئاو", "ئاودە"],
    plants: ["plant", "flower", "indoor", "outdoor", "care", "نبات", "زهرة", "عناية", "حديقة", "ڕووەک", "گوڵ", "باخچە", "چاودێری"],
    greeting: ["hello", "hi", "hey", "مرحبا", "أهلا", "السلام", "سڵاو", "بەخێر"]
  };
  const chatResponseFor = message => {
    const normalized = message.normalize("NFC").toLocaleLowerCase();
    const matches = intent => chatIntentKeywords[intent].some(keyword => normalized.includes(keyword));
    if (matches("delivery")) return t("chatReplyDelivery");
    if (matches("fertilizer")) return t("chatReplyFertilizer");
    if (matches("watering")) return t("chatReplyWater");
    if (matches("plants")) return t("chatReplyPlants");
    if (matches("greeting")) return t("chatReplyGreeting");
    return t("chatReplyFallback");
  };
  const appendChatMessage = (message, sender) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-message chat-${sender}`;
    bubble.textContent = message;
    $("#plant-chat-messages").appendChild(bubble);
    $("#plant-chat-messages").scrollTop = $("#plant-chat-messages").scrollHeight;
  };

  function refreshInstallBanner() {
    const installedDisplay = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    const banner = $("#install-banner");
    if (appInstalled || installedDisplay || installPromptDismissed) {
      banner.hidden = true;
      return;
    }

    banner.hidden = false;
    $("#install-title").textContent = t("installTitle");
    $("#install-description").textContent = t(
      isIOSDevice ? (isIOSSafari ? "installIOSHelp" : "installIOSOpenSafari")
        : deferredInstallPrompt ? "installReady"
          : isAndroidDevice ? "installAndroidHelp"
            : "installDesktopHelp"
    );
    $("#install-action").textContent = t("installAction");
    $("#install-action").hidden = !deferredInstallPrompt;
    $("#install-dismiss").setAttribute("aria-label", t("installDismiss"));
  }

  function applyLanguage() {
    const meta = languageMeta[language];
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    document.title = t("pageTitle");
    $("#page-description").content = t("pageDescription");
    const languageSelect = $("#language-switcher");
    languageSelect.value = language;
    languageSelect.setAttribute("aria-label", t("languageLabel"));
    $$("[data-i18n]").forEach(element => { element.textContent = t(element.dataset.i18n); });
    $$("[data-i18n-html]").forEach(element => { element.innerHTML = t(element.dataset.i18nHtml); });
    $$("[data-i18n-placeholder]").forEach(element => { element.placeholder = t(element.dataset.i18nPlaceholder); });
    $$("[data-i18n-aria-label]").forEach(element => { element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel)); });
    $$("[data-i18n-title]").forEach(element => { element.title = t(element.dataset.i18nTitle); });
    $$("[data-i18n-alt]").forEach(element => { element.alt = t(element.dataset.i18nAlt); });
    refreshCatalogStatus();
    $("#admin-notice").textContent = t(supabaseSettingsPresent ? "adminNoticeCloud" : "adminNoticeLocal");
    $("#admin-email-wrap").hidden = !supabaseSettingsPresent;
    $("#admin-email").required = supabaseSettingsPresent;
    $("#admin-logout").hidden = !supabaseSettingsPresent;
    refreshInstallBanner();
    syncChatToggle();
    $$("[data-step-number]").forEach(element => { element.textContent = formatNumber(element.dataset.stepNumber); });
    $("#cart-step-dot").textContent = formatNumber(1);
    $("#checkout-step-dot").textContent = formatNumber(2);
    updateDiscountBanner();
    renderProducts();
    renderCart();
    renderCustomerOrders();
    if (!$("#admin-overlay").hidden) syncAdmin();
    if (!$("#product-form-wrap").hidden) $("#product-form-heading").textContent = t($("#product-form").elements.id.value ? "editProduct" : "addProduct");
    if (!$("#order-success").hidden) {
      $("#success-copy").textContent = t(lastOrderPayment === "FIB" ? "successFib" : "successOther");
      $("#success-order-number").textContent = t("orderSuccessId", { id: lastOrderId });
    }
    if (receiptData) $("#receipt-preview").innerHTML = `${escapeHtml(t("receiptReady", { name: receiptFileName }))}<img src="${receiptData}" alt="${escapeHtml(t("receiptPreviewAlt"))}">`;
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function setCatalogStatus(key, values = {}) {
    catalogStatusKey = key;
    catalogStatusValues = values;
    refreshCatalogStatus();
  }

  function refreshCatalogStatus() {
    const status = $("#catalog-sync-status");
    if (status) status.textContent = t(catalogStatusKey, catalogStatusValues);
  }

  function updateDiscountBanner() {
    const banner = $("#discount-banner");
    banner.hidden = settings.discount <= 0;
    $("#banner-discount").textContent = `${formatNumber(settings.discount)}%`;
  }

  function renderProducts() {
    const query = $("#product-search").value.trim().toLowerCase();
    const visibleProducts = products.filter(product =>
      (activeCategory === "All" || product.category === activeCategory) &&
      `${product.name} ${product.notes} ${localizedProductText(product, "product")} ${localizedProductText(product, "notes")} ${product.category} ${categoryLabel(product.category)}`.toLowerCase().includes(query)
    );
    $("#product-grid").innerHTML = visibleProducts.map(product => {
      const description = localizedProductText(product, "notes") || categoryLabel(product.category);
      const name = localizedProductText(product, "product");
      const creator = adminPublicProfiles[product.createdBy];
      const creatorName = creator?.full_name || product.createdByName || "";
      return `<article class="product-card">
        <div class="product-image">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(name)}" loading="lazy">
          <span class="product-tag">${escapeHtml(categoryLabel(product.category))}</span>
          ${(product.images || []).length > 1 ? `<span class="product-image-count">${formatNumber(product.images.length)} photos</span>` : ""}
          <button class="product-add" type="button" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(t("addProductToBag", { name }))}" ${product.stock <= 0 ? "disabled" : ""}>${product.stock <= 0 ? "–" : "+"}</button>
        </div>
        <div class="product-info"><div class="product-info-top"><h3>${escapeHtml(name)}</h3><span class="product-price">${productPrice(product)}${settings.discount ? `<del class="product-original">${formatDualMoney(product.retail, product.retailUsd)}</del>` : ""}</span></div>
        <p class="product-description">${escapeHtml(description)}</p>
        <div class="stock-note">${product.stock > 0 ? t("stockAvailable", { count: formatNumber(product.stock) }) : t("stockUnavailable")}</div>${creatorName ? `<span class="product-creator">${t("creator")}: ${escapeHtml(creatorName)}</span>` : ""}<button class="product-detail-link" type="button" data-view-product="${escapeHtml(product.id)}">${t("viewDetails")}</button></div>
      </article>`;
    }).join("");
    $("#empty-products").hidden = visibleProducts.length !== 0;
    $("#all-count").textContent = `(${formatNumber(products.length)})`;
  }

  function relatedProducts(excludedIds, limit = 3, category = "") {
    return products
      .filter(product => !excludedIds.includes(product.id) && product.stock > 0)
      .sort((a, b) => Number(b.category === category) - Number(a.category === category))
      .slice(0, limit);
  }

  function recommendationsMarkup(excludedIds, category = "") {
    const suggestions = relatedProducts(excludedIds, 3, category);
    if (!suggestions.length) return "";
    return `<h3>${t("youMightLike")}</h3><div class="recommendation-list">${suggestions.map(product => `<article class="recommendation-item"><img src="${escapeHtml(product.image)}" alt=""><div><strong>${escapeHtml(localizedProductText(product, "product"))}</strong><span>${productPrice(product)}</span></div><button type="button" data-add="${escapeHtml(product.id)}" aria-label="${escapeHtml(t("addProductToBag", { name: localizedProductText(product, "product") }))}">+</button></article>`).join("")}</div>`;
  }

  function openProductDetails(product) {
    if (!product) return;
    const name = localizedProductText(product, "product");
    const excluded = [product.id];
    const images = product.images?.length ? product.images : [{ url: product.image }];
    const creator = adminPublicProfiles[product.createdBy];
    const creatorName = creator?.full_name || product.createdByName || "";
    const video = product.videoUrl ? `<video class="product-detail-video" controls preload="none" playsinline poster="${escapeHtml(product.image)}"><source src="${escapeHtml(product.videoUrl)}"></video>` : "";
    $("#product-detail-content").innerHTML = `<img class="product-detail-image" data-product-main-image src="${escapeHtml(images[0].url)}" alt="${escapeHtml(name)}" loading="lazy">${images.length > 1 ? `<div class="product-gallery-thumbs">${images.map((image, index) => `<button type="button" data-gallery-image="${index}" aria-label="View product image ${index + 1}" aria-pressed="${index === 0}"><img src="${escapeHtml(image.url)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}<div class="eyebrow">${escapeHtml(categoryLabel(product.category))}</div><h2>${escapeHtml(name)}</h2><p>${escapeHtml(localizedProductText(product, "notes"))}</p>${creatorName ? `<span class="product-creator">${t("creator")}: ${escapeHtml(creatorName)}</span>` : ""}<strong class="product-detail-price">${productPrice(product)}</strong>${video}<button class="button button-dark button-full" type="button" data-add="${escapeHtml(product.id)}" ${product.stock <= 0 ? "disabled" : ""}>${t("addToBag")}</button><section class="recommendations product-recommendations">${recommendationsMarkup(excluded, product.category)}</section>`;
    openOverlay("product-overlay");
  }

  function subtotal() {
    return cart.reduce((total, item) => {
      const product = productById(item.id);
      return total + (product ? discountedPrice(product) * item.quantity : 0);
    }, 0);
  }

  function subtotalUsd() {
    return cart.reduce((total, item) => {
      const product = productById(item.id);
      return total + (product ? discountedPriceUsd(product) * item.quantity : 0);
    }, 0);
  }

  function renderCart() {
    cart = cart.filter(item => productById(item.id) && item.quantity > 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const rawSubtotal = cart.reduce((sum, item) => sum + (productById(item.id)?.retail || 0) * item.quantity, 0);
    const rawSubtotalUsd = cart.reduce((sum, item) => sum + (Number(productById(item.id)?.retailUsd) || 0) * item.quantity, 0);
    const total = subtotal();
    const totalUsd = subtotalUsd();
    $("#cart-count").textContent = formatNumber(itemCount);
    $("#drawer-count").textContent = itemCount ? `(${formatNumber(itemCount)})` : "";
    $("#cart-items").innerHTML = cart.map(item => {
      const product = productById(item.id);
      if (!product) return "";
      return `<article class="cart-item">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
        <div><h3>${escapeHtml(localizedProductText(product, "product"))}</h3><p>${productPrice(product)} ${t("each")}</p>
          <div class="quantity-control"><button type="button" data-quantity="${escapeHtml(item.id)}" data-change="-1" aria-label="${escapeHtml(t("removeOne", { name: localizedProductText(product, "product") }))}">−</button><span>${formatNumber(item.quantity)}</span><button type="button" data-quantity="${escapeHtml(item.id)}" data-change="1" aria-label="${escapeHtml(t("addOne", { name: localizedProductText(product, "product") }))}" ${item.quantity >= product.stock ? "disabled" : ""}>+</button></div>
        </div>
        <div class="cart-item-total">${formatDualMoney(discountedPrice(product) * item.quantity, discountedPriceUsd(product) * item.quantity)}<button class="remove-item" type="button" data-remove="${escapeHtml(item.id)}">${t("remove")}</button></div>
      </article>`;
    }).join("");
    $("#cart-empty").hidden = cart.length !== 0;
    $("#cart-items").hidden = cart.length === 0;
    $("#cart-recommendations").innerHTML = recommendationsMarkup(cart.map(item => item.id));
    $("#cart-recommendations").hidden = cart.length === 0 || !relatedProducts(cart.map(item => item.id)).length;
    $("#benefit-delivery").textContent = t("deliveryVaries");
    $("#delivery-fee-notice").textContent = t("deliveryVaries");
    $("#cart-subtotal").textContent = formatDualMoney(rawSubtotal, rawSubtotalUsd);
    $("#cart-discount-row").hidden = settings.discount <= 0;
    $("#cart-discount").textContent = `−${formatDualMoney(rawSubtotal - subtotal(), rawSubtotalUsd - totalUsd)}`;
    $("#delivery-fee").textContent = t("deliveryVaries");
    $("#cart-total").textContent = formatDualMoney(total, totalUsd);
    $("#checkout-total").textContent = formatDualMoney(total, totalUsd);
    $("#go-checkout").disabled = cart.length === 0;
    $("#go-checkout").style.opacity = cart.length ? "1" : ".5";
    saveCart();
  }

  function addProductToCart(product) {
    if (!product || product.stock <= 0) return;
    const item = cart.find(entry => entry.id === product.id);
    if (item) {
      if (item.quantity >= product.stock) return showToast(t("stockLimit"));
      item.quantity += 1;
    } else cart.push({ id: product.id, quantity: 1 });
    renderCart();
    showToast(t("addedToBag", { name: localizedProductText(product, "product") }));
  }

  function renderAdminProducts() {
    const totalStock = products.reduce((sum, product) => sum + Number(product.stock), 0);
    const totalValue = products.reduce((sum, product) => sum + product.retail * product.stock, 0);
    const productProfit = products.reduce((sum, product) => sum + (product.retail - product.wholesale) * product.stock, 0);
    $("#inventory-summary").innerHTML = `<div class="inventory-stat"><strong>${formatNumber(products.length)}</strong><span>${t("productsInShop")}</span></div><div class="inventory-stat"><strong>${formatNumber(totalStock)}</strong><span>${t("itemsInStock")}</span></div><div class="inventory-stat"><strong>${formatMoney(totalValue)}</strong><span>${t("retailStockValue")}</span></div>`;
    $("#admin-product-count").textContent = `(${formatNumber(products.length)})`;
    $("#admin-product-list").innerHTML = products.map(product => {
      const profit = product.retail - product.wholesale;
      const margin = product.retail ? (profit / product.retail) * 100 : 0;
      const creatorName = adminPublicProfiles[product.createdBy]?.full_name || product.createdByName || "";
      return `<article class="admin-product-row">
        <img src="${escapeHtml(product.image)}" alt="">
        <div><h4>${escapeHtml(localizedProductText(product, "product"))}</h4><p>${escapeHtml(categoryLabel(product.category))} · ${t("stockLabel")}: ${formatNumber(product.stock)}<br>${t("wholesaleLabel")} ${formatDualMoney(product.wholesale, product.wholesaleUsd)} · ${t("retailLabel")} ${formatDualMoney(product.retail, product.retailUsd)}<br><span class="profit-inline">${t("profitLabel")} ${formatDualMoney(profit, Number(product.retailUsd || 0) - Number(product.wholesaleUsd || 0))} ${t("perItem")} · ${formatNumber(margin)}% ${t("marginLabel")}</span>${product.notes ? `<br>${escapeHtml(localizedProductText(product, "notes"))}` : ""}${creatorName ? `<br>${t("creator")}: ${escapeHtml(creatorName)}` : product.deletedBy ? `<br>${t("deletedBy")}: ${escapeHtml(product.deletedBy)}` : ""}</p></div>
        <div class="admin-product-actions"><button type="button" data-edit="${escapeHtml(product.id)}">${t("edit")}</button><button class="delete-product" type="button" data-delete="${escapeHtml(product.id)}">${t("delete")}</button></div>
      </article>`;
    }).join("") || `<div class="empty-admin">${t("productEmpty")}</div>`;
    $("#profit-summary").innerHTML = `<div class="profit-total"><span>${t("profitPotential")}</span><strong>${formatMoney(productProfit)}</strong></div>`;
  }

  function renderOrders() {
    const pending = orders.filter(order => ["Pending", "Awaiting delivery price", "Awaiting customer agreement"].includes(order.status)).length;
    $("#pending-order-count").textContent = pending ? `(${formatNumber(pending)})` : "";
    $("#order-list").innerHTML = orders.length ? [...orders].reverse().map(order => {
      const receipt = order.receipt ? `<div><strong>${t("receiptTitle")}</strong><img class="order-receipt" src="${order.receipt}" alt="${escapeHtml(t("receiptAlt", { id: order.id }))}" title="${escapeHtml(t("openReceipt"))}"></div>` : "";
      const items = (order.items || []).map(item => `${escapeHtml(localizedProductText({ id: item.id, name: item.name, notes: "" }, "product"))} × ${formatNumber(item.quantity)} — ${formatDualMoney(item.price * item.quantity, (Number(item.priceUsd) || 0) * item.quantity)}`).join("<br>");
      const statusKey = order.status === "Approved" ? "statusApproved" : order.status === "Rejected" ? "statusRejected" : order.status === "Awaiting delivery price" ? "deliveryPricePending" : order.status === "Awaiting customer agreement" ? "awaitingAgreement" : order.status === "Awaiting payment" ? "paymentPending" : "statusPending";
      const paymentKey = order.payment === "FIB" ? "paymentDisplayFib" : "paymentDisplayCard";
      const instructionKey = ({ "Call on arrival": "instructionCall", "Leave at the door": "instructionLeave", "Hand to me": "instructionHand", "Call before delivery": "instructionBefore" })[order.instruction];
      const cardLabel = order.card && order.card.startsWith("new-")
        ? t("cardNew", { last4: order.card.slice(4) })
        : order.card === "qicard-4821" ? t("savedQiCard")
          : order.card === "mastercard-0936" ? t("savedMastercard") : order.card;
      const hasDeliveryFee = (order.deliveryFee !== null && order.deliveryFee !== undefined && Number.isFinite(Number(order.deliveryFee)))
        || (order.deliveryFeeUsd !== null && order.deliveryFeeUsd !== undefined && Number.isFinite(Number(order.deliveryFeeUsd)));
      const hasOrderTotal = (order.total !== null && order.total !== undefined && Number.isFinite(Number(order.total)))
        || (order.totalUsd !== null && order.totalUsd !== undefined && Number.isFinite(Number(order.totalUsd)));
      const deliveryAmount = hasDeliveryFee ? formatDualMoney(order.deliveryFee, order.deliveryFeeUsd) : t("deliveryPricePending");
      const orderTotal = hasOrderTotal ? formatDualMoney(order.total, order.totalUsd) : "—";
      const schedule = order.deliveryDate ? `<br><strong>${t("orderScheduled")}:</strong> ${escapeHtml(order.deliveryDate)} · ${escapeHtml(t(order.deliveryTime === "Morning" ? "timeMorning" : order.deliveryTime === "Afternoon" ? "timeAfternoon" : "timeEvening"))}` : "";
      const gift = order.isGift ? `<br><strong>${t("orderGift")}:</strong> ${t("orderGiftYes")} · <strong>${t("greetingCard")}:</strong> ${escapeHtml(order.giftMessage || "")}` : "";
      const priceForm = ["Awaiting delivery price", "Awaiting customer agreement"].includes(order.status) ? `<form class="delivery-price-form" data-order-price="${escapeHtml(order.id)}"><label class="field-label"><span class="label-text">${t("adminSetPrice")} (IQD)</span><input name="deliveryFee" type="number" min="0" step="1" value="${order.deliveryFee !== null && order.deliveryFee !== undefined ? escapeHtml(order.deliveryFee) : ""}"></label><label class="field-label"><span class="label-text">${t("adminSetPrice")} (USD)</span><input name="deliveryFeeUsd" type="number" min="0" step="0.01" value="${order.deliveryFeeUsd !== null && order.deliveryFeeUsd !== undefined ? escapeHtml(order.deliveryFeeUsd) : ""}"></label><button class="button button-dark small-button" type="submit">${t("saveDeliveryPrice")}</button></form>` : "";
      return `<article class="order-card">
        <div class="order-card-header"><div><h4>${escapeHtml(order.name)}</h4><span>${escapeHtml(order.id)} · ${escapeHtml(order.date)}</span></div><span class="order-status ${order.status === "Rejected" ? "rejected" : ""}">${t(statusKey)}</span></div>
        <div class="order-details"><strong>${t("orderPhone")}:</strong> ${escapeHtml(order.phone)}<br><strong>${t("orderAddress")}:</strong> ${escapeHtml(order.address)}<br><strong>${t("orderDelivery")}:</strong> ${instructionKey ? t(instructionKey) : escapeHtml(order.instruction)}${schedule}${gift}${order.notes ? `<br><strong>${t("orderNote")}:</strong> ${escapeHtml(order.notes)}` : ""}${order.payment ? `<br><strong>${t("orderPayment")}:</strong> ${t(paymentKey)}${cardLabel ? ` · ${escapeHtml(cardLabel)}` : ""}` : ""}</div>
        <div class="order-lines">${items}<br><strong>${t("orderSubtotal")} ${formatDualMoney(order.subtotal, order.subtotalUsd)} · ${t("delivery")} ${deliveryAmount} · ${t("orderTotal")} ${orderTotal}</strong></div>
        ${priceForm}
        ${receipt}
        <div class="order-actions">${order.status === "Pending" ? `<button class="approve-order" type="button" data-order-action="Approved" data-order="${escapeHtml(order.id)}">${t("approve")}</button><button class="reject-order" type="button" data-order-action="Rejected" data-order="${escapeHtml(order.id)}">${t("reject")}</button>` : ""}<button class="button button-light small-button" type="button" data-print-order="${escapeHtml(order.id)}">${t("orderPrint")}</button></div>
      </article>`;
    }).join("") : `<div class="empty-admin">${t("noOrders")}</div>`;
  }

  function renderCustomerOrders() {
    $("#customer-order-list").innerHTML = orders.length ? [...orders].reverse().map(order => {
      const statusText = order.status === "Awaiting delivery price" ? t("deliveryPricePending")
        : order.status === "Awaiting customer agreement" ? t("awaitingAgreement")
          : order.status === "Awaiting payment" ? t("awaitingPayment")
            : order.status === "Approved" ? t("statusApproved")
              : order.status === "Rejected" ? t("statusRejected") : t("statusPending");
      const hasFee = (order.deliveryFee !== null && order.deliveryFee !== undefined && Number.isFinite(Number(order.deliveryFee)))
        || (order.deliveryFeeUsd !== null && order.deliveryFeeUsd !== undefined && Number.isFinite(Number(order.deliveryFeeUsd)));
      const hasTotal = (order.total !== null && order.total !== undefined && Number.isFinite(Number(order.total)))
        || (order.totalUsd !== null && order.totalUsd !== undefined && Number.isFinite(Number(order.totalUsd)));
      const fee = hasFee ? formatDualMoney(order.deliveryFee, order.deliveryFeeUsd) : t("deliveryPricePending");
      const total = hasTotal ? formatDualMoney(order.total, order.totalUsd) : "—";
      const actions = order.status === "Awaiting customer agreement"
        ? `<button class="button button-dark button-full" type="button" data-customer-order-action="agree" data-order="${escapeHtml(order.id)}">${t("agreePrice")}</button>`
        : order.status === "Awaiting payment" && order.agreed
          ? `<button class="button button-dark button-full" type="button" data-customer-order-action="pay" data-order="${escapeHtml(order.id)}">${t("continuePayment")}</button>` : "";
      return `<article class="order-card customer-order-card"><div class="order-card-header"><div><h3>${escapeHtml(order.id)}</h3><span>${escapeHtml(order.date)}</span></div><span class="order-status">${statusText}</span></div><p>${t("orderSubtotal")}: ${formatDualMoney(order.subtotal, order.subtotalUsd)}<br>${t("deliveryPrice")}: ${fee}<br>${t("orderTotal")}: ${total}</p>${actions}</article>`;
    }).join("") : `<div class="empty-admin">${t("noCustomerOrders")}</div>`;
  }

  function syncAdmin() {
    renderAdminProducts();
    renderOrders();
    renderAdminActivity();
    renderAdminIdentity();
    const form = $("#settings-form");
    form.elements.discount.value = settings.discount;
    form.elements.fibAccount.value = settings.fibAccount;
  }

  function openOverlay(id) {
    const overlay = $(`#${id}`);
    overlay.hidden = false;
    document.body.classList.add("modal-open");
    if (id === "cart-overlay") {
      renderCart();
      showCheckoutStep("cart");
    } else if (id === "admin-overlay") {
      syncAdmin();
      if (supabaseSettingsPresent && isSupabaseAdmin) {
        refreshCloudOrders().catch(error => {
          console.error("Unable to refresh admin orders.", error);
          showToast(t("orderSaveError", { detail: error.message }));
        });
        refreshAdminActivity().catch(error => {
          console.error("Unable to refresh admin activity.", error);
          showToast(t("activityLoadError", { detail: error.message }));
        });
      }
    } else if (id === "customer-orders-overlay") {
      renderCustomerOrders();
    }
  }

  function closeOverlay(id) {
    $(`#${id}`).hidden = true;
    if ($$(".overlay").every(overlay => overlay.hidden)) document.body.classList.remove("modal-open");
  }

  function showCheckoutStep(step) {
    $("#cart-step").hidden = step !== "cart";
    $("#checkout-step").hidden = step !== "checkout";
    $("#order-success").hidden = step !== "success";
    $("#cart-step-dot").classList.toggle("current", step === "cart");
    $("#cart-step-dot").classList.toggle("complete", step !== "cart");
    $("#checkout-step-dot").classList.toggle("current", step === "checkout");
    $("#cart-step-label").classList.toggle("current", step === "cart");
    $("#checkout-step-label").classList.toggle("current", step === "checkout");
    if (step === "checkout") updateCheckoutMode();
  }

  function updateCheckoutMode() {
    const quote = orders.find(order => order.id === activeQuoteId);
    const hasDeliveryFee = quote && ((quote.deliveryFee !== null && quote.deliveryFee !== undefined && Number.isFinite(Number(quote.deliveryFee)))
    || (quote.deliveryFeeUsd !== null && quote.deliveryFeeUsd !== undefined && Number.isFinite(Number(quote.deliveryFeeUsd))));
    const hasAgreedQuote = Boolean(quote && quote.agreed && hasDeliveryFee);
    $("#payment-section").hidden = !hasAgreedQuote;
    $("#checkout-submit-label").textContent = t(hasAgreedQuote ? "completePayment" : "requestDeliveryPrice");
    $("#checkout-total-label").textContent = t(hasAgreedQuote ? "totalIncludingDelivery" : "subtotal");
    $("#checkout-total").textContent = formatDualMoney(
      (hasAgreedQuote ? Number(quote.subtotal) : subtotal()) + (hasAgreedQuote ? Number(quote.deliveryFee) : 0),
      (hasAgreedQuote ? Number(quote.subtotalUsd) : subtotalUsd()) + (hasAgreedQuote ? Number(quote.deliveryFeeUsd) || 0 : 0)
    );
    $$('input[name="payment"]').forEach(input => { input.required = hasAgreedQuote; });
  }

  function continueQuoteToPayment(order) {
    if (!order || order.status !== "Awaiting payment" || !order.agreed) return;
    activeQuoteId = order.id;
    saveStore("verdant.activeQuote", activeQuoteId);
    cart = (order.items || []).map(item => ({ id: item.id, quantity: item.quantity }));
    saveCart();
    const form = $("#checkout-form");
    form.elements.name.value = order.name;
    form.elements.phone.value = order.phone;
    form.elements.address.value = order.address;
    form.elements.instruction.value = order.instruction;
    form.elements.deliveryDate.value = order.deliveryDate;
    form.elements.deliveryTime.value = order.deliveryTime;
    form.elements.isGift.checked = Boolean(order.isGift);
    form.elements.giftMessage.value = order.giftMessage || "";
    $("#gift-message-wrap").hidden = !order.isGift;
    $("#delivery-notes").value = order.notes || "";
    closeOverlay("customer-orders-overlay");
    openOverlay("cart-overlay");
    renderCart();
    showCheckoutStep("checkout");
    setPaymentDetails();
  }

  function openProductForm(product) {
    const form = $("#product-form");
    clearPendingProductImage();
    form.reset();
    form.elements.id.value = product ? product.id : "";
    $("#product-form-heading").textContent = t(product ? "editProduct" : "addProduct");
    $("#product-video-status").textContent = "";
    if (product) {
      ["name", "category", "wholesale", "retail", "wholesaleUsd", "retailUsd", "stock", "notes"].forEach(key => { form.elements[key].value = product[key] || ""; });
      form.elements.image.value = (product.images?.length ? product.images : [{ url: product.image }]).map(image => /^https?:\/\//i.test(image.url) ? image.url : "").filter(Boolean).join("\n");
      form.elements.videoUrl.value = /^https?:\/\//i.test(product.videoUrl || "") ? product.videoUrl : "";
      showProductImagePreview((product.images?.length ? product.images : [{ url: product.image }]).map(image => image.url), t("imageCurrent"));
    } else {
      form.elements.category.value = "Indoor Plants";
      form.elements.image.value = "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=80";
      showProductImagePreview([form.elements.image.value], t("imageCurrent"));
    }
    $("#product-form-wrap").hidden = false;
    $("#product-form-wrap").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function showProductImagePreview(sources, status) {
    const preview = $("#product-image-preview");
    const urls = Array.isArray(sources) ? sources.filter(Boolean) : [];
    if (!urls.length) {
      preview.hidden = true;
      $("#product-image-preview-list").innerHTML = "";
      return;
    }
    $("#product-image-preview-list").innerHTML = `${urls.map((url, index) => `<img src="${escapeHtml(url)}" alt="" loading="lazy" title="${escapeHtml(status || "")}">`).join("")}<span>${escapeHtml(status || "")} · ${formatNumber(urls.length)} photos</span>`;
    preview.hidden = false;
  }

  function setPaymentDetails() {
    const payment = $('input[name="payment"]:checked')?.value || "";
    $("#fib-detail").hidden = payment !== "FIB";
    $("#card-detail").hidden = payment !== "QiCard / Mastercard";
    $("#fib-account-number").textContent = payment === "FIB" ? settings.fibAccount : "";
    $("#qicard-account-number").textContent = payment === "QiCard / Mastercard" ? settings.fibAccount : "";
  }

  function createCustomerToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
  }

  async function placeOrder(form) {
    let order = orders.find(item => item.id === activeQuoteId);
    if (!order) {
      if (!cart.length) return;
      for (const item of cart) {
        const product = productById(item.id);
        if (!product || product.stock < item.quantity) {
          showToast(t("unavailable", { name: product ? localizedProductText(product, "product") : t("anItem") }));
          renderProducts();
          renderCart();
          return;
        }
      }
      const formData = new FormData(form);
      order = {
        id: `VD-${Date.now().toString().slice(-8)}`,
        createdAt: new Date().toISOString(),
        date: new Intl.DateTimeFormat(languageMeta[language].locale, { dateStyle: "medium", timeStyle: "short" }).format(new Date()),
        name: formData.get("name").trim(),
        phone: formData.get("phone").trim(),
        address: formData.get("address").trim(),
        instruction: formData.get("instruction"),
        deliveryDate: formData.get("deliveryDate"),
        deliveryTime: formData.get("deliveryTime"),
        isGift: formData.get("isGift") === "on",
        giftMessage: formData.get("giftMessage").trim(),
        notes: $("#delivery-notes").value.trim(),
        payment: "",
        card: "",
        receipt: "",
        customerToken: createCustomerToken(),
        items: cart.map(item => {
          const product = productById(item.id);
          return { id: product.id, name: product.name, quantity: item.quantity, price: discountedPrice(product), priceUsd: discountedPriceUsd(product) };
        }),
        subtotal: subtotal(),
        subtotalUsd: subtotalUsd(),
        deliveryFee: null,
        deliveryFeeUsd: null,
        total: null,
        totalUsd: null,
        agreed: false,
        status: "Awaiting delivery price"
      };
      orders.push(order);
      if (!saveOrders()) {
        orders = orders.filter(existing => existing.id !== order.id);
        return;
      }
      try {
        await persistOrder(order, true);
      } catch (error) {
        orders = orders.filter(existing => existing.id !== order.id);
        saveOrders();
        console.error("Unable to persist the customer order.", error);
        showToast(t("orderSaveError", { detail: error.message }));
        return;
      }
      activeQuoteId = order.id;
      if (!saveStore("verdant.activeQuote", activeQuoteId)) {
        orders = orders.filter(existing => existing.id !== order.id);
        saveOrders();
        activeQuoteId = "";
        return;
      }
      closeOverlay("cart-overlay");
      openOverlay("customer-orders-overlay");
      showToast(t("quoteRequested"));
      return;
    }

    if (order.status !== "Awaiting payment" || !order.agreed) {
      closeOverlay("cart-overlay");
      openOverlay("customer-orders-overlay");
      return;
    }
    const selectedPayment = form.elements.payment.value;
    if (selectedPayment === "FIB" && !receiptData) {
      showToast(t("receiptRequired"));
      return;
    }
    for (const item of cart) {
      const product = productById(item.id);
      if (!product || product.stock < item.quantity) {
        showToast(t("unavailable", { name: product ? localizedProductText(product, "product") : t("anItem") }));
        renderProducts();
        renderCart();
        return;
      }
    }
    const previousOrder = { ...order };
    const previousStocks = cart.map(item => ({ product: productById(item.id), stock: productById(item.id).stock }));
    cart.forEach(item => { productById(item.id).stock -= item.quantity; });
    order.payment = selectedPayment;
    order.receipt = selectedPayment === "FIB" ? receiptData : "";
    order.deliveryFee = Number(order.deliveryFee);
    order.deliveryFeeUsd = Number(order.deliveryFeeUsd) || 0;
    order.total = order.subtotal + order.deliveryFee;
    order.totalUsd = order.subtotalUsd + order.deliveryFeeUsd;
    order.status = "Pending";
    try {
      await persistCustomerOrderAction(order, "complete");
    } catch (error) {
      previousStocks.forEach(item => { item.product.stock = item.stock; });
      Object.assign(order, previousOrder);
      console.error("Unable to complete the customer order.", error);
      showToast(t("orderSaveError", { detail: error.message }));
      return;
    }
    if (!saveProducts() || !saveOrders()) {
      previousStocks.forEach(item => { item.product.stock = item.stock; });
      Object.assign(order, previousOrder);
      saveProducts();
      saveOrders();
      return;
    }
    cart = [];
    saveCart();
    activeQuoteId = "";
    saveStore("verdant.activeQuote", activeQuoteId);
    receiptData = "";
    receiptFileName = "";
    $("#delivery-notes").value = "";
    $("#checkout-form").reset();
    setPaymentDetails();
    $("#gift-message-wrap").hidden = true;
    $("#receipt-file").value = "";
    $("#receipt-preview").hidden = true;
    lastOrderPayment = selectedPayment;
    lastOrderId = order.id;
    $("#success-copy").textContent = t(selectedPayment === "FIB" ? "successFib" : "successOther");
    $("#success-order-number").textContent = t("orderSuccessId", { id: order.id });
    showCheckoutStep("success");
    renderProducts();
    renderCart();
    showToast(t("orderPlacedToast"));
  }

  $$(".filter-chip").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $$(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
    renderProducts();
  }));
  $$("[data-nav-category]").forEach(link => link.addEventListener("click", () => {
    activeCategory = link.dataset.navCategory;
    $$(".filter-chip").forEach(chip => chip.classList.toggle("active", chip.dataset.category === activeCategory));
    renderProducts();
  }));
  $("#product-search").addEventListener("input", renderProducts);
  document.addEventListener("click", event => {
    const galleryButton = event.target.closest("[data-gallery-image]");
    if (galleryButton) {
      const mainImage = $("#product-detail-content [data-product-main-image]");
      const selectedImage = galleryButton.querySelector("img");
      if (mainImage && selectedImage) {
        mainImage.src = selectedImage.src;
        $$("#product-detail-content [data-gallery-image]").forEach(button => button.setAttribute("aria-pressed", String(button === galleryButton)));
      }
      return;
    }
    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      addProductToCart(productById(addButton.dataset.add));
      if (addButton.closest("#product-detail-content")) closeOverlay("product-overlay");
      return;
    }
    const detailsButton = event.target.closest("[data-view-product]");
    if (detailsButton) openProductDetails(productById(detailsButton.dataset.viewProduct));
  });
  $("#cart-open").addEventListener("click", () => openOverlay("cart-overlay"));
  $("#orders-open").addEventListener("click", () => openOverlay("customer-orders-overlay"));
  const reloadApp = () => {
    if (serviceWorkerReloading) return;
    serviceWorkerReloading = true;
    window.location.reload();
  };
  const refreshButton = $("#refreshAppBtn");
  const refreshButtonLabel = $(".refresh-btn-label");
  refreshButton.addEventListener("click", async () => {
    if (refreshButton.disabled) return;
    refreshButton.disabled = true;
    refreshButtonLabel.textContent = t("refreshingApp");
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          if (registration.waiting && navigator.serviceWorker.controller) {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        }
      }
      if (!await refreshCloudProducts()) {
        throw new Error("The shared product catalog could not be refreshed.");
      }
      reloadApp();
    } catch (error) {
      console.error("Unable to refresh Gulnar.", error);
      showToast(t("refreshFailed"));
    } finally {
      refreshButton.disabled = false;
      refreshButtonLabel.textContent = t("refreshApp");
    }
  });
  let adminClickCount = 0;
  let adminClickTimer;
  $("#nursery-logo").addEventListener("click", event => {
    adminClickCount += 1;
    clearTimeout(adminClickTimer);
    if (adminClickCount >= 3) {
      event.preventDefault();
      adminClickCount = 0;
      if (supabaseSettingsPresent && isSupabaseAdmin) {
        openOverlay("admin-overlay");
      } else {
        openOverlay("admin-login-overlay");
        (supabaseSettingsPresent ? $("#admin-email") : $("#admin-password")).focus();
      }
    } else {
      adminClickTimer = setTimeout(() => { adminClickCount = 0; }, 700);
    }
  });
  $("#admin-login-form").addEventListener("submit", async event => {
    event.preventDefault();
    const loginForm = event.currentTarget;
    const loginError = $("#admin-login-error");
    loginError.hidden = true;
    if (supabaseSettingsPresent) {
      if (!supabaseClient) {
        loginError.textContent = t("adminConfigError");
        loginError.hidden = false;
        return;
      }
      let signInResponse;
      try {
        signInResponse = await supabaseClient.auth.signInWithPassword({
          email: $("#admin-email").value.trim(),
          password: $("#admin-password").value
        });
      } catch (error) {
        console.error("Supabase admin sign-in failed.", error);
        loginError.textContent = t("adminLoginFailure", { detail: error.message });
        loginError.hidden = false;
        return;
      }
      const { data, error } = signInResponse;
      if (error) {
        console.error("Supabase admin sign-in failed.", error);
        loginError.textContent = t("adminLoginFailure", { detail: error.message });
        loginError.hidden = false;
        $("#admin-password").select();
        return;
      }
      if (!data.user) {
        loginError.textContent = t("adminLoginFailure", { detail: "No user was returned." });
        loginError.hidden = false;
        return;
      }
      let membershipResponse;
      try {
        membershipResponse = await supabaseClient
          .from("product_admins")
          .select("user_id")
          .eq("user_id", data.user.id)
          .maybeSingle();
      } catch (membershipError) {
        console.error("Unable to check the product admin membership.", membershipError);
        loginError.textContent = t("adminLoginFailure", { detail: membershipError.message });
        loginError.hidden = false;
        return;
      }
      const { data: membership, error: membershipError } = membershipResponse;
      if (membershipError) {
        console.error("Unable to check the product admin membership.", membershipError);
        loginError.textContent = t("adminLoginFailure", { detail: membershipError.message });
        loginError.hidden = false;
        return;
      }
      if (!membership) {
        isSupabaseAdmin = false;
        try {
          await supabaseClient.auth.signOut();
        } catch (error) {
          console.error("Unable to end a non-admin Supabase session.", error);
        }
        loginError.textContent = t("adminNotAuthorized");
        loginError.hidden = false;
        return;
      }
      isSupabaseAdmin = true;
      currentAdminUser = data.user;
      try {
        await loadAdminProfile();
      } catch (error) {
        console.error("Unable to load the admin profile.", error);
        showToast(t("profileSaveError", { detail: error.message }));
      }
    } else if ($("#admin-password").value !== "1234") {
      loginError.textContent = t("adminPasswordIncorrect");
      loginError.hidden = false;
      $("#admin-password").select();
      return;
    } else {
      await loadAdminProfile();
    }
    loginForm.reset();
    closeOverlay("admin-login-overlay");
    openOverlay("admin-overlay");
  });
  $("#admin-logout").addEventListener("click", async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Unable to sign out of Supabase.", error);
      showToast(t("adminSignOutError", { detail: error.message }));
      return;
    }
    isSupabaseAdmin = false;
    currentAdminUser = null;
    closeOverlay("admin-overlay");
    showToast(t("adminSignedOut"));
  });
  $$("[data-close]").forEach(button => button.addEventListener("click", () => closeOverlay(`${button.dataset.close}-overlay`)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeOverlay("cart-overlay");
      closeOverlay("admin-overlay");
      closeOverlay("customer-orders-overlay");
      closeOverlay("product-overlay");
      closeOverlay("admin-login-overlay");
    }
  });
  $("#cart-items").addEventListener("click", event => {
    const quantityButton = event.target.closest("[data-quantity]");
    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) cart = cart.filter(item => item.id !== removeButton.dataset.remove);
    if (quantityButton) {
      const item = cart.find(entry => entry.id === quantityButton.dataset.quantity);
      const product = productById(quantityButton.dataset.quantity);
      if (!item || !product) return;
      item.quantity += Number(quantityButton.dataset.change);
      if (item.quantity <= 0) cart = cart.filter(entry => entry !== item);
      else if (item.quantity > product.stock) item.quantity = product.stock;
    }
    renderCart();
    renderProducts();
  });
  $("#go-checkout").addEventListener("click", () => {
    if (!cart.length) return;
    const quote = orders.find(order => order.id === activeQuoteId);
    if (quote) {
      if (quote.status === "Awaiting payment") continueQuoteToPayment(quote);
      else openOverlay("customer-orders-overlay");
      return;
    }
    showCheckoutStep("checkout");
    setPaymentDetails();
  });
  $("#back-to-cart").addEventListener("click", () => showCheckoutStep("cart"));
  $("#checkout-form").addEventListener("change", event => {
    if (event.target.name === "payment") setPaymentDetails();
    if (event.target.id === "is-gift") {
      $("#gift-message-wrap").hidden = !event.target.checked;
      $("#checkout-form").elements.giftMessage.required = event.target.checked;
    }
  });
  $("#checkout-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    try {
      await placeOrder(event.currentTarget);
    } catch (error) {
      console.error("Unable to place the customer order.", error);
      showToast(t("orderSaveError", { detail: error.message }));
    }
  });
  const receiptInput = $("#receipt-file");
  $("#receipt-gallery").addEventListener("click", () => {
    receiptInput.removeAttribute("capture");
    receiptInput.click();
  });
  $("#receipt-camera").addEventListener("click", () => {
    receiptInput.setAttribute("capture", "environment");
    receiptInput.click();
  });
  receiptInput.addEventListener("change", event => {
    const file = event.target.files[0];
    receiptData = "";
    receiptFileName = "";
    $("#receipt-preview").hidden = true;
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.value = "";
      return showToast(t("receiptImageError"));
    }
    showToast(t("receiptCompressing"));
    const sourceUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      event.target.value = "";
      showToast(t("receiptReadError"));
    };
    image.onload = () => {
      URL.revokeObjectURL(sourceUrl);
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        event.target.value = "";
        showToast(t("receiptReadError"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (!blob) {
          event.target.value = "";
          showToast(t("receiptReadError"));
          return;
        }
        const reader = new FileReader();
        reader.onerror = () => showToast(t("receiptReadError"));
        reader.onload = () => {
          receiptData = String(reader.result);
          receiptFileName = file.name;
          $("#receipt-preview").innerHTML = `${escapeHtml(t("receiptReady", { name: file.name }))}<img src="${receiptData}" alt="${escapeHtml(t("receiptPreviewAlt"))}"><small>${formatNumber(Math.ceil(blob.size / 1024))} KB</small>`;
          $("#receipt-preview").hidden = false;
        };
        reader.readAsDataURL(blob);
      }, "image/jpeg", 0.78);
    };
    image.src = sourceUrl;
  });
  const copyPaymentNumber = async () => {
    try {
      await navigator.clipboard.writeText(settings.fibAccount);
      showToast(t("paymentNumberCopied"));
    } catch (error) {
      showToast(t("copyUnavailable"));
    }
  };
  $("#copy-fib").addEventListener("click", copyPaymentNumber);
  $("#copy-qicard").addEventListener("click", copyPaymentNumber);
  $("#finish-order").addEventListener("click", () => {
    closeOverlay("cart-overlay");
    renderProducts();
  });
  $("#order-list").addEventListener("submit", async event => {
    const form = event.target.closest("form[data-order-price]");
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const order = orders.find(item => item.id === form.dataset.orderPrice);
    const formData = new FormData(form);
    const priceValue = formData.get("deliveryFee");
    const priceUsdValue = formData.get("deliveryFeeUsd");
    const price = priceValue === "" ? null : Number(priceValue);
    const priceUsd = priceUsdValue === "" ? null : Number(priceUsdValue);
    if (!order || (price === null && priceUsd === null) || (price !== null && (!Number.isFinite(price) || price < 0)) || (priceUsd !== null && (!Number.isFinite(priceUsd) || priceUsd < 0))) return showToast(t("priceInvalid"));
    const previousOrder = { ...order };
    order.deliveryFee = price;
    order.deliveryFeeUsd = priceUsd;
    order.total = price === null ? null : order.subtotal + price;
    order.totalUsd = priceUsd === null ? null : (Number(order.subtotalUsd) || 0) + priceUsd;
    order.status = "Awaiting customer agreement";
    order.agreed = false;
    try {
      await persistOrder(order);
    } catch (error) {
      Object.assign(order, previousOrder);
      console.error("Unable to update the order delivery price.", error);
      showToast(t("orderSaveError", { detail: error.message }));
      return;
    }
    if (!saveOrders()) {
      Object.assign(order, previousOrder);
      return;
    }
    renderOrders();
    renderCustomerOrders();
    await recordAdminActivity("activityOrderUpdated", "order", order.id, order.name, { status: order.status });
    showToast(t("priceSaved"));
  });
  $("#customer-order-list").addEventListener("click", async event => {
    const action = event.target.closest("[data-customer-order-action]");
    if (!action) return;
    const order = orders.find(item => item.id === action.dataset.order);
    if (!order) return;
    if (action.dataset.customerOrderAction === "agree" && order.status === "Awaiting customer agreement") {
      try {
        await persistCustomerOrderAction(order, "agree");
      } catch (error) {
        console.error("Unable to save the customer's delivery-price agreement.", error);
        showToast(t("orderSaveError", { detail: error.message }));
        return;
      }
      order.agreed = true;
      order.status = "Awaiting payment";
      activeQuoteId = order.id;
      if (!saveOrders() || !saveStore("verdant.activeQuote", activeQuoteId)) return;
      renderCustomerOrders();
      renderOrders();
      showToast(t("priceAgreed"));
    } else if (action.dataset.customerOrderAction === "pay") {
      continueQuoteToPayment(order);
    }
  });

  $$(".admin-tab").forEach(button => button.addEventListener("click", () => {
    $$(".admin-tab").forEach(tab => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    ["products", "orders", "settings", "profile", "activity"].forEach(tab => { $(`#admin-${tab}`).hidden = tab !== button.dataset.tab; });
    if (button.dataset.tab === "orders" && supabaseSettingsPresent) {
      refreshCloudOrders().catch(error => {
        console.error("Unable to refresh admin orders.", error);
        showToast(t("orderSaveError", { detail: error.message }));
      });
    }
    if (button.dataset.tab === "activity") {
      refreshAdminActivity().catch(error => {
        console.error("Unable to refresh admin activity.", error);
        showToast(t("activityLoadError", { detail: error.message }));
      });
    }
    if (button.dataset.tab === "products") renderAdminProducts();
    if (button.dataset.tab === "profile") renderAdminIdentity();
  }));
  $("#add-product-button").addEventListener("click", () => openProductForm(null));
  $("#cancel-product").addEventListener("click", () => {
    clearPendingProductImage();
    $("#product-form-wrap").hidden = true;
  });
  $("#product-gallery-button").addEventListener("click", () => $("#product-gallery-input").click());
  $("#product-camera-button").addEventListener("click", () => $("#product-camera-input").click());
  ["#product-gallery-input", "#product-camera-input"].forEach(selector => {
    $(selector).addEventListener("change", async event => {
      const files = [...event.target.files];
      event.target.value = "";
      if (!files.length) return;
      try {
        const compressed = await Promise.all(files.map(compressProductImage));
        pendingProductImages.push(...compressed.map(blob => ({ blob, previewUrl: URL.createObjectURL(blob) })));
        const urls = $("#product-form").elements.image.value.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
        showProductImagePreview([...urls, ...pendingProductImages.map(image => image.previewUrl)], t("imageReady"));
      } catch (error) {
        console.error("Unable to prepare the selected product image.", error);
        const urls = $("#product-form").elements.image.value.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
        showProductImagePreview(urls, "");
        showToast(error.message || t("productImageError"));
      }
    });
  });
  $("#product-form").elements.image.addEventListener("input", event => {
    const urls = event.target.value.split(/\r?\n/).map(url => url.trim()).filter(Boolean);
    showProductImagePreview([...urls, ...pendingProductImages.map(image => image.previewUrl)], urls.length ? t("imageCurrent") : t("imageReady"));
  });
  $("#product-video-button").addEventListener("click", () => $("#product-video-input").click());
  $("#product-video-input").addEventListener("change", event => {
    pendingProductVideo = event.target.files[0] || null;
    event.target.value = "";
    if (!pendingProductVideo) return;
    $("#product-form").elements.videoUrl.value = "";
    $("#product-video-status").textContent = `${pendingProductVideo.name} (${formatNumber(Math.ceil(pendingProductVideo.size / 1024))} KB)`;
  });
  $("#product-form").elements.videoUrl.addEventListener("input", event => {
    if (!event.target.value.trim()) return;
    pendingProductVideo = null;
    $("#product-video-status").textContent = "";
  });
  $("#product-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const id = data.get("id") || `plant-${Date.now()}`;
    const existingProduct = productById(id);
    const imageUrls = data.get("image").split(/\r?\n/).map(url => url.trim()).filter(Boolean);
    const videoUrl = data.get("videoUrl").trim();
    const product = {
      id,
      name: data.get("name").trim(),
      category: data.get("category"),
      image: "",
      images: [],
      wholesale: Number(data.get("wholesale")),
      retail: Number(data.get("retail")),
      wholesaleUsd: Number(data.get("wholesaleUsd")) || 0,
      retailUsd: Number(data.get("retailUsd")) || 0,
      stock: Number(data.get("stock")),
      notes: data.get("notes").trim(),
      videoUrl,
      videoPath: "",
      createdBy: existingProduct?.createdBy || currentAdminUser?.id || "",
      createdByName: existingProduct?.createdByName || adminDisplayName()
    };
    if (product.retail <= 0 && product.retailUsd <= 0) {
      showToast(t("retailRequired"));
      return;
    }
    if (product.retail > 0 && product.wholesale > product.retail) {
      form.elements.retail.setCustomValidity(t("retailTooLow"));
      form.elements.retail.reportValidity();
      form.elements.retail.setCustomValidity("");
      return;
    }
    if (product.retailUsd > 0 && product.wholesaleUsd > product.retailUsd) {
      form.elements.retailUsd.setCustomValidity(t("retailTooLow"));
      form.elements.retailUsd.reportValidity();
      form.elements.retailUsd.setCustomValidity("");
      return;
    }
    if (imageUrls.some(url => !/^https?:\/\//i.test(url) && !/^data:image\/(?:jpeg|png|webp);base64,/i.test(url))) {
      showToast(t("imageUrlInvalid"));
      return;
    }
    if (videoUrl && !/^https?:\/\//i.test(videoUrl)) {
      showToast(t("videoUrlInvalid"));
      return;
    }
    if (!pendingProductImages.length && !imageUrls.length && !existingProduct) {
      showToast(t("imageRequired"));
      return;
    }
    if (pendingProductVideo && (!["video/mp4", "video/webm", "video/quicktime"].includes(pendingProductVideo.type) || pendingProductVideo.size > 100 * 1024 * 1024)) {
      showToast(t("videoUploadError", { detail: "Choose an MP4, WebM, or MOV file up to 100 MB." }));
      return;
    }
    if (supabaseSettingsPresent && (!supabaseClient || !cloudCatalogReady || !isSupabaseAdmin)) {
      showToast(t("catalogUnavailable"));
      return;
    }
    let saveResult;
    try {
      saveResult = await persistProduct(product, existingProduct, imageUrls, videoUrl);
      if (!saveResult) return;
    } catch (error) {
      console.error("Unable to save product.", error);
      showToast(t("productSaveError", { detail: error.message }));
      return;
    }
    clearPendingProductImage();
    $("#product-form-wrap").hidden = true;
    await recordAdminActivity(existingProduct ? "activityProductEdited" : "activityProductAdded", "product", product.id, product.name);
    showToast(saveResult.imageCleanupFailed
      ? t("productImageCleanupError")
      : t(existingProduct ? "productUpdated" : "productAdded"));
  });
  $("#admin-product-list").addEventListener("click", async event => {
    const edit = event.target.closest("[data-edit]");
    const remove = event.target.closest("[data-delete]");
    if (edit) openProductForm(productById(edit.dataset.edit));
    if (remove) {
      const product = productById(remove.dataset.delete);
      if (!product) return;
      if (!confirm(t("deleteConfirm", { name: localizedProductText(product, "product") }))) return;
      if (supabaseSettingsPresent && (!supabaseClient || !cloudCatalogReady || !isSupabaseAdmin)) {
        showToast(t("catalogUnavailable"));
        return;
      }
      if (supabaseSettingsPresent) {
        try {
          const { error } = await supabaseClient.from("products").delete().eq("id", product.id);
          if (error) throw error;
        } catch (error) {
          console.error("Unable to delete product.", error);
          showToast(t("productDeleteError", { detail: error.message }));
          return;
        }
      }
      const previousProducts = products;
      let imageCleanupFailed = false;
      products = products.filter(item => item.id !== product.id);
      cart = cart.filter(item => item.id !== product.id);
      if (!supabaseSettingsPresent && !saveProducts()) {
        products = previousProducts;
        return;
      }
      if (supabaseSettingsPresent) saveProducts();
      saveCart();
      renderProducts();
      renderCart();
      renderAdminProducts();
      if (supabaseSettingsPresent) {
        const imagePaths = (product.images || [{ path: product.imagePath }]).map(image => image.path).filter(Boolean);
        for (const path of imagePaths) {
          try {
            await removeCloudImage(path);
          } catch (error) {
            console.error("Unable to remove a deleted product image.", error);
            imageCleanupFailed = true;
          }
        }
        if (product.videoPath) {
          try {
            await removeCloudVideo(product.videoPath);
          } catch (error) {
            console.error("Unable to remove the deleted product video.", error);
            imageCleanupFailed = true;
          }
        }
      }
      if (supabaseSettingsPresent) {
        try {
          await refreshAdminActivity();
        } catch (error) {
          console.error("Unable to refresh admin activity after deleting a product.", error);
          showToast(t("activityLoadError", { detail: error.message }));
        }
      } else {
        await recordAdminActivity("activityProductDeleted", "product", product.id, localizedProductText(product, "product"));
      }
      showToast(imageCleanupFailed
        ? t("productImageCleanupError")
        : t("productRemoved", { name: localizedProductText(product, "product") }));
    }
  });
  $("#settings-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    settings = { discount: Number(data.get("discount")), fibAccount: data.get("fibAccount").trim() };
    if (!saveSettings()) return;
    setPaymentDetails();
    updateDiscountBanner();
    renderProducts();
    renderCart();
    showToast(t("settingsSaved"));
  });
  $("#order-list").addEventListener("click", async event => {
    const action = event.target.closest("[data-order-action]");
    const printButton = event.target.closest("[data-print-order]");
    const receipt = event.target.closest(".order-receipt");
    if (receipt) {
      const popup = window.open();
      if (popup) {
        const image = popup.document.createElement("img");
        image.src = receipt.src;
        image.alt = receipt.alt;
        image.style.cssText = "max-width:100%;height:auto;display:block;margin:auto";
        popup.document.body.appendChild(image);
      } else showToast(t("browserBlocked"));
      return;
    }
    if (printButton) {
      const card = printButton.closest(".order-card").cloneNode(true);
      card.querySelectorAll(".order-actions, .delivery-price-form").forEach(element => element.remove());
      const popup = window.open("", "_blank");
      if (!popup) {
        showToast(t("browserBlocked"));
        return;
      }
      popup.document.title = `${t("orders")} ${printButton.dataset.printOrder}`;
      const style = popup.document.createElement("style");
      style.textContent = "body{font:14px Arial,sans-serif;color:#243328;margin:32px}.order-card{max-width:760px;margin:auto;padding:20px;border:1px solid #dfe4d9}.order-card-header{display:flex;justify-content:space-between}.order-details,.order-lines{line-height:1.8}.order-receipt{max-width:180px}";
      popup.document.head.appendChild(style);
      popup.document.body.appendChild(card);
      popup.focus();
      popup.print();
      return;
    }
    if (!action) return;
    const order = orders.find(item => item.id === action.dataset.order);
    if (!order) return;
    const previousStatus = order.status;
    order.status = action.dataset.orderAction;
    try {
      await persistOrder(order);
    } catch (error) {
      order.status = previousStatus;
      console.error("Unable to update order status.", error);
      showToast(t("orderSaveError", { detail: error.message }));
      return;
    }
    if (!saveOrders()) {
      order.status = previousStatus;
      return;
    }
    renderOrders();
    await recordAdminActivity("activityOrderUpdated", "order", order.id, order.name, { status: order.status });
    showToast(t(order.status === "Approved" ? "orderApproved" : "orderRejected", { id: order.id }));
  });

  $("#admin-profile-form").addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextProfile = {
      fullName: data.get("fullName").trim(),
      title: data.get("title").trim(),
      avatarUrl: data.get("avatarUrl").trim(),
      phone: data.get("phone").trim(),
      notes: data.get("notes").trim()
    };
    if (nextProfile.avatarUrl && !/^https?:\/\//i.test(nextProfile.avatarUrl)) {
      showToast(t("imageUrlInvalid"));
      return;
    }
    const previousProfile = adminProfile;
    adminProfile = nextProfile;
    try {
      if (supabaseSettingsPresent) {
        if (!supabaseClient || !isSupabaseAdmin || !currentAdminUser) throw new Error(t("catalogUnavailable"));
        const { error } = await supabaseClient.from("admin_profiles").upsert({
          user_id: currentAdminUser.id,
          full_name: nextProfile.fullName,
          title: nextProfile.title,
          avatar_url: nextProfile.avatarUrl,
          phone: nextProfile.phone,
          notes: nextProfile.notes,
          updated_at: new Date().toISOString()
        });
        if (error) throw error;
      } else if (!saveStore("verdant.adminProfile", nextProfile)) {
        adminProfile = previousProfile;
        return;
      }
      renderAdminIdentity();
      adminPublicProfiles[currentAdminUser?.id || "local-admin"] = {
        user_id: currentAdminUser?.id || "local-admin",
        full_name: nextProfile.fullName,
        title: nextProfile.title,
        avatar_url: nextProfile.avatarUrl
      };
      renderProducts();
      renderAdminProducts();
      await recordAdminActivity("activityProfileUpdated", "admin", currentAdminUser?.id || "local-admin", nextProfile.fullName);
      showToast(t("profileSaved"));
    } catch (error) {
      adminProfile = previousProfile;
      renderAdminIdentity();
      console.error("Unable to save the admin profile.", error);
      showToast(t("profileSaveError", { detail: error.message }));
    }
  });

  $$(".faq-list details").forEach(detail => detail.addEventListener("toggle", () => {
    if (detail.open) $$(".faq-list details").filter(other => other !== detail).forEach(other => { other.open = false; });
  }));
  $("#delivery-date").min = (() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  })();

  chatToggle.addEventListener("click", () => setChatOpen(chatPanel.hidden));
  $("#plant-chat-close").addEventListener("click", () => setChatOpen(false));
  $("#plant-chat-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#plant-chat-input");
    const message = input.value.trim();
    if (!message) return;
    appendChatMessage(message, "user");
    input.value = "";
    appendChatMessage(chatResponseFor(message), "assistant");
  });

  $("#language-switcher").addEventListener("change", event => {
    if (!Object.prototype.hasOwnProperty.call(languageMeta, event.target.value)) return;
    language = event.target.value;
    saveStore(LANGUAGE_STORAGE, language);
    applyLanguage();
  });

  $("#share-app-button").addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("shareTitle"),
          text: t("shareMessage"),
          url: APP_SHARE_URL
        });
        $("#get-app-link").href = APP_SHARE_URL;
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Unable to share the Gulnar app link.", error);
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(APP_SHARE_URL);
      } else {
        const helper = document.createElement("textarea");
        helper.value = APP_SHARE_URL;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw new Error("Clipboard access is unavailable.");
      }
      showToast(t("shareCopied"));
    } catch (error) {
      console.error("Unable to copy the Gulnar app link.", error);
      showToast(t("shareCopyError"));
    }
  });

  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    refreshInstallBanner();
  });
  window.addEventListener("appinstalled", () => {
    appInstalled = true;
    deferredInstallPrompt = null;
    refreshInstallBanner();
  });
  $("#install-dismiss").addEventListener("click", () => {
    installPromptDismissed = true;
    refreshInstallBanner();
  });
  $("#install-action").addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    const installEvent = deferredInstallPrompt;
    deferredInstallPrompt = null;
    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") appInstalled = true;
    } catch (error) {
      console.error("Unable to start the Gulnar install prompt.", error);
      showToast(t("installFailed"));
    }
    refreshInstallBanner();
  });
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      reloadApp();
    });
    navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" })
      .then(registration => {
        if (registration.waiting && navigator.serviceWorker.controller) {
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          installingWorker.addEventListener("statechange", () => {
            if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
              (registration.waiting || installingWorker).postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
        registration.update().catch(error => console.error("Unable to check for Gulnar updates.", error));
      })
      .catch(error => console.error("Unable to register the Gulnar service worker.", error));
  }

  applyLanguage();
  setPaymentDetails();
  initializeCatalogSync();
})();
