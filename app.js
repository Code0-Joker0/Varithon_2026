/* =========================================================
   वारी सोबती — Vari Sobati
   Companion web app for Pandharpur Vari pilgrims
   (Meant to be opened via QR code printed on a walking stick)
   ========================================================= */

/* ---------------- i18n ---------------- */
const STRINGS = {
  mr: {
    appName:"वारी सोबती", appTagline:"वॉकिंग स्टिक साथी",
    navHome:"मुख्यपृष्ठ", navRoute:"मुक्काम", navHealth:"आरोग्य", navEmergency:"आपत्कालीन", navGuide:"सूचना",
    close:"बंद करा",
    aboutTitle:"वारी सोबती विषयी",
    aboutBody1:"हे संकेतस्थळ वारीत सहभागी वारकऱ्यांसाठी बनवलेल्या \"स्मार्ट काठी\" वरील QR कोडद्वारे उघडते.",
    aboutBody2:"हवामान, मुक्काम स्थळे, जवळील रुग्णालये आणि आपत्कालीन क्रमांक — सर्व एका ठिकाणी.",
    aboutBody3:"तारखा व मार्ग अंदाजे आहेत — अचूक माहितीसाठी स्थानिक देवस्थान समिती व पोलीस प्रशासनाशी संपर्क करा.",
    dayLabel:(d,t)=>`दिवस ${d}/${t}`,
    weatherTitle:"सध्याचे हवामान", loadingWeather:"हवामान माहिती आणत आहोत...",
    feelsLike:"जाणवते", humidity:"आर्द्रता", wind:"वारा",
    advisoryHot:"तापमान जास्त आहे. भरपूर पाणी प्या, डोक्यावर कापड/टोपी ठेवा, सावलीत विश्रांती घ्या.",
    advisoryRain:"पावसाची शक्यता आहे. रेनकोट/छत्री सोबत ठेवा, निसरड्या रस्त्यांवर काळजीपूर्वक चालावे.",
    advisoryNormal:"हवामान अनुकूल आहे. तरीही वेळोवेळी पाणी पीत राहा.",
    todaysHalt:"आजचा मुक्काम", nextHalt:"पुढील मुक्काम",
    getDirections:"दिशादर्शन", callHelp:"मदतीसाठी कॉल",
    quickActions:"त्वरित सेवा", findHospital:"जवळील रुग्णालय", emergencyNum:"आपत्कालीन क्रमांक",
    routeTitle:"पालखी मार्ग व मुक्काम", dnyaneshwar:"ज्ञानेश्वर पालखी", tukaram:"तुकाराम पालखी",
    today:"आज", done:"पूर्ण", upcoming:"पुढे",
    routeDisclaimer:"⚠️ तारखा 2026 च्या घोषित वेळापत्रकावर आधारित अंदाजे आहेत. काही दुय्यम मुक्काम स्थळांचे स्थान अंदाजे आहे. अद्ययावत व अचूक वेळापत्रकासाठी संबंधित देवस्थान समिती/पालखी सोहळा प्रमुखांशी संपर्क साधा.",
    healthTitle:"जवळील आरोग्य सुविधा", locating:"तुमचे स्थान शोधत आहोत...",
    noLocation:"स्थान उपलब्ध नाही. कृपया लोकेशन परवानगी द्या किंवा जवळचे मुक्काम स्थळ निवडा.",
    enableLocation:"लोकेशन सुरू करा", tryAgain:"पुन्हा प्रयत्न करा",
    call:"कॉल", directions:"दिशा", away:"अंतरावर",
    noFacilities:"जवळपास सुविधा सापडली नाही. आपत्कालीन क्रमांकावर संपर्क करा.",
    manualPick:"किंवा मुक्काम स्थळ निवडा:",
    emergencyTitle:"आपत्कालीन क्रमांक", emergencyNote:"बटण दाबून थेट कॉल करा",
    em_police:"पोलीस / सर्व आपत्कालीन", em_ambulance:"रुग्णवाहिका", em_fire:"अग्निशमन दल",
    em_disaster:"आपत्ती व्यवस्थापन", em_women:"महिला हेल्पलाईन",
    localControlRoom:"स्थानिक वारी नियंत्रण कक्ष", localControlNote:"संयोजकांनी हा क्रमांक इथे नोंदवावा",
    guideTitle:"आरोग्य मार्गदर्शक सूचना",
    g1t:"पुरेसे पाणी प्या", g1b:"दर एक-दोन तासांनी थोडे थोडे पाणी प्या. तहान लागण्याची वाट पाहू नका. उन्हात चालताना ORS/लिंबू-पाणी सोबत ठेवा.",
    g2t:"पायांची काळजी घ्या", g2b:"आरामदायक, चांगल्या आकाराच्या चपला/बूट वापरा. फोड आल्यास लगेच स्वच्छ करून मलमपट्टी करा. ओले सॉक्स लवकर बदला.",
    g3t:"उन्हापासून बचाव", g3b:"डोक्यावर टोपी/ओढणी ठेवा, शक्य असल्यास सकाळी लवकर व संध्याकाळी चालण्याचे नियोजन करा. चक्कर किंवा मळमळ जाणवल्यास लगेच सावलीत बसा.",
    g4t:"नियमित औषधे विसरू नका", g4b:"बीपी, मधुमेह, हृदयविकार यांची औषधे वेळेवर घ्या. औषधांची यादी व डॉक्टरांचा संपर्क सोबत ठेवा.",
    g5t:"अन्न व स्वच्छता", g5b:"शक्यतो गरम व ताजे अन्न खा. रस्त्यावरील उघडे अन्न व दूषित पाणी टाळा. जेवणापूर्वी हात धुवा.",
    g6t:"थकवा व विश्रांती", g6b:"शरीराचे ऐका — जास्त थकवा जाणवल्यास मुक्काम स्थळी आधी विश्रांती घ्या. रात्री पुरेशी झोप घेण्याचा प्रयत्न करा.",
    g7t:"गर्दीत हरवल्यास काय करावे", g7b:"जवळच्या सेवा शिबिर/पोलीस मदत केंद्राकडे जा. मुलांच्या व वृद्धांच्या खिशात नाव-मोबाईल नंबर असलेली चिठ्ठी ठेवा.",
    g8t:"साप/किडे चावल्यास", g8b:"घाबरू नका, ती जागा हलवू नका, दागिने/घट्ट कपडे काढा, ताबडतोब जवळच्या वैद्यकीय शिबिरात किंवा 108 वर संपर्क करा.",
  },
  hi: {
    appName:"वारी सोबती", appTagline:"वॉकिंग स्टिक साथी",
    navHome:"मुख्य पृष्ठ", navRoute:"मुक्काम", navHealth:"स्वास्थ्य", navEmergency:"आपातकाल", navGuide:"सुझाव",
    close:"बंद करें",
    aboutTitle:"वारी सोबती के बारे में",
    aboutBody1:"यह वेबसाइट वारी में शामिल वारकरियों के लिए बनाई गई \"स्मार्ट काठी\" (चलने की छड़ी) पर लगे QR कोड से खुलती है।",
    aboutBody2:"मौसम, मुक्काम स्थान, नज़दीकी अस्पताल और आपातकालीन नंबर — सब एक जगह।",
    aboutBody3:"तारीखें व मार्ग अनुमानित हैं — सटीक जानकारी के लिए स्थानीय देवस्थान समिति व पुलिस प्रशासन से संपर्क करें।",
    dayLabel:(d,t)=>`दिन ${d}/${t}`,
    weatherTitle:"वर्तमान मौसम", loadingWeather:"मौसम जानकारी ला रहे हैं...",
    feelsLike:"अनुभव", humidity:"नमी", wind:"हवा",
    advisoryHot:"तापमान अधिक है। भरपूर पानी पिएं, सिर पर कपड़ा/टोपी रखें, छाया में आराम करें।",
    advisoryRain:"बारिश की संभावना है। रेनकोट/छाता साथ रखें, फिसलन वाली सड़कों पर सावधानी से चलें।",
    advisoryNormal:"मौसम अनुकूल है। फिर भी समय-समय पर पानी पीते रहें।",
    todaysHalt:"आज का मुक्काम", nextHalt:"आगामी मुक्काम",
    getDirections:"दिशा दिखाएं", callHelp:"सहायता हेतु कॉल",
    quickActions:"त्वरित सेवाएं", findHospital:"नज़दीकी अस्पताल", emergencyNum:"आपातकालीन नंबर",
    routeTitle:"पालखी मार्ग व मुक्काम", dnyaneshwar:"ज्ञानेश्वर पालखी", tukaram:"तुकाराम पालखी",
    today:"आज", done:"पूर्ण", upcoming:"आगे",
    routeDisclaimer:"⚠️ तारीखें 2026 के घोषित कार्यक्रम पर आधारित अनुमानित हैं। कुछ छोटे मुक्काम स्थलों का स्थान अनुमानित है। सटीक व अद्यतन जानकारी के लिए संबंधित देवस्थान समिति/पालखी संयोजकों से संपर्क करें।",
    healthTitle:"नज़दीकी स्वास्थ्य सुविधाएं", locating:"आपका स्थान खोजा जा रहा है...",
    noLocation:"स्थान उपलब्ध नहीं है। कृपया लोकेशन अनुमति दें या नज़दीकी मुक्काम स्थान चुनें।",
    enableLocation:"लोकेशन सक्षम करें", tryAgain:"पुनः प्रयास करें",
    call:"कॉल", directions:"दिशा", away:"दूर",
    noFacilities:"आसपास सुविधा नहीं मिली। कृपया आपातकालीन नंबर पर संपर्क करें।",
    manualPick:"या मुक्काम स्थान चुनें:",
    emergencyTitle:"आपातकालीन नंबर", emergencyNote:"बटन दबाकर सीधे कॉल करें",
    em_police:"पुलिस / सभी आपातकाल", em_ambulance:"एम्बुलेंस", em_fire:"अग्निशमन दल",
    em_disaster:"आपदा प्रबंधन", em_women:"महिला हेल्पलाइन",
    localControlRoom:"स्थानीय वारी नियंत्रण कक्ष", localControlNote:"आयोजकों द्वारा यहां नंबर दर्ज किया जाए",
    guideTitle:"स्वास्थ्य मार्गदर्शक सुझाव",
    g1t:"पर्याप्त पानी पिएं", g1b:"हर एक-दो घंटे में थोड़ा-थोड़ा पानी पिएं। प्यास लगने का इंतज़ार न करें। धूप में चलते समय ORS/नींबू-पानी साथ रखें।",
    g2t:"पैरों का ध्यान रखें", g2b:"आरामदायक, सही आकार के जूते/चप्पल पहनें। छाले होने पर तुरंत साफ करके पट्टी करें। गीले मोज़े जल्दी बदलें।",
    g3t:"धूप से बचाव", g3b:"सिर पर टोपी/दुपट्टा रखें, संभव हो तो सुबह जल्दी व शाम को चलने की योजना बनाएं। चक्कर या घबराहट महसूस हो तो तुरंत छाया में बैठें।",
    g4t:"नियमित दवाएं न भूलें", g4b:"बीपी, डायबिटीज़, हृदय रोग की दवाएं समय पर लें। दवाओं की सूची व डॉक्टर का संपर्क साथ रखें।",
    g5t:"भोजन व स्वच्छता", g5b:"संभवतः गरम व ताज़ा भोजन करें। खुले में रखा भोजन व दूषित पानी से बचें। भोजन से पहले हाथ धोएं।",
    g6t:"थकान व आराम", g6b:"शरीर की सुनें — अधिक थकान महसूस होने पर मुक्काम स्थान पर पहले आराम करें। रात में पर्याप्त नींद लेने का प्रयास करें।",
    g7t:"भीड़ में खो जाने पर क्या करें", g7b:"नज़दीकी सेवा शिविर/पुलिस सहायता केंद्र जाएं। बच्चों व बुज़ुर्गों की जेब में नाम-मोबाइल नंबर वाली चिट रखें।",
    g8t:"सांप/कीड़े के काटने पर", g8b:"घबराएं नहीं, वह जगह न हिलाएं, गहने/तंग कपड़े हटाएं, तुरंत नज़दीकी मेडिकल शिविर या 108 पर संपर्क करें।",
  },
  en: {
    appName:"Vari Sobati", appTagline:"walking-stick companion",
    navHome:"Home", navRoute:"Halts", navHealth:"Health", navEmergency:"Emergency", navGuide:"Guidelines",
    close:"Close",
    aboutTitle:"About Vari Sobati",
    aboutBody1:"This site opens via the QR code printed on the \"smart walking stick\" made for Wari pilgrims.",
    aboutBody2:"Weather, halt stations, nearby hospitals and emergency numbers — all in one place.",
    aboutBody3:"Dates and locations are approximate — please confirm with the local Devasthan committee and police administration for exact details.",
    dayLabel:(d,t)=>`Day ${d} of ${t}`,
    weatherTitle:"Current weather", loadingWeather:"Fetching weather...",
    feelsLike:"Feels like", humidity:"Humidity", wind:"Wind",
    advisoryHot:"It's hot. Drink water often, cover your head, rest in shade.",
    advisoryRain:"Rain likely. Carry a raincoat/umbrella and walk carefully on slippery roads.",
    advisoryNormal:"Weather looks comfortable. Keep sipping water regularly.",
    todaysHalt:"Today's halt", nextHalt:"Next halt",
    getDirections:"Directions", callHelp:"Call for help",
    quickActions:"Quick actions", findHospital:"Find hospital", emergencyNum:"Emergency numbers",
    routeTitle:"Palkhi route & halts", dnyaneshwar:"Dnyaneshwar Palkhi", tukaram:"Tukaram Palkhi",
    today:"Today", done:"Done", upcoming:"Upcoming",
    routeDisclaimer:"⚠️ Dates are approximate, based on the announced 2026 schedule. Some minor-halt coordinates are estimated. Please confirm the exact, updated schedule with the respective Devasthan committee / palkhi organisers.",
    healthTitle:"Nearby health facilities", locating:"Finding your location...",
    noLocation:"Location not available. Please allow location access or pick a nearby halt.",
    enableLocation:"Enable location", tryAgain:"Try again",
    call:"Call", directions:"Directions", away:"away",
    noFacilities:"No facility found nearby. Please contact an emergency number instead.",
    manualPick:"Or pick a halt station:",
    emergencyTitle:"Emergency numbers", emergencyNote:"Tap a button to call directly",
    em_police:"Police / All emergencies", em_ambulance:"Ambulance", em_fire:"Fire brigade",
    em_disaster:"Disaster management", em_women:"Women's helpline",
    localControlRoom:"Local Wari control room", localControlNote:"Organisers: add this number here",
    guideTitle:"Health guidelines",
    g1t:"Drink water regularly", g1b:"Sip small amounts of water every 1-2 hours. Don't wait until you feel thirsty. Carry ORS or lemon water while walking in the sun.",
    g2t:"Take care of your feet", g2b:"Wear comfortable, well-fitting footwear. Clean and bandage blisters right away. Change wet socks quickly.",
    g3t:"Protect against the sun", g3b:"Cover your head with a cap or cloth; plan walking for early morning/evening where possible. Sit in shade immediately if you feel dizzy or nauseous.",
    g4t:"Don't skip regular medicines", g4b:"Take BP, diabetes and heart medicines on time. Carry a medicine list and your doctor's contact.",
    g5t:"Food & hygiene", g5b:"Prefer hot, fresh food. Avoid exposed roadside food and untreated water. Wash hands before eating.",
    g6t:"Fatigue & rest", g6b:"Listen to your body — rest at the halt earlier if very tired. Try to get adequate sleep at night.",
    g7t:"If separated in the crowd", g7b:"Go to the nearest seva camp or police help booth. Keep a note with name and mobile number in the pockets of children and elders.",
    g8t:"Snake or insect bite", g8b:"Stay calm, don't move the affected area, remove jewellery/tight clothing, and contact the nearest medical camp or 108 immediately.",
  }
};

