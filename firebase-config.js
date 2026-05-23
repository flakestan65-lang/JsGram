const firebaseConfig = {
    apiKey: "ВАШ_API_KEY",
    authDomain: "ВАШ_ПРОЕКТ.firebaseapp.com",
    databaseURL: "https://ВАШ_ПРОЕКТ-default-rtdb.firebaseio.com",
    projectId: "ВАШ_ПРОЕКТ",
    storageBucket: "ВАШ_ПРОЕКТ.appspot.com",
    messagingSenderId: "ВАШ_SENDER_ID",
    appId: "ВАШ_APP_ID"
};

const EMAILJS_CONFIG = {
    publicKey: "ВАШ_PUBLIC_KEY",
    serviceId: "ВАШ_SERVICE_ID",
    templateId: "ВАШ_TEMPLATE_ID"
};

firebase.initializeApp(firebaseConfig);
emailjs.init(EMAILJS_CONFIG.publicKey);
