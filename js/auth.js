// ============================================================
// AUTH.JS — Autenticação via db.json (json-server)
// ============================================================

const Auth = {
  SESSION_KEY: 'fin_session',

  isLoggedIn() {
    return sessionStorage.getItem(this.SESSION_KEY) === 'true';
  },

  async login(username, password) {
    const user = await Storage.findUser(username, password);
    if (user) {
      sessionStorage.setItem(this.SESSION_KEY, 'true');
      sessionStorage.setItem('fin_user', JSON.stringify({ id: user.id, name: user.name, role: user.role }));
      return true;
    }
    return false;
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem('fin_user');
    window.location.href = 'login.html';
  },

  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  currentUser() {
    try {
      return JSON.parse(sessionStorage.getItem('fin_user')) || { name: 'Admin', role: 'admin' };
    } catch { return { name: 'Admin', role: 'admin' }; }
  },
};

// ─── Inicializa página de login ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
    return;
  }

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const errEl = document.getElementById('loginError');
    const btn = loginForm.querySelector('button[type="submit"]');

    btn.classList.add('loading');
    btn.disabled = true;
    errEl.style.display = 'none';

    try {
      const ok = await Auth.login(user, pass);
      if (ok) {
        btn.classList.remove('loading');
        btn.classList.add('success');
        btn.textContent = 'Entrando…';
        setTimeout(() => { window.location.href = 'index.html'; }, 600);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (err) {
      btn.classList.remove('loading');
      btn.disabled = false;
      errEl.textContent = err.message === 'Credenciais inválidas'
        ? 'Usuário ou senha inválidos.'
        : 'Não foi possível conectar.';
      errEl.style.display = 'block';
      ['username', 'password'].forEach(id => {
        document.getElementById(id)?.classList.add('input-error');
      });
      setTimeout(() => {
        errEl.style.display = 'none';
        ['username', 'password'].forEach(id =>
          document.getElementById(id)?.classList.remove('input-error')
        );
      }, 4000);
    }
  });

  // Toggle senha
  document.getElementById('togglePassword')?.addEventListener('click', () => {
    const inp = document.getElementById('password');
    const btn = document.getElementById('togglePassword');
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁' : '🙈';
  });
});