let currentLang = "mr";

/* ---------------- Emergency numbers (India / Maharashtra) ---------------- */
const EMERGENCY_NUMBERS = [
  { key:"em_police", number:"112" },
  { key:"em_ambulance", number:"108" },
  { key:"em_fire", number:"101" },
  { key:"em_disaster", number:"1077" },
  { key:"em_women", number:"1091" },
];

/* ---------------- Palkhi route data (2026, sourced from announced schedules) ---------------- */
/* Dates are the organisers' announced tentative schedule; a few minor-village
   coordinates are approximated and should be GPS-verified before final deployment. */
const ROUTES = {
  dnyaneshwar: {
    label:{mr:"ज्ञानेश्वर पालखी", hi:"ज्ञानेश्वर पालखी", en:"Dnyaneshwar Palkhi"},
    halts: [
      {name:{mr:"आळंदी", hi:"आळंदी", en:"Alandi"}, date:"2026-07-08", lat:18.6805, lon:73.9040},
      {name:{mr:"पुणे", hi:"पुणे", en:"Pune"}, date:"2026-07-09", lat:18.5204, lon:73.8567},
      {name:{mr:"सासवड", hi:"सासवड", en:"Saswad"}, date:"2026-07-10", lat:18.3401, lon:74.0333},
      {name:{mr:"जेजुरी", hi:"जेजुरी", en:"Jejuri"}, date:"2026-07-11", lat:18.2739, lon:74.1602},
      {name:{mr:"वाल्हे", hi:"वाल्हे", en:"Walhe"}, date:"2026-07-12", lat:18.1667, lon:73.9833},
      {name:{mr:"लोणंद", hi:"लोणंद", en:"Lonand"}, date:"2026-07-13", lat:17.9333, lon:73.9333},
      {name:{mr:"तरडगाव", hi:"तरडगाव", en:"Taradgaon"}, date:"2026-07-14", lat:17.8930, lon:74.2480},
      {name:{mr:"फलटण", hi:"फलटण", en:"Phaltan"}, date:"2026-07-15", lat:17.9922, lon:74.4297},
      {name:{mr:"बरड", hi:"बरड", en:"Barad"}, date:"2026-07-16", lat:17.8800, lon:74.6200},
      {name:{mr:"नातेपुते", hi:"नातेपुते", en:"Natepute"}, date:"2026-07-17", lat:17.9430, lon:74.9330},
      {name:{mr:"माळशिरस", hi:"माळशिरस", en:"Malshiras"}, date:"2026-07-18", lat:17.9078, lon:74.9463},
      {name:{mr:"वेळापूर", hi:"वेळापूर", en:"Velapur"}, date:"2026-07-19", lat:17.7460, lon:75.1520},
      {name:{mr:"भंडीशेगाव", hi:"भंडीशेगाव", en:"Bhandishegaon"}, date:"2026-07-20", lat:17.7200, lon:75.2600},
      {name:{mr:"वाखरी", hi:"वाखरी", en:"Wakhari"}, date:"2026-07-21", lat:17.6980, lon:75.3400},
      {name:{mr:"पंढरपूर", hi:"पंढरपूर", en:"Pandharpur"}, date:"2026-07-24", lat:17.6792, lon:75.3320},
    ]
  },
  tukaram: {
    label:{mr:"तुकाराम पालखी", hi:"तुकाराम पालखी", en:"Tukaram Palkhi"},
    halts: [
      {name:{mr:"देहू", hi:"देहू", en:"Dehu"}, date:"2026-07-07", lat:18.6689, lon:73.7645},
      {name:{mr:"आकुर्डी", hi:"आकुर्डी", en:"Akurdi"}, date:"2026-07-08", lat:18.6484, lon:73.7654},
      {name:{mr:"पुणे (नाना पेठ)", hi:"पुणे (नाना पेठ)", en:"Pune (Nana Peth)"}, date:"2026-07-09", lat:18.5150, lon:73.8600},
      {name:{mr:"लोणी काळभोर", hi:"लोणी काळभोर", en:"Loni Kalbhor"}, date:"2026-07-11", lat:18.4667, lon:73.9333},
      {name:{mr:"यवत", hi:"यवत", en:"Yavat"}, date:"2026-07-12", lat:18.3830, lon:74.1500},
      {name:{mr:"वरवंड", hi:"वरवंड", en:"Varvand"}, date:"2026-07-13", lat:18.3000, lon:74.3500},
      {name:{mr:"उंडवडी गवळ्याची", hi:"उंडवडी गवळ्याची", en:"Undavadi Gavalyachi"}, date:"2026-07-14", lat:18.2200, lon:74.4500},
      {name:{mr:"बारामती", hi:"बारामती", en:"Baramati"}, date:"2026-07-15", lat:18.1514, lon:74.5815},
      {name:{mr:"इंदापूर", hi:"इंदापूर", en:"Indapur"}, date:"2026-07-17", lat:18.1167, lon:75.0167},
      {name:{mr:"आकलूज", hi:"आकलूज", en:"Akluj"}, date:"2026-07-18", lat:17.8833, lon:75.0167},
      {name:{mr:"बोरगाव", hi:"बोरगाव", en:"Borgaon"}, date:"2026-07-19", lat:17.8000, lon:75.1800},
      {name:{mr:"पिराची कुरोली", hi:"पिराची कुरोली", en:"Pirachi Kuroli"}, date:"2026-07-20", lat:17.7300, lon:75.2500},
      {name:{mr:"वाखरी", hi:"वाखरी", en:"Wakhari"}, date:"2026-07-21", lat:17.6980, lon:75.3400},
      {name:{mr:"पंढरपूर", hi:"पंढरपूर", en:"Pandharpur"}, date:"2026-07-24", lat:17.6792, lon:75.3320},
    ]
  }
};
const JOURNEY_START = "2026-07-07";
const JOURNEY_END = "2026-07-24";

