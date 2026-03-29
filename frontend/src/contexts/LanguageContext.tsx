import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "hi" | "mr";

const translations: Record<string, Record<Lang, string>> = {
  // General
  tagline: {
    en: "A robust platform helping contractors and workers build the future together.",
    hi: "ठेकेदारों और श्रमिकों को एक साथ भविष्य बनाने में मदद करने वाला एक मजबूत मंच।",
    mr: "कंत्राटदार आणि कामगारांना सोबत भविष्य घडवण्यात मदत करणारा एक मजबूत मंच.",
  },
  getStarted: { en: "Get Started", hi: "शुरू करें", mr: "सुरुवात करा" },
  login: { en: "Login", hi: "लॉगिन", mr: "लॉगिन" },
  signup: { en: "Sign Up", hi: "साइन अप", mr: "साइन अप" },
  email: { en: "Email", hi: "ईमेल", mr: "ईमेल" },
  password: { en: "Password", hi: "पासवर्ड", mr: "पासवर्ड" },
  name: { en: "Full Name", hi: "पूरा नाम", mr: "पूर्ण नाव" },
  continueGoogle: { en: "Continue with Google", hi: "Google से जारी रखें", mr: "Google सह सुरू ठेवा" },
  noAccount: { en: "Don't have an account?", hi: "खाता नहीं है?", mr: "खाते नाही?" },
  haveAccount: { en: "Already have an account?", hi: "पहले से खाता है?", mr: "आधीच खाते आहे?" },
  heroTitle: { en: "Build Smart. Hire Smart. Work Smart.", hi: "समझदारी से बनाएं। समझदारी से नियुक्त करें। समझदारी से काम करें।", mr: "शहाणपणाने बांधा. शहाणपणाने कामगार नेमा. शहाणपणाने काम करा." },
  continue: { en: "Continue", hi: "जारी रखें", mr: "पुढे चला" },
  or: { en: "OR", hi: "या", mr: "किंवा" },
  logout: { en: "Logout", hi: "लॉगआउट", mr: "लॉगआउट" },
  allRightsReserved: { en: "© 2026 WorkSetu. All rights reserved.", hi: "© 2026 WorkSetu. सर्वाधिकार सुरक्षित।", mr: "© 2026 WorkSetu. सर्व हक्क राखीव." },

  // Auth pages
  welcomeBack: { en: "Welcome back", hi: "वापस स्वागत है", mr: "पुन्हा स्वागत" },
  loginToContinue: { en: "Login to continue", hi: "जारी रखने के लिए लॉगिन करें", mr: "सुरू ठेवण्यासाठी लॉगिन करा" },
  createAccount: { en: "Create your account", hi: "अपना खाता बनाएं", mr: "तुमचे खाते तयार करा" },
  signupToGetStarted: { en: "Sign up to get started", hi: "शुरू करने के लिए साइन अप करें", mr: "सुरुवात करण्यासाठी साइन अप करा" },

  // Role selection
  selectRole: { en: "Select Your Role", hi: "अपनी भूमिका चुनें", mr: "तुमची भूमिका निवडा" },
  chooseHowToUse: { en: "Choose how you want to use WorkSetu", hi: "WorkSetu का उपयोग कैसे करना चाहते हैं चुनें", mr: "WorkSetu कसे वापरायचे ते निवडा" },
  worker: { en: "Worker", hi: "कामगार", mr: "कामगार" },
  contractor: { en: "Contractor", hi: "ठेकेदार", mr: "कंत्राटदार" },
  homeowner: { en: "Homeowner", hi: "गृहस्वामी", mr: "घरमालक" },
  workerDesc: { en: "Find jobs and build your work profile", hi: "नौकरी खोजें और कार्य प्रोफ़ाइल बनाएं", mr: "नोकऱ्या शोधा आणि कार्य प्रोफाइल तयार करा" },
  contractorDesc: { en: "Hire skilled workers for your projects", hi: "अपनी परियोजनाओं के लिए कुशल कामगार खोजें", mr: "तुमच्या प्रकल्पांसाठी कुशल कामगार शोधा" },
  homeownerDesc: { en: "Find trusted workers for home projects", hi: "घरेलू काम के लिए विश्वसनीय कामगार खोजें", mr: "घरगुती कामांसाठी विश्वासू कामगार शोधा" },

  // Navigation
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", mr: "डॅशबोर्ड" },
  jobs: { en: "Jobs", hi: "नौकरियां", mr: "नोकऱ्या" },
  myJobs: { en: "My Jobs", hi: "मेरी नौकरियां", mr: "माझ्या नोकऱ्या" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल", mr: "प्रोफाइल" },
  workHistory: { en: "Work History", hi: "कार्य इतिहास", mr: "कार्य इतिहास" },
  postJob: { en: "Post a Job", hi: "नौकरी पोस्ट करें", mr: "नोकरी पोस्ट करा" },
  applicants: { en: "Applicants", hi: "आवेदक", mr: "अर्जदार" },
  findWork: { en: "Find Work", hi: "काम खोजें", mr: "काम शोधा" },
  myWork: { en: "My Work", hi: "मेरा काम", mr: "माझे काम" },
  addWork: { en: "Add Work", hi: "काम जोड़ें", mr: "काम जोडा" },
  myPortfolio: { en: "My Portfolio", hi: "मेरा पोर्टफोलियो", mr: "माझे पोर्टफोलिओ" },
  findWorkers: { en: "Find Workers", hi: "कामगार खोजें", mr: "कामगार शोधा" },
  projects: { en: "Projects", hi: "परियोजनाएं", mr: "प्रकल्प" },
  hireWorkers: { en: "Hire Workers", hi: "कामगार काम पर रखें", mr: "कामगार कामावर घ्या" },
  wallet: { en: "Wallet", hi: "बटुआ", mr: "पाकीट" },
  finances: { en: "Earnings & Expenses", hi: "कमाई और खर्च", mr: "कमाई आणि खर्च" },

  // Landing page
  whyWorkSetu: { en: "Why", hi: "क्यों", mr: "का" },
  workersRegistered: { en: "Workers Registered", hi: "पंजीकृत कामगार", mr: "नोंदणीकृत कामगार" },
  jobsCompleted: { en: "Jobs Completed", hi: "पूर्ण नौकरियां", mr: "पूर्ण झालेल्या नोकऱ्या" },
  satisfactionRate: { en: "Satisfaction Rate", hi: "संतुष्टि दर", mr: "समाधान दर" },
  citiesCovered: { en: "Cities Covered", hi: "शहरों में उपलब्ध", mr: "शहरांमध्ये उपलब्ध" },
  verifiedProfiles: { en: "Verified Profiles", hi: "सत्यापित प्रोफ़ाइल", mr: "सत्यापित प्रोफाइल" },
  verifiedProfilesDesc: { en: "Every worker's history is verified and transparent", hi: "हर कामगार का इतिहास सत्यापित और पारदर्शी है", mr: "प्रत्येक कामगाराचा इतिहास सत्यापित आणि पारदर्शक आहे" },
  trustedNetwork: { en: "Trusted Network", hi: "विश्वसनीय नेटवर्क", mr: "विश्वासू नेटवर्क" },
  trustedNetworkDesc: { en: "Connect with reliable workers and contractors", hi: "विश्वसनीय कामगारों और ठेकेदारों से जुड़ें", mr: "विश्वासू कामगार आणि कंत्राटदारांशी जोडा" },
  ratingSystem: { en: "Rating System", hi: "रेटिंग प्रणाली", mr: "रेटिंग प्रणाली" },
  ratingSystemDesc: { en: "Quality assurance through community ratings", hi: "समुदाय रेटिंग के माध्यम से गुणवत्ता आश्वासन", mr: "समुदाय रेटिंगद्वारे गुणवत्ता हमी" },
  easyHiring: { en: "Easy Hiring", hi: "आसान भर्ती", mr: "सोपी भरती" },
  easyHiringDesc: { en: "Post a job and find the right worker in minutes", hi: "नौकरी पोस्ट करें और मिनटों में सही कामगार खोजें", mr: "नोकरी पोस्ट करा आणि मिनिटांत योग्य कामगार शोधा" },

  // Dashboard - Worker
  jobOpportunities: { en: "Job Opportunities", hi: "नौकरी के अवसर", mr: "नोकरीच्या संधी" },
  jobsLabel: { en: "Jobs", hi: "नौकरियां", mr: "नोकऱ्या" },
  rating: { en: "Rating", hi: "रेटिंग", mr: "रेटिंग" },
  badges: { en: "Badges", hi: "बैज", mr: "बॅज" },
  available: { en: "Available", hi: "उपलब्ध", mr: "उपलब्ध" },
  jobsCompletedLabel: { en: "jobs completed", hi: "नौकरियां पूरी कीं", mr: "नोकऱ्या पूर्ण केल्या" },
  posted: { en: "Posted", hi: "पोस्ट किया", mr: "पोस्ट केले" },

  // Dashboard - Client
  myJobListings: { en: "My Job Listings", hi: "मेरी नौकरी सूची", mr: "माझ्या नोकरी याद्या" },
  activeJobs: { en: "Active Jobs", hi: "सक्रिय नौकरियां", mr: "सक्रिय नोकऱ्या" },
  totalApplicants: { en: "Total Applicants", hi: "कुल आवेदक", mr: "एकूण अर्जदार" },
  completed: { en: "Completed", hi: "पूर्ण", mr: "पूर्ण" },

  // Badges
  topRated: { en: "Top Rated", hi: "शीर्ष रेटेड", mr: "टॉप रेटेड" },
  reliable: { en: "Reliable", hi: "विश्वसनीय", mr: "विश्वासू" },
  verified: { en: "Verified", hi: "सत्यापित", mr: "सत्यापित" },
  urgent: { en: "Urgent", hi: "अत्यावश्यक", mr: "तातडीचे" },

  // Job details
  kitchenRenovation: { en: "Kitchen Renovation - Bengaluru", hi: "किचन रिनोवेशन - बेंगलुरु", mr: "किचन रिनोवेशन - बेंगलुरु" },
  floorTiling: { en: "Floor Tiling - 3BHK Nashik", hi: "फ्लोर टाइलिंग - 3BHK नाशिक", mr: "फ्लोर टाइलिंग - 3BHK नाशिक" },
  compoundWall: { en: "Compound Wall - Mumbai Suburbs", hi: "कंपाउंड वॉल - मुंबई उपनगर", mr: "कंपाउंड वॉल - मुंबई उपनगर" },
  bathroomWaterproofing: { en: "Bathroom Waterproofing - Pune", hi: "बाथरूम वॉटरप्रूफिंग - पुणे", mr: "बाथरूम वॉटरप्रूफिंग - पुणे" },
  tiling: { en: "Tiling", hi: "टाइलिंग", mr: "टाइलिंग" },
  masonry: { en: "Masonry", hi: "चिनाई", mr: "बांधकाम" },
  construction: { en: "Construction", hi: "निर्माण", mr: "बांधकाम" },
  waterproofing: { en: "Waterproofing", hi: "वॉटरप्रूफिंग", mr: "वॉटरप्रूफिंग" },
  weeks: { en: "weeks", hi: "सप्ताह", mr: "आठवडे" },
  week: { en: "week", hi: "सप्ताह", mr: "आठवडा" },
  days: { en: "days", hi: "दिन", mr: "दिवस" },
  hoursAgo: { en: "hours ago", hi: "घंटे पहले", mr: "तासांपूर्वी" },
  dayAgo: { en: "day ago", hi: "दिन पहले", mr: "दिवसापूर्वी" },

  // Work history
  villaRenovation: { en: "Villa Renovation - Rajkot", hi: "विला नवीनीकरण - राजकोट", mr: "विला नूतनीकरण - राजकोट" },
  officeTiling: { en: "Office Tiling - Hyderabad", hi: "ऑफिस टाइलिंग - हैदराबाद", mr: "ऑफिस टाइलिंग - हैदराबाद" },
  bathroomRemodel: { en: "Bathroom Remodel - Nagpur", hi: "बाथरूम रीमॉडल - नागपुर", mr: "बाथरूम रिमॉडेल - नागपूर" },

  // Worker names & skills
  masonTileWorker: { en: "Mason & Tile Specialist", hi: "राजमिस्त्री और टाइल विशेषज्ञ", mr: "गवंडी आणि टाइल विशेषज्ञ" },
  mason: { en: "Senior Mason", hi: "वरिष्ठ राजमिस्त्री", mr: "वरिष्ठ गवंडी" },
  tileWorker: { en: "Precision Tile Worker", hi: "सटीक टाइल कामगार", mr: "अचूक टाइल कामगार" },
  plumber: { en: "Master Plumber", hi: "मास्टर प्लंबर", mr: "मास्टर प्लंबर" },
  electrician: { en: "Certified Electrician", hi: "प्रमाणित इलेक्ट्रीशियन", mr: "प्रमाणित इलेक्ट्रीशियन" },

  // New Features - Work Tracker & Portfolio
  workTracker: { en: "Work Tracker", hi: "कार्य ट्रैकर", mr: "कार्य ट्रॅकर" },
  day: { en: "Day", hi: "दिन", mr: "दिवस" },
  inProgress: { en: "In Progress", hi: "प्रगति में", mr: "प्रगतीपथावर" },
  completedShort: { en: "Done", hi: "पूर्ण", mr: "पूर्ण" },
  progressShort: { en: "Progress", hi: "प्रगति", mr: "प्रगती" },
  portfolio: { en: "My Portfolio", hi: "मेरा पोर्टफोलियो", mr: "माझे पोर्टफोलिओ" },
  viewWork: { en: "View Work", hi: "काम देखें", mr: "काम पहा" },

  // Job Posting Form
  jobTitleLabel: { en: "Job Title", hi: "नौकरी का शीर्षक", mr: "नोकरीचे शीर्षक" },
  jobTitlePlaceholder: { en: "e.g. 2BHK Painting", hi: "जैसे: 2BHK पेंटिंग", mr: "उदा. 2BHK पेंटिंग" },
  skillRequiredLabel: { en: "Skill Required", hi: "आवश्यक कौशल", mr: "आवश्यक कौशल्य" },
  skillPlaceholder: { en: "Select skill", hi: "कौशल चुनें", mr: "कौशल्य निवडा" },
  jobSuccess: { en: "Job posted successfully!", hi: "नौकरी सफलतापूर्वक पोस्ट की गई!", mr: "नोकरी यशस्वीरित्या पोस्ट केली!" },
  jobApplied: { en: "Job applied successfully", hi: "नौकरी के लिए सफलतापूर्वक आवेदन किया गया", mr: "नोकरीसाठी यशस्वीरित्या अर्ज केला" },
  employerNotified: { en: "The employer has been notified of your interest.", hi: "नियोक्ता को आपकी रुचि के बारे में सूचित कर दिया गया है।", mr: "तुमच्या आवडीबद्दल नियोक्त्याला कळवण्यात आले आहे." },
  hireSuccess: { en: "Hired successfully", hi: "सफलतापूर्वक भर्ती किया गया", mr: "यशस्वीरित्या कामावर घेतले" },
  profileUpdated: { en: "Profile updated!", hi: "प्रोफ़ाइल अपडेट की गई!", mr: "प्रोफाइल अपडेट केली!" },

  // Contractor Metrics
  workersHired: { en: "Workers Hired", hi: "कामगार भर्ती किए", mr: "कामगार कामावर घेतले" },
  projectDuration: { en: "Project Duration", hi: "परियोजना अवधि", mr: "प्रकल्प कालावधी" },
  workerManagement: { en: "Worker Management", hi: "कामगार प्रबंधन", mr: "कामगार व्यवस्थापन" },
  role: { en: "Role", hi: "भूमिका", mr: "भूमिका" },
  status: { en: "Status", hi: "स्थिति", mr: "स्थिती" },
  working: { en: "Working", hi: "कार्यरत", mr: "कार्यरत" },

  // Design switcher
  switchDesign: { en: "Switch Design", hi: "डिज़ाइन बदलें", mr: "डिझाइन बदला" },
  differentDesigns: { en: "3 completely different designs", hi: "3 पूरी तरह अलग डिज़ाइन", mr: "3 पूर्णपणे वेगळ्या डिझाइन" },

  // Misc
  noJobs: { en: "No jobs matching your skills yet", hi: "अभी आपके कौशल से मेल खाने वाली कोई नौकरी नहीं है", mr: "अद्याप तुमच्या कौशल्यांशी जुळणाऱ्या नोकऱ्या नाहीत" },
  noApplicants: { en: "Waiting for skilled workers to apply", hi: "कुशल कामगारों के आवेदन की प्रतीक्षा है", mr: "कुशल कामगारांच्या अर्जाची प्रतीक्षा आहे" },
  howItWorks: { en: "How It Works", hi: "यह कैसे काम करता है", mr: "हे कसे कार्य करते" },
  readyToStart: { en: "Ready to get started?", hi: "शुरू करने के लिए तैयार हैं?", mr: "सुरू करायला तयार आहात?" },

  // Finances page
  financesTitle: { en: "Earnings & Expenses", hi: "कमाई और खर्च", mr: "कमाई आणि खर्च" },
  financesDesc: { en: "Manage your finances and track your net income", hi: "अपने वित्त का प्रबंधन करें और अपनी शुद्ध आय ट्रैक करें", mr: "तुमचे वित्त व्यवस्थापित करा आणि तुमच्या निव्वळ उत्पन्नाचा मागोवा घ्या" },
  exportExcel: { en: "Export Excel", hi: "एक्सेल निर्यात करें", mr: "एक्सेल निर्यात करा" },
  totalEarnings: { en: "Total Earnings", hi: "कुल कमाई", mr: "एकूण कमाई" },
  totalExpenses: { en: "Total Expenses", hi: "कुल खर्च", mr: "एकूण खर्च" },
  netIncome: { en: "Net Income", hi: "शुद्ध आय", mr: "निव्वळ उत्पन्न" },
  recentEarnings: { en: "Recent Earnings", hi: "हाल की कमाई", mr: "अलीकडील कमाई" },
  recentEarningsDesc: { en: "Automatic earnings from completed jobs", hi: "पूर्ण नौकरियों से स्वचालित कमाई", mr: "पूर्ण झालेल्या नोकऱ्यांमधून स्वयंचलित कमाई" },
  noEarningsYet: { en: "No earnings recorded yet", hi: "अभी तक कोई कमाई दर्ज नहीं की गई है", mr: "अद्याप कोणतीही कमाई नोंदवली नाही" },
  expenses: { en: "Expenses", hi: "खर्च", mr: "खर्च" },
  expensesDesc: { en: "Track your tool purchases, travel, etc.", hi: "अपनी टूल खरीदारी, यात्रा आदि को ट्रैक करें", mr: "तुमच्या साधन खरेदी, प्रवास इत्यादींचा मागोवा घ्या" },
  addExpense: { en: "Add Expense", hi: "खर्च जोड़ें", mr: "खर्च जोडा" },
  recordNewExpense: { en: "Record New Expense", hi: "नया खर्च दर्ज करें", mr: "नवीन खर्च नोंदवा" },
  titleLabel: { en: "Title", hi: "शीर्षक", mr: "शीर्षक" },
  titlePlaceholder: { en: "e.g., New Cement Mixer", hi: "जैसे: नया सीमेंट मिक्सर", mr: "उदा. नवीन सिमेंट मिक्सर" },
  amountRs: { en: "Amount (₹)", hi: "राशि (₹)", mr: "रक्कम (₹)" },
  date: { en: "Date", hi: "तारीख", mr: "तारीख" },
  saveExpense: { en: "Save Expense", hi: "खर्च सहेजें", mr: "खर्च सेव्ह करा" },
  noExpensesYet: { en: "No expenses recorded yet", hi: "अभी तक कोई खर्च दर्ज नहीं किया गया है", mr: "अद्याप कोणताही खर्च नोंदवला नाही" },
};

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}>({ lang: "en", setLang: () => {}, t: (k) => k });

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");
  const t = (key: string) => translations[key]?.[lang] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
