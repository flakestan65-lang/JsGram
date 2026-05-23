// === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
let currentUser = null;
let currentChat = null;
let messagesRef = null;
let chatsRef = null;
let usersRef = null;
let typingRef = null;
let messagesListener = null;
let chatsListener = null;

const db = firebase.database();
const auth = firebase.auth();

// === ИНИЦИАЛИЗАЦИЯ ===
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем сохранённую тему
    const savedTheme = localStorage.getItem('jsgram-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Слушаем авторизацию
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            initApp();
        } else {
            showScreen('auth-screen');
        }
    });
});

// === НАВИГАЦИЯ ===
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showLogin() { showScreen('auth-screen'); }
function showRegister() { showScreen('register-screen'); }

// === АВТОРИЗАЦИЯ ===
function login() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    
    if (!email || !password) {
        errorEl.textContent = 'Введите email и пароль';
        return;
    }
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(err => errorEl.textContent = getAuthError(err.code));
}

function register() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const username = document.getElementById('reg-username').value.trim().toLowerCase();
    const errorEl = document.getElementById('reg-error');
    
    if (!name || !email || !password || !username) {
        errorEl.textContent = 'Заполните все поля';
        return;
    }
    if (password.length < 6) {
        errorEl.textContent = 'Пароль минимум 6 символов';
        return;
    }
    if (!username.match(/^[a-z0-9_]+$/)) {
        errorEl.textContent = 'Username: только латиница, цифры и _';
        return;
    }
    
    // Проверяем уникальность username
    db.ref('usernames/' + username).once('value').then(snap => {
        if (snap.exists()) {
            errorEl.textContent = 'Этот username уже занят';
            return;
        }
        
        return auth.createUserWithEmailAndPassword(email, password);
    }).then(cred => {
        if (!cred) return;
        
        const userData = {
            uid: cred.user.uid,
            name: name,
            email: email,
            username: username,
            avatar: name.charAt(0).toUpperCase(),
            status: 'online',
            lastSeen: Date.now()
        };
        
        // Сохраняем пользователя
        const updates = {};
        updates['users/' + cred.user.uid] = userData;
        updates['usernames/' + username] = cred.user.uid;
        updates['emails/' + email.replace('.', ',')] = cred.user.uid;
        
        return db.ref().update(updates);
    }).then(() => {
        // Отправляем welcome email через EmailJS
        sendWelcomeEmail(email, name);
    }).catch(err => {
        errorEl.textContent = getAuthError(err.code) || err.message;
    });
}

function logout() {
    // Обновляем статус перед выходом
    if (currentUser) {
        db.ref('users/' + currentUser.uid + '/status').set('offline');
        db.ref('users/' + currentUser.uid + '/lastSeen').set(Date.now());
    }
    auth.signOut();
    closeDrawer();
}

function getAuthError(code) {
    const errors = {
        'auth/invalid-email': 'Неверный email',
        'auth/user-disabled': 'Аккаунт заблокирован',
        'auth/user-not-found': 'Пользователь не найден',
        'auth/wrong-password': 'Неверный пароль',
        'auth/email-already-in-use': 'Email уже используется',
        'auth/weak-password': 'Слабый пароль',
        'auth/invalid-credential': 'Неверные данные для входа'
    };
    return errors[code] || 'Ошибка авторизации';
}

// === EMAILJS ФУНКЦИИ ===
function sendWelcomeEmail(email, name) {
    if (!EMAILJS_CONFIG.serviceId) return; // Если не настроено — пропускаем
    
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        to_email: email,
        to_name: name,
        message: 'Добро пожаловать в JsGram! Ваш аккаунт успешно создан.'
    }).catch(err => console.log('Email error:', err));
}

function sendNotificationEmail(toEmail, fromName, messageText) {
    if (!EMAILJS_CONFIG.serviceId) return;
    
    emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        to_email: toEmail,
        to_name: 'Пользователь JsGram',
        from_name: fromName,
        message: `Новое сообщение от ${fromName}: ${messageText.substring(0, 100)}`
    }).catch(err => console.log('Email error:', err));
}

// === ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ ===
function initApp() {
    showScreen('main-screen');
    
    // Устанавливаем online статус
    const userStatusRef = db.ref('users/' + currentUser.uid + '/status');
    const connectedRef = db.ref('.info/connected');
    
    connectedRef.on('value', snap => {
        if (snap.val() === true) {
            userStatusRef.set('online');
           back-btn" onclick="closeChat()">←</button>
                <div class="chat-info" onclick="showProfile()">
                    <div class="avatar" id="header-avatar">?</div>
                    <div class="chat-meta">
                        <div class="chat-name" id="header-name">Выберите чат</div>
                        <div class="chat-status" id="header-status">offline</div>
                    </div>
                </div>
                <button class="header-btn" onclick="showChatMenu()">⋮</button>
            </div>
            
            <div class="messages-container" id="messages-container"></div>
            
            <div class="input-area">
                <button class="attach-btn" onclick="showAttachMenu()">📎</button>
                <div class="input-wrapper">
                    <input type="text" id="message-input" placeholder="Сообщение" onkeypress="handleKeyPress(event)">
                </div>
                <button class="send-btn" id="send-btn" onclick="sendMessage()">➤</button>
            </div>
        </div>
    </div>

    <!-- New Chat Modal -->
    <div class="modal" id="new-chat-modal">
        <div class="modal-content">
            <h3>Новый чат</h3>
            <input type="text" id="new-chat-username" placeholder="@username или email">
            <button onclick="startChat()">Начать чат</button>
            <button class="secondary" onclick="closeModal('new-chat-modal')">Отмена</button>
        </div>
    </div>

    <!-- Profile Modal -->
    <div class="modal" id="profile-modal">
        <div class="modal-content profile-modal">
            <div class="profile-avatar" id="profile-avatar">?</div>
            <h3 id="profile-name">Имя</h3>
            <p id="profile-username">@username</p>
            <p id="profile-status">Статус</p>
            <button onclick="closeModal('profile-modal')">Закрыть</button>
        </div>
    </div>

    <!-- Menu Drawer -->
    <div class="drawer" id="drawer">
        <div class="drawer-header">
            <div class="drawer-avatar" id="drawer-avatar">?</div>
            <div class="drawer-info">
                <div id="drawer-name">Имя</div>
                <div id="drawer-phone">online</div>
            </div>
        </div>
        <div class="drawer-menu">
            <div class="menu-item" onclick="showSettings()">⚙️ Настройки</div>
            <div class="menu-item" onclick="toggleTheme()">🌓 Тема</div>
            <div class="menu-item" onclick="logout()">🚪 Выйти</div>
        </div>
    </div>
    <div class="overlay" id="overlay" onclick="closeDrawer()"></div>

    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
    <script src="firebase-config.js"></script>
    <script src="app.js"></script>
</body>
</html>
