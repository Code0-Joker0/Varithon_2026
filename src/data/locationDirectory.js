// मुक्काम ठिकाणानुसार आरोग्य केंद्र, पोलीस ठाणे व शासकीय कार्यालये पत्ते (Location Directory with Map Directions)

export const HALT_LOCATIONS_DIRECTORY = [
  {
    haltId: 'alandi',
    haltName: 'आळंदी (प्रस्थान)',
    district: 'पुणे',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'ग्रामीण रुग्णालय आळंदी (Rural Hospital Alandi)',
        address: 'गोपाळपुरा रस्ता, ज्ञानेश्वर महाराजांच्या मंदिरा जवळ, आळंदी, ता. खेड, जि. पुणे - ४१२१०५',
        contact: '02135-232102',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rural+Hospital+Alandi+Pune',
        timing: '२४ तास उघडे (24/7 Emergency)'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'आळंदी पोलीस ठाणे (Alandi Police Station)',
        address: 'नगरपालिका चौक, प्रस्थान मार्गाजवळ, आळंदी, ता. खेड, जि. पुणे - ४१२१०५',
        contact: '02135-232333',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alandi+Police+Station+Pune',
        timing: '२४ तास (24/7 Service)'
      },
      {
        category: 'शासकीय कार्यालय (Govt Office)',
        name: 'आळंदी नगरपरिषद कार्यालय (Alandi Municipal Council)',
        address: 'चाकण रस्ता, आळंदी, जि. पुणे',
        contact: '02135-232230',
        type: 'Govt',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Alandi+Municipal+Council',
        timing: 'सकाळी १० ते संध्याकाळी ६'
      },
      {
        category: 'पाणी व स्वच्छता (Water & Toilet)',
        name: 'इंद्रायणी घाट मोफत जलकुंभ व महापालिका स्वच्छता गृह',
        address: 'इंद्रायणी नदी घाट परिसर व दर्शन मंडप परिसर',
        contact: '9881122334',
        type: 'Sanitation',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Indrayani+Ghat+Alandi',
        timing: '२४ तास उपलब्ध'
      }
    ]
  },
  {
    haltId: 'pune',
    haltName: 'पुणे शहर (विठोबा मंदिर मुक्काम)',
    district: 'पुणे',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'ससून सर्वोपचार रुग्णालय (Sassoon General Hospital)',
        address: 'रेल्वे स्टेशन समोर, जयप्रकाश नारायण रस्ता, पुणे - ४११००१',
        contact: '020-26128000',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sassoon+Hospital+Pune',
        timing: '२४ तास उघडे (24/7 Emergency)'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'फरासखाना पोलीस ठाणे व मदत केंद्र (Faraskhana Police Station)',
        address: 'बुधवार पेठ, दगडूशेठ गणपती मंदिरा जवळ, पुणे - ४११००२',
        contact: '020-24451000',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Faraskhana+Police+Station+Pune',
        timing: '२४ तास'
      },
      {
        category: 'शासकीय कार्यालय (Govt Office)',
        name: 'पुणे जिल्हाधिकारी कार्यालय (District Collector Office Pune)',
        address: 'स्टेशन रोड, पुणे - ४११००१',
        contact: '020-26123370',
        type: 'Govt',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pune+Collector+Office',
        timing: 'सकाळी ९.४५ ते संध्याकाळी ६.१५'
      }
    ]
  },
  {
    haltId: 'saswad',
    haltName: 'सासवड (दिवेघाट पार करून)',
    district: 'पुणे',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'उपजिल्हा रुग्णालय सासवड (Sub District Hospital Saswad)',
        address: 'सासवड-जेजुरी रस्ता, सासवड, ता. पुरंदर, जि. पुणे - ४१२३०१',
        contact: '02115-222045',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sub+District+Hospital+Saswad',
        timing: '२४ तास उघडे'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'सासवड पोलीस ठाणे (Saswad Police Station)',
        address: 'पुणे-सासवड रोड, एसटी स्टँड समोर, सासवड, जि. पुणे',
        contact: '02115-222233',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Saswad+Police+Station',
        timing: '२४ तास'
      },
      {
        category: 'शासकीय कार्यालय (Govt Office)',
        name: 'तहसीलदार कार्यालय पुरंदर (Tehsildar Office Purandar Saswad)',
        address: 'पालखी मैदान परिसर, सासवड, ता. पुरंदर',
        contact: '02115-222220',
        type: 'Govt',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tehsildar+Office+Purandar+Saswad',
        timing: 'सकाळी १० ते ५.३०'
      }
    ]
  },
  {
    haltId: 'lonand',
    haltName: 'लोणंद (निरा नदी स्नान)',
    district: 'सातारा',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'ग्रामीण रुग्णालय लोणंद (Rural Hospital Lonand)',
        address: 'शिरवळ रस्ता, लोणंद, ता. खंडाळा, जि. सातारा - ४१५५२१',
        contact: '02169-224110',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Rural+Hospital+Lonand+Satara',
        timing: '२४ तास उघडे'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'लोणंद पोलीस ठाणे (Lonand Police Station)',
        address: 'स्टेशन रस्ता, लोणंद बाजार समिती समोर, जि. सातारा',
        contact: '02169-224033',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lonand+Police+Station',
        timing: '२४ तास'
      }
    ]
  },
  {
    haltId: 'phaltan',
    haltName: 'फलटण',
    district: 'सातारा',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'उपजिल्हा रुग्णालय फलटण (Sub District Hospital Phaltan)',
        address: 'रिंग रोड, फलटण, ता. फलटण, जि. सातारा - ४१५५२३',
        contact: '02166-222300',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sub+District+Hospital+Phaltan',
        timing: '२४ तास उघडे'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'फलटण शहर पोलीस ठाणे (Phaltan City Police Station)',
        address: 'रविवार पेठ, फलटण, जि. सातारा',
        contact: '02166-222033',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Phaltan+Police+Station',
        timing: '२४ तास'
      }
    ]
  },
  {
    haltId: 'natepute',
    haltName: 'नातेपुते',
    district: 'सोलापूर',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'प्राथमिक आरोग्य केंद्र नातेपुते (PHC Natepute)',
        address: 'मुख्य रस्ता, नातेपुते, ता. माळशिरस, जि. सोलापूर - ४१३१०९',
        contact: '02185-274233',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Primary+Health+Centre+Natepute',
        timing: '२४ तास उघडे'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'नातेपुते पोलीस आऊटपोस्ट (Natepute Police Outpost)',
        address: 'पालखी मैदान परिसर, नातेपुते, जि. सोलापूर',
        contact: '02185-274033',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Natepute+Police+Outpost',
        timing: '२४ तास'
      }
    ]
  },
  {
    haltId: 'malshiras',
    haltName: 'माळशिरस',
    district: 'सोलापूर',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'उपजिल्हा रुग्णालय माळशिरस (Sub District Hospital Malshiras)',
        address: 'अकलूज रोड, माळशिरस, जि. सोलापूर - ४१३१०७',
        contact: '02185-235108',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sub+District+Hospital+Malshiras',
        timing: '२४ तास उघडे'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'माळशिरस पोलीस ठाणे (Malshiras Police Station)',
        address: 'तहसील कार्यालया शेजारी, माळशिरस, जि. सोलापूर',
        contact: '02185-235033',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Malshiras+Police+Station',
        timing: '२४ तास'
      }
    ]
  },
  {
    haltId: 'pandharpur',
    haltName: 'पंढरपूर (अंतिम मुक्काम)',
    district: 'सोलापूर',
    facilities: [
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'उपजिल्हा रुग्णालय पंढरपूर (Sub District Hospital Pandharpur)',
        address: 'स्टेशन रस्ता, नजीक विठ्ठल मंदिर, पंढरपूर, जि. सोलापूर - ४१३३०४',
        contact: '02186-223344',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sub+District+Hospital+Pandharpur',
        timing: '२४ तास उघडे (24/7 Trauma & Emergency)'
      },
      {
        category: 'आरोग्य केंद्र (Healthcare)',
        name: 'चंद्रभागा वाळवंतरूग्णालय व आपत्कालीन वैद्यकीय केंद्र',
        address: 'चंद्रभागा वाळवंट, पंढरपूर',
        contact: '02186-224400',
        type: 'Hospital',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Chandrabhaga+Ghat+Pandharpur',
        timing: '२४ तास फिरते वैद्यकीय पथक'
      },
      {
        category: 'पोलीस ठाणे (Police Station)',
        name: 'पंढरपूर शहर पोलीस ठाणे (Pandharpur City Police Station)',
        address: 'नगरपालिका चौक, पंढरपूर, जि. सोलापूर',
        contact: '02186-224433',
        type: 'Police',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pandharpur+City+Police+Station',
        timing: '२४ तास सुरक्षा मदत'
      },
      {
        category: 'शासकीय कार्यालय (Govt Office)',
        name: 'नगरपरिषद कार्यालय पंढरपूर (Pandharpur Municipal Council)',
        address: 'महापालिका चौक, पंढरपूर',
        contact: '02186-224201',
        type: 'Govt',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pandharpur+Municipal+Council',
        timing: 'सकाळी १० ते संध्याकाळी ६'
      }
    ]
  }
];