let currentPalkhi = "dnyaneshwar";

/* ---------------- Guideline icons ---------------- */
const GUIDE_ICONS = ["💧","🦶","☀️","💊","🍲","🛌","🧭","🐍"];
const GUIDE_KEYS = [1,2,3,4,5,6,7,8];

/* ---------------- Utilities ---------------- */
function t(key){
  const v = STRINGS[currentLang][key];
  return v !== undefined ? v : STRINGS.mr[key];
}
function daysBetween(a,b){ return Math.round((new Date(b) - new Date(a)) / 86400000); }
function todayISO(){
  // Demo apps like this run year-round; if outside the live pilgrimage window
  // we still show the schedule, anchored to "today" for date math.
  return new Date().toISOString().slice(0,10);
}
function haversine(lat1,lon1,lat2,lon2){
  const R=6371, toRad=d=>d*Math.PI/180;
  const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
  const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}
function findCurrentHaltIndex(halts){
  const today = todayISO();
  let idx = 0;
  for(let i=0;i<halts.length;i++){
    if(halts[i].date <= today) idx = i;
  }
  // if today's date is before the journey starts or after it ends, just show nearest
  return idx;
}

/* =========================================================
   RENDER: HOME
   ========================================================= */
let userLoc = null; // {lat, lon}

