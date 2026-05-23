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
    const savedTheme = localStorage.getItem('jsgram-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
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

function showLogin() { 
    showScreen('auth-screen'); 
    document.getElementById('auth-error').textContent = '';
}
function showRegister() { 
    showScreen('register-screen'); 
    document.getElementById('reg-error').textContent = '';
}

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
        
        const updates = {};
        updates['users/' + cred.user.uid] = userData;
        updates['usernames/' + username] = cred.user.uid;
        updates['emails/' + email.replace(/\./g, ',')] = cred.user.uid;
        
        return db.ref().update(updates);
    }).then(() => {
        sendWelcomeEmail(email, name);
    }).catch(err => {
        errorEl.textContent = getAuthError(err.code) || err.message;
    });
}

function logout() {
    if (currentUser) {
        db.ref('users/' + currentUser.uid + '/status').set('offline');
        db.ref('users/' + currentUser.uidpx; 
    margin-bottom: 12px; 
    border: 1px solid var(--border); 
    border-radius: 8px; 
    background: var(--bg-primary); 
    color: var(--text-primary); 
    font-size: 15px;
    outline: none;
}
.auth-box input:focus {
    border-color: var(--accent);
}
.auth-box button { 
    width: 100%; 
    padding: 12px; 
    margin-top: 8px; 
    border: none; 
    border-radius: 8px; 
    background: var(--accent); 
    color: white; 
    font-size: 15px; 
    cursor: pointer; 
    transition: 0.2s;
}
.auth-box button:hover { 
    background: var(--accent-hover); 
}
.auth-box button.secondary { 
    background: transparent; 
    color: var(--accent); 
    border: 1px solid var(--accent); 
}
.error { 
    color: var(--error); 
    font-size: 13px; 
    margin-top: 8px; 
    text-align: center; 
    min-height: 18px;
}

/* Main Layout */
#main-screen { 
    flex-direction: row; 
}
.sidebar { 
    width: 320px; 
    min-width: 280px; 
    max-width: 35%;
    background: var(--bg-secondary); 
    border-right: 1px solid var(--border); 
    display: flex; 
    flex-direction: column;
    height: 100vh;
    position: relative;
}
.chat-area { 
    flex: 1; 
    display: flex; 
    flex-direction: column; 
    background: var(--bg-primary);
    height: 100vh;
    min-width: 0;
}

/* Sidebar Header */
.sidebar-header { 
    padding: 12px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
}
.menu-btn { 
    background: none; 
    border: none; 
    color: var(--text-primary); 
    font-size: 20px; 
    cursor: pointer; 
    padding: 4px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}
.menu-btn:hover {
    background: var(--bg-hover);
}
.sidebar-header input { 
    flex: 1; 
    padding: 8px 12px; 
    border: none; 
    border-radius: 20px; 
    background: var(--bg-primary); 
    color: var(--text-primary); 
    font-size: 14px;
    outline: none;
}

/* Chats List */
.chats-list { 
    flex: 1; 
    overflow-y: auto; 
    overflow-x: hidden;
}
.chat-item { 
    display: flex; 
    align-items: center; 
    padding: 12px; 
    cursor: pointer; 
    transition: 0.2s; 
    border-bottom: 1px solid var(--border);
}
.chat-item:hover, .chat-item.active { 
    background: var(--bg-hover); 
}
.chat-item-avatar { 
    width: 48px; 
    height: 48px; 
    border-radius: 50%; 
    background: var(--accent); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 20px; 
    margin-right: 12px; 
    flex-shrink: 0;
    color: white;
    font-weight: 500;
}
.chat-item-info { 
    flex: 1; 
    min-width: 0; 
    overflow: hidden;
}
.chat-item-name { 
    font-weight: 500; 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis;
    font-size: 15px;
}
.chat-item-preview { 
    font-size: 13px; 
    color: var(--text-secondary); 
    white-space: nowrap; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    margin-top: 2px;
}
.chat-item-meta { 
    text-align: right; 
    flex-shrink: 0; 
    margin-left: 8px; 
}
.chat-item-time { 
    font-size: 12px; 
    color: var(--text-secondary); 
}
.unread-badge { 
    background: var(--accent); 
    color: white; 
    font-size: 11px; 
    padding: 2px 6px; 
    border-radius: 10px; 
    margin-top: 4px; 
    display: inline-block;
    min-width: 18px;
    text-align: center;
}

.new-chat-btn { 
    position: absolute; 
    bottom: 20px; 
    right: 20px; 
    width: 50px; 
    height: 50px; 
    border-radius: 50%; 
    background: var(--accent); 
    color: white; 
    border: none; 
    font-size: 24px; 
    cursor: pointer; 
    box-shadow: var(--shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}
.new-chat-btn:hover {
    background: var(--accent-hover);
    transform: scale(1.05);
}

/* Chat Header */
.chat-header { 
    padding: 10px 16px; 
    background: var(--bg-secondary); 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    min-height: 56px;
}
.back-btn { 
    display: none; 
    background: none; 
    border: none; 
    color: var(--text-primary); 
    font-size: 20px; 
    cursor: pointer; 
    padding: 4px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
.back-btn:hover {
    background: var(--bg-hover);
}
.chat-info { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    cursor: pointer; 
    min-width: 0;
}
.avatar { 
    width: 40px; 
    height: 40px; 
    border-radius: 50%; 
    background: var(--accent); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 16px;
    color: white;
    font-weight: 500;
    flex-shrink: 0;
}
.chat-meta { 
    flex: 1; 
    min-width: 0;
    overflow: hidden;
}
.chat-name { 
    font-weight: 500; 
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.chat-status { 
    font-size: 13px; 
    color: var(--text-secondary); 
}
.header-btn { 
    background: none; 
    border: none; 
    color: var(--text-primary); 
    font-size: 20px; 
    cursor: pointer; 
    padding: 4px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
.header-btn:hover {
    background: var(--bg-hover);
}

/* Messages */
.messages-container { 
    flex: 1; 
    overflow-y: auto; 
    overflow-x: hidden;
    padding: 16px; 
    display: flex; 
    flex-direction: column; 
    gap: 4px;
}
.message { 
    max-width: 70%; 
    padding: 8px 12px; 
    border-radius: 12px; 
    position: relative; 
    word-wrap: break-word; 
    animation: fadeIn 0.2s;
    line-height: 1.4;
}
@keyframes fadeIn { 
    from { opacity: 0; transform: translateY(10px); } 
    to { opacity: 1; transform: translateY(0); } 
}
.message.out { 
    align-self: flex-end; 
    background: var(--message-out); 
    border-bottom-right-radius: 4px; 
    margin-left: auto;
}
.message.in { 
    align-self: flex-start; 
    background: var(--message-in); 
    border-bottom-left-radius: 4px; 
    margin-right: auto;
}
.message-text { 
    font-size: 14px; 
    line-height: 1.4; 
    word-break: break-word;
}
.message-time { 
    font-size: 11px; 
    color: var(--text-secondary); 
    float: right; 
    margin-left: 8px; 
    margin-top: 4px;
    opacity: 0.8;
}

/* Input Area */
.input-area { 
    padding: 10px 16px; 
    background: var(--bg-secondary); 
    display: flex; 
    align-items: center; 
    gap: 10px;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
}
.attach-btn, .send-btn { 
    background: none; 
    border: none; 
    color: var(--accent); 
    font-size: 22px; 
    cursor: pointer; 
    padding: 4px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}
.attach-btn:hover, .send-btn:hover {
    background: var(--bg-hover);
}
.input-wrapper { 
    flex: 1; 
}
.input-wrapper input { 
    width: 100%; 
    padding: 10px 16px; 
    border: none; 
    border-radius: 20px; 
    background: var(--bg-primary); 
    color: var(--text-primary); 
    font-size: 15px;
    outline: none;
}

/* Modals */
.modal { 
    display: none; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background: rgba(0,0,0,0.7); 
    align-items: center; 
    justify-content: center; 
    z-index: 100;
}
.modal.active { 
    display: flex; 
}
.modal-content { 
    background: var(--bg-secondary); 
    padding: 24px; 
    border-radius: 12px; 
    width: 90%; 
    max-width: 360px; 
    text-align: center;
    box-shadow: var(--shadow);
}
.modal-content h3 { 
    margin-bottom: 16px; 
    font-size: 18px;
}
.modal-content input { 
    width: 100%; 
    padding: 12px; 
    margin-bottom: 12px; 
    border: 1px solid var(--border); 
    border-radius: 8px; 
    background: var(--bg-primary); 
    color: var(--text-primary);
    font-size: 15px;
    outline: none;
}
.modal-content input:focus {
    border-color: var(--accent);
}
.modal-content button { 
    width: 100%; 
    padding: 12px; 
    margin-top: 8px; 
    border: none; 
    border-radius: 8px; 
    background: var(--accent); 
    color: white; 
    cursor: pointer;
    font-size: 15px;
    transition: 0.2s;
}
.modal-content button:hover {
    background: var(--accent-hover);
}
.modal-content button.secondary { 
    background: transparent; 
    color: var(--text-secondary); 
}

/* Profile Modal */
.profile-modal .profile-avatar { 
    width: 80px; 
    height: 80px; 
    border-radius: 50%; 
    background: var(--accent); 
    margin: 0 auto 16px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 32px;
    color: white;
    font-weight: 500;
}
.profile-modal h3 {
    margin-bottom: 8px;
    font-size: 20px;
}
.profile-modal p {
    color: var(--text-secondary);
    margin-bottom: 4px;
    font-size: 14px;
}

/* Drawer */
.drawer { 
    position: fixed; 
    top: 0; 
    left: -280px; 
    width: 280px; 
    height: 100%; 
    background: var(--bg-secondary); 
    z-index: 200; 
    transition: 0.3s; 
    display: flex; 
    flex-direction: column;
    box-shadow: var(--shadow);
}
.drawer.open { 
    left: 0; 
}
.drawer-header { 
    padding: 20px; 
    background: var(--accent); 
    color: white;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
.drawer-avatar { 
    width: 60px; 
    height: 60px; 
    border-radius: 50%; 
    background: rgba(255,255,255,0.2); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 24px; 
    margin-bottom: 12px;
    color: white;
    font-weight: 500;
}
.drawer-info div:first-child { 
    font-weight: 500; 
    font-size: 16px; 
}
.drawer-info div:last-child { 
    font-size: 13px; 
    opacity: 0.8; 
    margin-top: 4px; 
}
.drawer-menu { 
    padding: 12px 0; 
    flex: 1;
}
.menu-item { 
    padding: 14px 20px; 
    cursor: pointer; 
    transition: 0.2s; 
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
}
.menu-item:hover { 
    background: var(--bg-hover); 
}
.overlay { 
    display: none; 
    position: fixed; 
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%; 
    background: rgba(0,0,0,0.5); 
    z-index: 150;
}
.overlay.active { 
    display: block; 
}

/* Scrollbar */
::-webkit-scrollbar { 
    width: 6px; 
}
::-webkit-scrollbar-track { 
    background: transparent; 
}
::-webkit-scrollbar-thumb { 
    background: var(--text-secondary); 
    border-radius: 3px; 
    opacity: 0.5;
}

/* Mobile */
@media (max-width: 768px) {
    .sidebar { 
        width: 100%; 
        position: absolute; 
        z-index: 10; 
        max-width: 100%;
    }
    .chat-area { 
        width: 100%; 
        position: absolute; 
        z-index: 20; 
        transform: translateX(100%); 
        transition: 0.3s; 
        left: 0;
        top: 0;
    }
    .chat-area.open { 
        transform: translateX(0); 
    }
    .back-btn { 
        display: flex !important;
        align-items: center;
        justify-content: center;
    }
    .new-chat-btn { 
        right: 20px; 
        left: auto; 
    }
    #main-screen.sidebar-hidden .sidebar { 
        display: none; 
    }
    #main-screen.sidebar-hidden .chat-area { 
        transform: translateX(0); 
    }
}
