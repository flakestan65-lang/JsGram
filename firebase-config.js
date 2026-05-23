const firebaseConfig = {
  apiKey: "AIzaSyAfQNDcgOADP3X8atKitFkbUB6bCReJbgc",
  authDomain: "tipo-e35b0.firebaseapp.com",
  databaseURL: "https://tipo-e35b0-default-rtdb.firebaseio.com",
  projectId: "tipo-e35b0",
  storageBucket: "tipo-e35b0.firebasestorage.app",
  messagingSenderId: "296054755923",
  appId: "1:296054755923:web:06d906ca61147c66dc6ca6",
};

const EMAILJS_CONFIG = {
    publicKey: "KtLrxT8nK55dICe1X",
    serviceId: "service_15ma2rk",
    templateId: "template_c0h6x3m"
};

firebase.initializeApp(firebaseConfig);
emailjs.init(EMAILJS_CONFIG.publicKey);