function renderHome(){
  const el = document.getElementById("panel-home");
  const activeRoute = ROUTES[currentPalkhi];
  const idx = findCurrentHaltIndex(activeRoute.halts);
  const halt = activeRoute.halts[idx];
  const next = activeRoute.halts[idx+1];

  el.innerHTML = `
    <div class="card" id="weatherCard">
      <div class="card-title"><span class="icon">⛅</span><span>${t('weatherTitle')}</span></div>
      <div class="skeleton">${t('loadingWeather')}</div>
    </div>

    <div class="card">
      <div class="eyebrow">${t('todaysHalt')}</div>
      <div class="halt-row">
        <div class="halt-badge">${idx+1}</div>
        <div>
          <div class="halt-name">${halt.name[currentLang] || halt.name.mr}</div>
          <div class="halt-meta">${activeRoute.label[currentLang]} · ${formatDate(halt.date)}</div>
        </div>
      </div>
      ${next ? `<div class="muted" style="margin-top:10px">${t('nextHalt')}: <b>${next.name[currentLang]||next.name.mr}</b> (${formatDate(next.date)})</div>` : ""}
      <div class="btn-row">
        <a class="btn" href="https://www.google.com/maps/search/?api=1&query=${halt.lat},${halt.lon}" target="_blank" rel="noopener">📍 ${t('getDirections')}</a>
        <button class="btn secondary" onclick="switchTab('route')">🚩 ${t('routeTitle')}</button>
      </div>
    </div>

    <div class="section-title">${t('quickActions')}</div>
    <div class="btn-row">
      <button class="btn secondary" onclick="switchTab('health')">➕ ${t('findHospital')}</button>
      <button class="btn alert" onclick="switchTab('emergency')">📞 ${t('emergencyNum')}</button>
    </div>
  `;
  loadWeather(halt.lat, halt.lon);
}

