(function(the_global) {

// almanacs
var almanacs = [ 
  { prn: 1,
    health: 0,
    e: 0.001767,
    sqrta: 5153.7,
    OMG0: -0.7147821418617577,
    omg: 0.28871236486490204,
    M0: -2.8260022182441786,
    toa: 503808,
    i0: 0.9602330305574763,
    OMGd: -7.782423134642715e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 2,
    health: 0,
    e: 0.012277,
    sqrta: 5153.6,
    OMG0: -0.7355864665455302,
    omg: -2.6184651168895323,
    M0: -2.0503080854878184,
    toa: 503808,
    i0: 0.9387445368069219,
    OMGd: -7.97790001086608e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 3,
    health: 0,
    e: 0.016117,
    sqrta: 5153.6,
    OMG0: -1.9051141450144102,
    omg: 1.2798324871949218,
    M0: -1.8736284053084329,
    toa: 503808,
    i0: 0.9338488882550781,
    OMGd: -8.297295263981042e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 4,
    health: 0,
    e: 0.010314,
    sqrta: 5153.7,
    OMG0: -0.7190931051141838,
    omg: 0.970176171306088,
    M0: 1.1739957213539858,
    toa: 503808,
    i0: 0.937791587035333,
    OMGd: -8.023278571417933e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 5,
    health: 0,
    e: 0.00304,
    sqrta: 5153.5,
    OMG0: 0.32908183046353084,
    omg: 0.2906147737495758,
    M0: 0.10836749325632791,
    toa: 503808,
    i0: 0.9493212320740076,
    OMGd: -8.11403569252164e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 6,
    health: 0,
    e: 0.008009,
    sqrta: 5153.6,
    OMG0: -1.8259111035589077,
    omg: -0.3456275517724371,
    M0: -0.017208946424664088,
    toa: 503808,
    i0: 0.9404706674371445,
    OMGd: -8.206538142877337e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 7,
    health: 0,
    e: 0.00623,
    sqrta: 5153.7,
    OMG0: 2.4459393203298934,
    omg: -2.9356612551469823,
    M0: 2.8519378109288143,
    toa: 503808,
    i0: 0.9755186241464426,
    OMGd: -7.749261878854823e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 8,
    health: 0,
    e: 0.012844,
    sqrta: 5153.7,
    OMG0: 2.5363473755832,
    omg: -2.879374386770165,
    M0: 2.309960718307015,
    toa: 503808,
    i0: 0.9982463016659128,
    OMGd: -7.531095722355533e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 9,
    health: 0,
    e: 0.017319,
    sqrta: 5152.8,
    OMG0: 2.4224646418905693,
    omg: 1.6489172641141627,
    M0: -2.984408301155184,
    toa: 503808,
    i0: 0.9841475319683026,
    OMGd: -7.668976733263083e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 10,
    health: 0,
    e: 0.012355,
    sqrta: 5153.6,
    OMG0: 0.34871678454846705,
    omg: 0.7996051435086822,
    M0: 0.36543703878257267,
    toa: 503808,
    i0: 0.9441498215003483,
    OMGd: -8.183848862601411e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 11,
    health: 0,
    e: 0.013908,
    sqrta: 5153.6,
    OMG0: -1.008939933992882,
    omg: 1.1571532940722404,
    M0: 3.0554257484188327,
    toa: 503808,
    i0: 0.8886570779331887,
    OMGd: -8.503244115716376e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 12,
    health: 0,
    e: 0.004495,
    sqrta: 5153.5,
    OMG0: -2.779157581120651,
    omg: 0.21427407226734382,
    M0: 2.558635230131167,
    toa: 503808,
    i0: 0.9838892232390074,
    OMGd: -7.874925584998415e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 13,
    health: 0,
    e: 0.005177,
    sqrta: 5153.7,
    OMG0: 1.4781717033915573,
    omg: 2.086680747099381,
    M0: -0.9873502111457122,
    toa: 503808,
    i0: 0.9817494495760624,
    OMGd: -7.75973385436679e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 14,
    health: 0,
    e: 0.006773,
    sqrta: 5153.7,
    OMG0: 1.4491817845159314,
    omg: -2.032697713335196,
    M0: -0.8427496826179819,
    toa: 503808,
    i0: 0.974452227973474,
    OMGd: -7.829547024446563e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 15,
    health: 0,
    e: 0.005379,
    sqrta: 5153.7,
    OMG0: 1.3504834153156522,
    omg: 0.1692620308584101,
    M0: -1.3673956557674773,
    toa: 503808,
    i0: 0.9411478551869182,
    OMGd: -8.217010118389304e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 16,
    health: 0,
    e: 0.00714,
    sqrta: 5153.6,
    OMG0: -2.76079671738967,
    omg: 0.07089527421600966,
    M0: 0.35824628226435606,
    toa: 503808,
    i0: 0.9845960815860652,
    OMGd: -7.852236304722489e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 17,
    health: 0,
    e: 0.008298,
    sqrta: 5153.6,
    OMG0: -1.7237046225621198,
    omg: -2.1953798529135873,
    M0: -0.6896494006330395,
    toa: 503808,
    i0: 0.9648110291854574,
    OMGd: -7.920304145550267e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 18,
    health: 0,
    e: 0.014132,
    sqrta: 5153.5,
    OMG0: 0.3324677692123998,
    omg: -2.1152866935395673,
    M0: 0.8019613379988744,
    toa: 503808,
    i0: 0.9279357127493212,
    OMGd: -8.319984544256968e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 19,
    health: 0,
    e: 0.00916,
    sqrta: 5153.6,
    OMG0: -1.671623997682609,
    omg: 0.2883632990145031,
    M0: -1.3626134536170131,
    toa: 503808,
    i0: 0.9620429369917944,
    OMGd: -7.955210730590155e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 20,
    health: 0,
    e: 0.005469,
    sqrta: 5153.7,
    OMG0: 0.2790083342238135,
    omg: 1.2972857797148651,
    M0: 1.3535901013842024,
    toa: 503808,
    i0: 0.9286774776814187,
    OMGd: -8.33220184902093e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 21,
    health: 0,
    e: 0.020252,
    sqrta: 5153.6,
    OMG0: -0.7152184741747563,
    omg: -2.148063976892021,
    M0: 1.8883938907803048,
    toa: 503808,
    i0: 0.9315782148982334,
    OMGd: -8.05818515645782e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 22,
    health: 0,
    e: 0.006463,
    sqrta: 5153.6,
    OMG0: 0.33513812296795115,
    omg: -2.0432918618948013,
    M0: 0.22959806309985403,
    toa: 503808,
    i0: 0.9256824926849965,
    OMGd: -8.342673824532894e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 23,
    health: 0,
    e: 0.008392,
    sqrta: 5153.7,
    OMG0: 1.3911146803020804,
    omg: -2.906933135659156,
    M0: -1.834777376159039,
    toa: 503808,
    i0: 0.9560372590356819,
    OMGd: -8.04596785169386e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 24,
    health: 0,
    e: 0.000896,
    sqrta: 5153.6,
    OMG0: 2.418048958883024,
    omg: 0.36240016588410257,
    M0: -2.7340757265416373,
    toa: 503808,
    i0: 0.9590514426538761,
    OMGd: -7.908086840786307e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 25,
    health: 0,
    e: 0.00249,
    sqrta: 5153.5,
    OMG0: -2.8169788660113677,
    omg: 0.5900958200992829,
    M0: 1.6998110651023173,
    toa: 503808,
    i0: 0.9727313333310077,
    OMGd: -7.988371986378046e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 26,
    health: 0,
    e: 0.021278,
    sqrta: 5153.6,
    OMG0: 1.470928586995781,
    omg: 1.2339826877450308,
    M0: -1.9021645385785402,
    toa: 503808,
    i0: 0.9792099955144106,
    OMGd: -7.782423134642715e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 28,
    health: 0,
    e: 0.01858,
    sqrta: 5153.6,
    OMG0: -2.7545135320824907,
    omg: -1.771317204556525,
    M0: 0.10946705068508435,
    toa: 503808,
    i0: 0.9830270305885224,
    OMGd: -7.874925584998415e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 29,
    health: 0,
    e: 0.001969,
    sqrta: 5153.6,
    OMG0: -1.714925616424588,
    omg: -1.0516481407891833,
    M0: 2.174226462379416,
    toa: 503808,
    i0: 0.9654341117284193,
    OMGd: -7.932521450314227e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 30,
    health: 0,
    e: 0.010939,
    sqrta: 5153.6,
    OMG0: -2.9107903133060633,
    omg: 1.613417267128598,
    M0: -0.6675186257177513,
    toa: 503808,
    i0: 0.9637673222927647,
    OMGd: -8.033750546929898e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 31,
    health: 0,
    e: 0.007943,
    sqrta: 5153.5,
    OMG0: 2.450302643459879,
    omg: -0.7438767804925033,
    M0: 2.792212643925568,
    toa: 503808,
    i0: 0.9805224831119104,
    OMGd: -7.70388331830297e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 32,
    health: 0,
    e: 0.011569,
    sqrta: 5153.7,
    OMG0: 0.41793654268256214,
    omg: -0.3721914629877907,
    M0: -2.938226889147414,
    toa: 503808,
    i0: 0.949841340191102,
    OMGd: -8.11403569252164e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 38,
    health: 0,
    e: 0.000422,
    sqrta: 5050.5,
    OMG0: 0.5866400681803341,
    omg: 0.07679448708775051,
    M0: -0.07684684696531033,
    toa: 248995,
    i0: 1.1226987493086205,
    OMGd: -6.8416906678177715e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 39,
    health: 0,
    e: 0.000338,
    sqrta: 5050.5,
    OMG0: 0.5824861845605876,
    omg: -0.06682865705886289,
    M0: 0.06668903071870334,
    toa: 254268,
    i0: 1.1185762816154097,
    OMGd: -6.90103186238558e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 40,
    health: 0,
    e: 0.00128,
    sqrta: 5050.5,
    OMG0: 0.5874254663437314,
    omg: -1.770688886025807,
    M0: 1.7680185322702555,
    toa: 259043,
    i0: 1.1279626623326353,
    OMGd: -6.7666415099820155e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 41,
    health: 0,
    e: 0.000431,
    sqrta: 5050.5,
    OMG0: 0.5854706975814978,
    omg: -1.6102058613049284,
    M0: 1.6091586637537318,
    toa: 264150,
    i0: 1.128297765549018,
    OMGd: -6.761405522226032e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 42,
    health: 0,
    e: 0.000428,
    sqrta: 5050.5,
    OMG0: 0.5857674035543369,
    omg: 1.1420561960424895,
    M0: -1.1413929709267316,
    toa: 269224,
    i0: 1.1224736018351131,
    OMGd: -6.84518132632176e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 43,
    health: 0,
    e: 0.000822,
    sqrta: 5050.6,
    OMG0: 0.5858023101393768,
    omg: 2.3508188760962025,
    M0: -2.3497891318375257,
    toa: 274378,
    i0: 1.1223776087262536,
    OMGd: -6.8469266555737545e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 44,
    health: 0,
    e: 0.001099,
    sqrta: 5050.5,
    OMG0: 0.58791415853429,
    omg: -1.7363757129315984,
    M0: 1.7340195184414062,
    toa: 279324,
    i0: 1.1281040340020467,
    OMGd: -6.764896180730021e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 45,
    health: 0,
    e: 0.001925,
    sqrta: 5050.5,
    OMG0: 0.5875127328063312,
    omg: -1.21885068313024,
    M0: 1.2150458653608924,
    toa: 284350,
    i0: 1.1282262070496865,
    OMGd: -6.763150851478027e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 46,
    health: 0,
    e: 0.002401,
    sqrta: 5050.6,
    OMG0: 2.6932873819225294,
    omg: 0.3874281873577013,
    M0: -0.38587484432342634,
    toa: 287798,
    i0: 1.136666619312331,
    OMGd: -6.642723133090417e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 47,
    health: 0,
    e: 0.001668,
    sqrta: 5050.6,
    OMG0: 2.6835309914038814,
    omg: 2.6414161965532585,
    M0: -2.6401595594918223,
    toa: 252049,
    i0: 1.1505018442928903,
    OMGd: -6.443755598363064e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 48,
    health: 0,
    e: 0.001904,
    sqrta: 5050.6,
    OMG0: 2.6807035580156504,
    omg: 0.1142841594205887,
    M0: -0.11414453308042916,
    toa: 257154,
    i0: 1.1438835557693274,
    OMGd: -6.538003377970758e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 49,
    health: 0,
    e: 0.003422,
    sqrta: 5050.6,
    OMG0: 2.693479368140249,
    omg: 2.7976929777768302,
    M0: -2.795616035966957,
    toa: 262415,
    i0: 1.1366247314102833,
    OMGd: -6.642723133090417e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 50,
    health: 0,
    e: 0.00077,
    sqrta: 5050.6,
    OMG0: 2.6802846789951715,
    omg: 1.5419460342594302,
    M0: -1.5407068504905144,
    toa: 267497,
    i0: 1.1436618989543244,
    OMGd: -6.541494036474747e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 51,
    health: 0,
    e: 0.001635,
    sqrta: 5050.6,
    OMG0: 2.6826583267778847,
    omg: 2.6182207707942537,
    M0: -2.616946680440298,
    toa: 272357,
    i0: 1.150247026222099,
    OMGd: -6.447246256867054e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 52,
    health: 0,
    e: 0.002316,
    sqrta: 5050.5,
    OMG0: 2.682536153730245,
    omg: -0.04237659423842232,
    M0: 0.04181808887778413,
    toa: 277860,
    i0: 1.150217355624815,
    OMGd: -6.447246256867054e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 53,
    health: 0,
    e: 0.002174,
    sqrta: 5050.6,
    OMG0: 2.692606703514252,
    omg: 2.471822553136969,
    M0: -2.469379092184177,
    toa: 282815,
    i0: 1.136345478729964,
    OMGd: -6.646213791594406e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 54,
    health: 0,
    e: 0.001202,
    sqrta: 5050.5,
    OMG0: -1.49888876161273,
    omg: -1.9851549445108703,
    M0: 1.982746390143118,
    toa: 285995,
    i0: 1.1319123424298985,
    OMGd: -6.710790973918198e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 55,
    health: 0,
    e: 0.00252,
    sqrta: 5050.5,
    OMG0: -1.4976844844288542,
    omg: -0.45348889954568666,
    M0: 0.4510803451779344,
    toa: 250438,
    i0: 1.1319472490149385,
    OMGd: -6.7090456446662025e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 56,
    health: 0,
    e: 0.000252,
    sqrta: 5050.6,
    OMG0: -1.4886611321960432,
    omg: -1.1661068331349713,
    M0: 1.1654436080192137,
    toa: 256229,
    i0: 1.1334185615743695,
    OMGd: -6.688101693642271e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 57,
    health: 0,
    e: 0.001408,
    sqrta: 5050.6,
    OMG0: -1.487840827447606,
    omg: -0.32751103413673593,
    M0: 0.32639402341545953,
    toa: 261304,
    i0: 1.1336402183893728,
    OMGd: -6.6846110351382826e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 58,
    health: 0,
    e: 0.001837,
    sqrta: 5050.6,
    OMG0: -1.4968118198028568,
    omg: -3.0580786488818648,
    M0: 3.057572503398786,
    toa: 265757,
    i0: 1.132093856672106,
    OMGd: -6.707300315414209e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 59,
    health: 0,
    e: 0.003195,
    sqrta: 5050.5,
    OMG0: -1.500808623789924,
    omg: -0.10718066936497177,
    M0: 0.10630800473897462,
    toa: 270674,
    i0: 1.1316924309441472,
    OMGd: -6.7142816324221856e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 60,
    health: 0,
    e: 0.000071,
    sqrta: 5050.5,
    OMG0: -1.501105329762763,
    omg: -0.10171778880622953,
    M0: 0.1015083492959902,
    toa: 275865,
    i0: 1.1313939796420562,
    OMGd: -6.717772290926174e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 61,
    health: 0,
    e: 0.000549,
    sqrta: 5050.5,
    OMG0: -1.5009657034226034,
    omg: 1.2432852926581606,
    M0: -1.2424649879097234,
    toa: 280783,
    i0: 1.1315702578965074,
    OMGd: -6.716026961674179e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 211,
    health: 0,
    e: 0.000516,
    sqrta: 5440.6,
    OMG0: -1.5315438719175443,
    omg: 5.092992930367093,
    M0: 3.604837943654128,
    toa: 128970,
    i0: 0.9576831045203126,
    OMGd: -5.379104754646524e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 212,
    health: 0,
    e: 0.000629,
    sqrta: 5440.6,
    OMG0: -1.5315438719175443,
    omg: 4.913607989847116,
    M0: 3.7820237693165923,
    toa: 123251,
    i0: 0.9576935764958245,
    OMGd: -5.379104754646524e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 219,
    health: 0,
    e: 0.000222,
    sqrta: 5440.6,
    OMG0: 0.5598318108697011,
    omg: 3.7404151199490476,
    M0: 2.542019695652181,
    toa: 113193,
    i0: 0.964325827653403,
    OMGd: -5.3267448770866934e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 220,
    health: 0,
    e: 0.000138,
    sqrta: 5440.6,
    OMG0: 0.559255852216543,
    omg: 3.623774766038267,
    M0: 2.6588520357806815,
    toa: 208927,
    i0: 0.964325827653403,
    OMGd: -5.3267448770866934e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 251,
    health: 0,
    e: 0.000631,
    sqrta: 5451.8,
    OMG0: -1.42820292690696,
    omg: 6.085666395731388,
    M0: 2.665205034257941,
    toa: 36345,
    i0: 0.9832067995014776,
    OMGd: -5.108578720587402e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 252,
    health: 0,
    e: 0.000254,
    sqrta: 5495.6,
    OMG0: -0.8144753487356737,
    omg: 3.8624310879559713,
    M0: 2.4219061365299313,
    toa: 40079,
    i0: 0.9925146404023634,
    OMGd: -4.7612581994405314e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 264,
    health: 0,
    e: 0.000208,
    sqrta: 6493.3,
    OMG0: -3.4929448853087717,
    omg: 3.332758566560732,
    M0: 5.74038790980935,
    toa: 215346,
    i0: 0.028286551187072087,
    OMGd: -2.7087509990951997e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 265,
    health: 0,
    e: 0.000198,
    sqrta: 6493.4,
    OMG0: 1.2940220140136356,
    omg: 1.539258227211359,
    M0: 5.192581417485889,
    toa: 177078,
    i0: 0.02595130064790366,
    OMGd: -2.7087509990951997e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 266,
    health: 0,
    e: 0.000326,
    sqrta: 6493.2,
    OMG0: -3.1401265770181177,
    omg: 5.285991439052626,
    M0: 5.7554675545465805,
    toa: 254251,
    i0: 0.024148375530593565,
    OMGd: -2.7087509990951997e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 267,
    health: 0,
    e: 0.000241,
    sqrta: 6493.4,
    OMG0: -3.3442951929164146,
    omg: 3.0076909933767886,
    M0: 4.074348965733123,
    toa: 185312,
    i0: 0.009684832019316596,
    OMGd: -2.7087509990951997e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 268,
    health: 0,
    e: 0.00017,
    sqrta: 6493.4,
    OMG0: 1.983182722456117,
    omg: 2.180841260244475,
    M0: 4.024833974854043,
    toa: 270594,
    i0: 0.02129127154507887,
    OMGd: -2.7087509990951997e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 269,
    health: 0,
    e: 0.003022,
    sqrta: 6492.8,
    OMG0: 0.1103746218961214,
    omg: 3.09015780053352,
    M0: 3.915628723556758,
    toa: 155633,
    i0: 0.9525849977752371,
    OMGd: -1.5707963267948968e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 270,
    health: 0,
    e: 0.002107,
    sqrta: 6493.7,
    OMG0: 2.2073004517047083,
    omg: 3.2249495786650426,
    M0: 2.3771733478013166,
    toa: 250829,
    i0: 0.9547474607184582,
    OMGd: -1.5655603390389135e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 271,
    health: 0,
    e: 0.002097,
    sqrta: 6493.5,
    OMG0: -1.9795000777344085,
    omg: 3.421107133296685,
    M0: 6.16518359645225,
    toa: 247646,
    i0: 0.9783931814244773,
    OMGd: -1.513200461479084e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 272,
    health: 0,
    e: 0.002261,
    sqrta: 6493.1,
    OMG0: 0.14741050862344107,
    omg: 3.235386647591968,
    M0: 3.7987614768432176,
    toa: 248273,
    i0: 0.9581351447965791,
    OMGd: -1.558579022030936e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 273,
    health: 0,
    e: 0.002003,
    sqrta: 6493.3,
    OMG0: 2.1970728222880216,
    omg: 3.146357402447738,
    M0: 1.7681756119029353,
    toa: 246901,
    i0: 0.9567929866017955,
    OMGd: -1.5620696805349249e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 274,
    health: 0,
    e: 0.002436,
    sqrta: 5282.6,
    OMG0: -1.68979287519587,
    omg: 3.394141796353373,
    M0: 5.3396254069664115,
    toa: 205351,
    i0: 0.9651915109623922,
    OMGd: -6.539748707222753e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 275,
    health: 0,
    e: 0.002716,
    sqrta: 5282.6,
    OMG0: -1.6980831891428432,
    omg: 3.2786184531638676,
    M0: 5.700280243598519,
    toa: 201396,
    i0: 0.9640116683880441,
    OMGd: -6.5519660119867136e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 276,
    health: 0,
    e: 0.002391,
    sqrta: 5282.6,
    OMG0: 0.39966294541418157,
    omg: 3.1500924070470053,
    M0: 4.0423570805440665,
    toa: 261594,
    i0: 0.9585435518415456,
    OMGd: -6.602580560294549e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 277,
    health: 0,
    e: 0.001614,
    sqrta: 5282.6,
    OMG0: 0.39184387036524687,
    omg: 3.531621381532966,
    M0: 3.491932594342615,
    toa: 208134,
    i0: 0.9603464769588559,
    OMGd: -6.585127267774606e-9,
    a0: 0,
    a1: 0,
    week: 1736 },
  { prn: 293,
    health: 0,
    e: 0.00041,
    sqrta: 5283,
    OMG0: -3.224722685862283,
    omg: 3.685472155096266,
    M0: 0.34587189786771627,
    toa: 223234,
    i0: 0.9927764397901626,
    OMGd: -6.274458660919615e-9,
    a0: 0,
    a1: 0,
    week: 1736 }
];

// constants
var RE_WGS84 = 6378137.0;           /* earth semimajor axis (WGS84) (m) */
var FE_WGS84 = (1.0/298.257223563); /* earth flattening (WGS84) */
var MU_GPS_SQRT = 19964981.843217388; //3.9860050e14;          /* gravitational constant         ref [1] */
var MU_BDS_SQRT = 19964980.385665298; //3.986004418e14;
var OMGE = 7.2921151467e-5;         /* earth angular velocity (IS-GPS) (rad/s) */

// functions
// convert ecef {x, y, z} to geo {lon, lat, alt}
var xyz_to_lla = function (xyz) {
    if (!xyz || (xyz.x == 0 && xyz.y == 0 && xyz.z == 0)) {
        return {lon: 0, lat: 0, alt: 0};
    }
    
    var e2 = FE_WGS84*(2.0-FE_WGS84);
    var r2 = xyz.x*xyz.x + xyz.y*xyz.y;
    var zz = 0;
    var zk = 0;
    var v = RE_WGS84;
    var sinp = 0;
    
    for (zz=xyz.z; Math.abs(zz-zk) >= 1e-4;) {
        zk = zz;
        sinp = zz/Math.sqrt(r2 + zz*zz);
        v = RE_WGS84/Math.sqrt(1.0-e2*sinp*sinp);
        zz = xyz.z + v*e2*sinp;
    }
    
    var lla = {};
    lla.lat = r2>1e-12 ? Math.atan(zz/Math.sqrt(r2)) : (xyz.z > 0.0 ? Math.PI/2.0 : -Math.PI/2.0);
    lla.lon = r2>1e-12 ? Math.atan2(xyz.y, xyz.x) : 0.0;
    lla.alt = Math.sqrt(r2 + zz*zz) - v;
    
    lla.lat = lla.lat*180/Math.PI;
    lla.lon = lla.lon*180/Math.PI;
    return lla;
};

// convert gps {week, second} to unix time stamp in seconds
var gpst_to_syst = function (week, second) {
    week = week || 0;
    second = second || 0;
    second %= 604800;
    if (week < 1024) week += 1024;
    
    return 315964800 + week*604800 + second - 16; // seconds
};

// alm: object
// time: timestamp in seconds
var alm_to_xyz = function (alm, time) {
    if (typeof time === 'undefined') {
        var now = new Date();
        time = now.getTime() / 1000; // seconds
    }
    
    var tk = 0, M = 0, E = 0, Ek = 0, sinE = 0, cosE = 0;
    var u = 0, r = 0, i = 0, O = 0, x = 0, y = 0, sinO = 0, cosO = 0, cosi = 0, mu = 0;
    var xyz = {};
    
    tk = (time - gpst_to_syst(alm.week, alm.toa)); // seconds
    
    if (alm.sqrta <= 0) {
        xyz.x = 0;
        xyz.y = 0;
        xyz.z = 0;
        return xyz;
    }
    
    mu = alm.prn <= 32 ? MU_GPS_SQRT : MU_BDS_SQRT;
    
    M = alm.M0 + mu/(alm.sqrta*alm.sqrta*alm.sqrta)*tk;
    for (E = M; Math.abs(E - Ek) > 1E-12;) {
        Ek = E;
        sinE = Math.sin(Ek); 
        E = M + alm.e*sinE;
    }
    
    cosE = Math.cos(E);
    u = Math.atan2(Math.sqrt(1 - alm.e*alm.e)*sinE, cosE - alm.e) + alm.omg;
    r = alm.sqrta*alm.sqrta*(1 - alm.e*cosE);
    i = alm.i0;
    O = alm.OMG0 + (alm.OMGd - OMGE)*tk - OMGE*alm.toa;
    x = r*Math.cos(u);
    y = r*Math.sin(u);
    sinO = Math.sin(O);
    cosO = Math.cos(O);
    cosi = Math.cos(i);
    
    xyz.x = x*cosO - y*cosi*sinO;
    xyz.y = x*sinO + y*cosi*cosO;
    xyz.z = y*Math.sin(i);
    
    return xyz;
};

var get_sate_position = function(prn) {
    var pos = {lon: 0, lat: 0, alt: 0};
    for (var i = 0; i < almanacs.length; i++) {
        if (almanacs[i].prn === prn) {
            pos = xyz_to_lla(alm_to_xyz(almanacs[i]));
            break;
        }
    }
    
    return pos;
};

// get -1 ~ +12 hours arch of orbit
var get_sate_orbit = function(prn) {
    var orbit = [];
    for (var i = 0; i < almanacs.length; i++) {
        if (almanacs[i].prn === prn) {
            var now = new Date();
            var start_time = now.getTime()/1000 - 3600;
            var stop_time = now.getTime()/1000 + 12*3600;
            for (var t = start_time; t < stop_time; t += 300) {
                orbit.push(xyz_to_lla(alm_to_xyz(almanacs[i], t)));
            }
            break;
        }
    }
    
    return orbit;
};

var get_constellation = function() {
    var cons = [];
    
    for (var i = 0; i < almanacs.length; i++) {
        var pos = xyz_to_lla(alm_to_xyz(almanacs[i]));
        pos.prn = almanacs[i].prn;
        cons.push(pos);
    }
    
    return cons;
};

var get_sate_type = function (prn) {
    var type = {
        sys: 'gps', 
        prn: '1'
    };
    
    if (1 <= prn && prn <= 37) {
        type.sys = 'gps';
        type.prn = prn;
    } else if (38 <= prn && prn <= 64) {
        type.sys = 'glonass';
        type.prn = prn - 37;
    } else if (201 <= prn && prn <= 263) {
        type.sys = 'galileo';
        type.prn = prn - 200;
    } else if (264 <= prn && prn <= 300) {
        type.sys = 'bds';
        type.prn = prn - 263;
    }
    
    return type;
};

// exports apis
the_global.GNSSConstellation = {
    getSatePosition: get_sate_position,
    getSateOrbit: get_sate_orbit,
    getSateType: get_sate_type,
    getConstellation: get_constellation
};

})(this);
