// ============================================================
// STORAGE.JS — Camada de dados via api.php (lê/escreve db.json)
// Cada operação usa ?action=nome_fixo
// Body: FormData com campo "dados" (JSON) e/ou campo "id"
// ============================================================

const Storage = {
  BASE_URL: 'api.php',

  // ─── Helpers internos ────────────────────────────────────

  // GET simples — só para listagens (sem body)
  async _get(action) {
    const res = await fetch(`${this.BASE_URL}?action=${action}`);
    if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // POST com apenas id (deletar / buscar via POST)
  async _postId(action, id) {
    const form = new FormData();
    form.append('id', String(id));
    const res = await fetch(`${this.BASE_URL}?action=${action}`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // POST com body JSON no campo "dados"
  async _postDados(action, dados) {
    const form = new FormData();
    form.append('dados', JSON.stringify(dados));
    const res = await fetch(`${this.BASE_URL}?action=${action}`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // POST com id + body JSON
  async _postIdDados(action, id, dados) {
    const form = new FormData();
    form.append('id', String(id));
    form.append('dados', JSON.stringify(dados));
    const res = await fetch(`${this.BASE_URL}?action=${action}`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // ─── Categorias ──────────────────────────────────────────

  async getCategories() {
    return this._get('listar_categories');
  },

  async getCategoryById(id) {
    return this._postId('buscar_categoria', id);
  },

  async addCategory(data) {
    return this._postDados('criar_categoria', {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async updateCategory(id, data) {
    return this._postIdDados('atualizar_categoria', id, data);
  },

  async deleteCategory(id) {
    return this._postId('deletar_categoria', id);
  },

  // ─── Transações ──────────────────────────────────────────

  async getTransactions(params = {}) {
    let txs = await this._get('listar_transactions');

    if (params.type)      txs = txs.filter(t => t.type === params.type);
    if (params.status)    txs = txs.filter(t => t.status === params.status);
    if (params.category)  txs = txs.filter(t => t.category === params.category);
    if (params.dateStart) txs = txs.filter(t => t.date >= params.dateStart);
    if (params.dateEnd)   txs = txs.filter(t => t.date <= params.dateEnd);
    if (params.search) {
      const q = params.search.toLowerCase();
      txs = txs.filter(t => t.description.toLowerCase().includes(q));
    }

    txs.sort((a, b) => (a.date < b.date ? 1 : -1));
    return txs;
  },

  async getTransactionById(id) {
    return this._postId('buscar_transaction', id);
  },

  async addTransaction(data) {
    return this._postDados('criar_transaction', {
      ...data,
      createdAt: new Date().toISOString(),
    });
  },

  async updateTransaction(id, data) {
    return this._postIdDados('atualizar_transaction', id, data);
  },

  async deleteTransaction(id) {
    return this._postId('deletar_transaction', id);
  },

  // ─── Settings ────────────────────────────────────────────

  async getSettings() {
    return this._get('listar_settings');
  },

  async updateSettings(data) {
    return this._postDados('atualizar_settings', data);
  },

  // ─── Auth ────────────────────────────────────────────────

  async findUser(username, password) {
    const users = await this._get('listar_users');
    return users.find(
      u => u.username === username && u.password === password
    ) || null;
  },
};