function formatDate(iso){
  const d = new Date(iso+"T00:00:00");
  const months = {
    mr:["जाने","फेब्रु","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टें","ऑक्टो","नोव्हें","डिसें"],
    hi:["जन","फर","मार्च","अप्रैल","मई","जून","जुला","अग","सित","अक्टू","नव","दिस"],
    en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  };
  const m = months[currentLang] || months.mr;
  return `${d.getDate()} ${m[d.getMonth()]}`;
}

async function loadWeather(lat, lon){
  const card = document.getElementById("weatherCard");
  try{
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,weather_code&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const c = data.current;
    const {emoji, desc} = weatherCodeToEmoji(c.weather_code, currentLang);
    let advisoryClass = "advisory", advisoryText = t('advisoryNormal');
    if(c.temperature_2m >= 33){ advisoryText = t('advisoryHot'); advisoryClass += " warn"; }
    else if(c.precipitation > 0.2){ advisoryText = t('advisoryRain'); }

    card.innerHTML = `
      <div class="card-title"><span class="icon">⛅</span><span>${t('weatherTitle')}</span></div>
      <div class="weather-hero">
        <div>
          <div class="weather-temp">${Math.round(c.temperature_2m)}°</div>
          <div class="weather-desc">${desc}</div>
        </div>
        <div class="weather-emoji">${emoji}</div>
      </div>
      <div class="weather-grid">
        <div class="weather-chip"><div class="val">${Math.round(c.apparent_temperature)}°</div><div class="lbl">${t('feelsLike')}</div></div>
        <div class="weather-chip"><div class="val">${Math.round(c.relative_humidity_2m)}%</div><div class="lbl">${t('humidity')}</div></div>
        <div class="weather-chip"><div class="val">${Math.round(c.wind_speed_10m)}km/h</div><div class="lbl">${t('wind')}</div></div>
      </div>
      <div class="${advisoryClass}">${advisoryText}</div>
    `;
  }catch(e){
    card.innerHTML = `
      <div class="card-title"><span class="icon">⛅</span><span>${t('weatherTitle')}</span></div>
      <div class="muted">${t('noLocation')}</div>
    `;
  }
}

function weatherCodeToEmoji(code, lang){
  const map = {
    mr:{clear:"निरभ्र आकाश", cloud:"ढगाळ", rain:"पाऊस", storm:"वादळी पाऊस", fog:"धुके"},
    hi:{clear:"साफ आसमान", cloud:"बादल", rain:"बारिश", storm:"तूफानी बारिश", fog:"कोहरा"},
    en:{clear:"Clear sky", cloud:"Cloudy", rain:"Rain", storm:"Thunderstorm", fog:"Fog"}
  };
  const d = map[lang] || map.mr;
  if(code===0) return {emoji:"☀️", desc:d.clear};
  if(code<=3) return {emoji:"⛅", desc:d.cloud};
  if(code<=49) return {emoji:"🌫️", desc:d.fog};
  if(code<=67) return {emoji:"🌦️", desc:d.rain};
  if(code<=82) return {emoji:"🌧️", desc:d.rain};
  if(code<=99) return {emoji:"⛈️", desc:d.storm};
  return {emoji:"⛅", desc:d.cloud};
}

/* =========================================================
   RENDER: ROUTE
   ========================================================= */
function renderRoute(){
  const el = document.getElementById("panel-route");
  const route = ROUTES[currentPalkhi];
  const idx = findCurrentHaltIndex(route.halts);

  let itemsHtml = route.halts.map((h,i)=>{
    let stateClass = "";
    let tag = "";
    if(i < idx) { stateClass = "past"; tag = `<span class="tl-tag">${t('done')}</span>`; }
    else if(i === idx) { stateClass = "today"; tag = `<span class="tl-tag">${t('today')}</span>`; }
    return `
      <div class="tl-item ${stateClass}">
        <div class="tl-dot"></div>
        <div class="tl-card">
          <div class="tl-top">
            <span class="tl-name">${h.name[currentLang]||h.name.mr}</span>
            <span class="tl-date">${formatDate(h.date)}</span>
          </div>
          ${tag}
        </div>
      </div>
    `;
  }).join("");

  el.innerHTML = `
    <div class="card-title" style="color:var(--text-on-stone)"><span class="icon">🚩</span><span>${t('routeTitle')}</span></div>
    <div class="palkhi-switch">
      <button class="${currentPalkhi==='dnyaneshwar'?'active':''}" data-palkhi="dnyaneshwar">${t('dnyaneshwar')}</button>
      <button class="${currentPalkhi==='tukaram'?'active':''}" data-palkhi="tukaram">${t('tukaram')}</button>
    </div>
    <div class="disclaimer">${t('routeDisclaimer')}</div>
    <div class="timeline">${itemsHtml}</div>
  `;

  el.querySelectorAll("[data-palkhi]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      currentPalkhi = btn.dataset.palkhi;
      renderRoute();
      renderHome();
      updateWariPath();
    });
  });
}

/* =========================================================
   RENDER: HEALTH (nearby facilities via Overpass/OSM)
   ========================================================= */
function renderHealth(){
  const el = document.getElementById("panel-health");
  el.innerHTML = `
    <div class="card-title" style="color:var(--text-on-stone)"><span class="icon">➕</span><span>${t('healthTitle')}</span></div>
    <div class="card" id="facCard">
      <div class="skeleton">${t('locating')}</div>
    </div>
  `;
  locateAndFetchFacilities();
}

function locateAndFetchFacilities(){
  const card = document.getElementById("facCard");
  if(!navigator.geolocation){
    showManualHaltPicker(card);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos=>{
      userLoc = {lat:pos.coords.latitude, lon:pos.coords.longitude};
      fetchFacilities(userLoc.lat, userLoc.lon, card);
    },
    err=>{ showManualHaltPicker(card); },
    {timeout:8000}
  );
}

function showManualHaltPicker(card){
  const route = ROUTES[currentPalkhi];
  const opts = route.halts.map((h,i)=>`<option value="${i}">${h.name[currentLang]||h.name.mr}</option>`).join("");
  card.innerHTML = `
    <div class="muted">${t('noLocation')}</div>
    <div class="btn-row">
      <button class="btn" id="retryLocBtn">📍 ${t('tryAgain')}</button>
    </div>
    <div class="muted" style="margin-top:12px">${t('manualPick')}</div>
    <select id="haltPicker" style="width:100%;padding:10px;margin-top:6px;border-radius:10px;border:1px solid #ccc;font-family:inherit;">
      ${opts}
    </select>
  `;
  document.getElementById("retryLocBtn").addEventListener("click", locateAndFetchFacilities);
  document.getElementById("haltPicker").addEventListener("change", (e)=>{
    const h = route.halts[e.target.value];
    fetchFacilities(h.lat, h.lon, card);
  });
}

async function fetchFacilities(lat, lon, card){
  card.innerHTML = `<div class="skeleton">${t('locating')}</div>`;
  const radius = 15000;
  const query = `[out:json][timeout:15];(node["amenity"~"hospital|clinic|pharmacy"](around:${radius},${lat},${lon});way["amenity"~"hospital|clinic|pharmacy"](around:${radius},${lat},${lon}););out center 20;`;
  try{
    const res = await fetch("https://overpass-api.de/api/interpreter?data="+encodeURIComponent(query));
    const data = await res.json();
    const items = (data.elements||[]).map(elm=>{
      const elat = elm.lat || (elm.center && elm.center.lat);
      const elon = elm.lon || (elm.center && elm.center.lon);
      if(!elat) return null;
      return {
        name: (elm.tags && (elm.tags.name || elm.tags["name:mr"])) || (elm.tags && elm.tags.amenity==="pharmacy" ? "Pharmacy" : "Health facility"),
        type: elm.tags && elm.tags.amenity,
        phone: elm.tags && (elm.tags.phone || elm.tags["contact:phone"]),
        lat: elat, lon: elon,
        dist: haversine(lat,lon,elat,elon)
      };
    }).filter(Boolean).sort((a,b)=>a.dist-b.dist).slice(0,12);

    if(items.length===0){
      card.innerHTML = `<div class="muted">${t('noFacilities')}</div>`;
      return;
    }
    card.innerHTML = items.map(f=>`
      <div class="fac-item">
        <div>
          <div class="fac-name">${escapeHtml(f.name)}</div>
          <div class="fac-meta">${f.type||''}</div>
        </div>
        <span class="fac-dist">${f.dist.toFixed(1)}km</span>
        <div class="fac-actions">
          ${f.phone?`<a class="icon-btn" href="tel:${f.phone}">📞</a>`:''}
          <a class="icon-btn" href="https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lon}" target="_blank" rel="noopener">📍</a>
        </div>
      </div>
    `).join("");
  }catch(e){
    card.innerHTML = `<div class="muted">${t('noFacilities')}</div>`;
  }
}

function escapeHtml(s){
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

/* =========================================================
   RENDER: EMERGENCY
   ========================================================= */
function renderEmergency(){
  const el = document.getElementById("panel-emergency");
  el.innerHTML = `
    <div class="card-title" style="color:var(--text-on-stone)"><span class="icon">📞</span><span>${t('emergencyTitle')}</span></div>
    <div class="muted" style="color:var(--text-dim);margin-bottom:12px">${t('emergencyNote')}</div>
    <div class="card">
      ${EMERGENCY_NUMBERS.map(e=>`
        <div class="em-item">
          <div class="em-num">${e.number}</div>
          <div>
            <div class="em-label">${t(e.key)}</div>
          </div>
          <a class="call-btn" href="tel:${e.number}">📞</a>
        </div>
      `).join("")}
    </div>
    <div class="card">
      <div class="em-item" style="border-bottom:none">
        <div class="em-num" style="font-size:14px;color:var(--chandrabhaga)">＋</div>
        <div>
          <div class="em-label">${t('localControlRoom')}</div>
          <div class="em-sub">${t('localControlNote')}</div>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   RENDER: GUIDELINES
   ========================================================= */
function renderGuide(){
  const el = document.getElementById("panel-guide");
  el.innerHTML = `
    <div class="card-title" style="color:var(--text-on-stone)"><span class="icon">📖</span><span>${t('guideTitle')}</span></div>
    ${GUIDE_KEYS.map((k,i)=>`
      <div class="guide-item" data-idx="${i}">
        <div class="guide-head">
          <span class="icon">${GUIDE_ICONS[i]}</span>
          <span class="title">${t('g'+k+'t')}</span>
          <span class="chev">▾</span>
        </div>
        <div class="guide-body">${t('g'+k+'b')}</div>
      </div>
    `).join("")}
  `;
  el.querySelectorAll(".guide-item").forEach(item=>{
    item.querySelector(".guide-head").addEventListener("click", ()=>{
      item.classList.toggle("open");
    });
  });
}

/* =========================================================
   APP CONTROLLER
   ========================================================= */
let currentTab = "home";

function switchTab(tabName){
  currentTab = tabName;
  document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
  document.getElementById("panel-"+tabName).classList.add("active");
  document.querySelectorAll(".navbtn").forEach(b=>b.classList.toggle("active", b.dataset.tab===tabName));
  renderCurrentTab();
  document.getElementById("content").scrollTop = 0;
}

function renderCurrentTab(){
  if(currentTab==="home") renderHome();
  else if(currentTab==="route") renderRoute();
  else if(currentTab==="health") renderHealth();
  else if(currentTab==="emergency") renderEmergency();
  else if(currentTab==="guide") renderGuide();
}

function setLanguage(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active", b.dataset.lang===lang));
  document.querySelectorAll("[data-i18n]").forEach(elm=>{
    const key = elm.dataset.i18n;
    const val = t(key);
    if(typeof val === "string") elm.textContent = val;
  });
  updateWariPath();
  renderCurrentTab();
}

function updateWariPath(){
  const halts = ROUTES[currentPalkhi].halts;
  const total = daysBetween(JOURNEY_START, JOURNEY_END) + 1;
  const idx = findCurrentHaltIndex(halts);
  let dayNum = daysBetween(JOURNEY_START, halts[idx].date) + 1;
  dayNum = Math.max(1, Math.min(dayNum, total));
  const pct = Math.round((dayNum-1)/(total-1)*100);
  document.getElementById("pathFill").style.width = pct+"%";
  document.getElementById("pathMarker").style.left = pct+"%";
  document.getElementById("dayLabel").textContent = t('dayLabel')(dayNum, total);
}

/* Nav + lang + modal wiring */
document.querySelectorAll(".navbtn").forEach(btn=>{
  btn.addEventListener("click", ()=>switchTab(btn.dataset.tab));
});
document.querySelectorAll(".lang-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>setLanguage(btn.dataset.lang));
});
document.getElementById("infoBtn").addEventListener("click", ()=>{
  document.getElementById("aboutModal").classList.add("show");
});
document.getElementById("closeAbout").addEventListener("click", ()=>{
  document.getElementById("aboutModal").classList.remove("show");
});
document.getElementById("aboutModal").addEventListener("click", (e)=>{
  if(e.target.id === "aboutModal") e.currentTarget.classList.remove("show");
});

/* Init */
setLanguage("mr");
updateWariPath();
renderHome();
