/**
 * FOOD PILOT — Food Pilot
 * app.js — JavaScript centralise
 * ============================================================
 */

'use strict';

/* ============================================================
   1. UTILITAIRES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatCFA(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getCurrentDate() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

/* ============================================================
   2. VISIBILITÉ DU MOT DE PASSE
   ============================================================ */
function initPasswordToggle() {
  $$('[data-toggle-password]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.togglePassword;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  });

  // Retro-compat: boutons visibility sans data-attribute
  $$('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.form-input-group, .relative')?.querySelector('input[type="password"], input[type="text"]');
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    });
  });
}

/* ============================================================
   3. NAVIGATION — AUTHENTIFICATION SIMULÉE
   ============================================================ */
function initLoginForms() {
  // Formulaire login client
  const formClient = document.getElementById('form-login-client');
  if (formClient) {
    formClient.addEventListener('submit', e => {
      e.preventDefault();
      const email = formClient.querySelector('input[type="text"], input[type="email"]')?.value?.trim();
      if (!email) { showToast('Veuillez saisir votre email ou telephone', 'error'); return; }
      showToast('Connexion reussie !', 'success');
      setTimeout(() => { window.location.href = 'client-menu.html'; }, 800); // /pages/client-menu.html
    });
  }

  // Formulaire login manager
  const formManager = document.getElementById('form-login-manager');
  if (formManager) {
    formManager.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email-manager')?.value?.trim();
      const pwd   = document.getElementById('password-manager')?.value?.trim();
      if (!email || !pwd) { showToast('Veuillez remplir tous les champs', 'error'); return; }
      showToast('Connexion sécurisée en coursa€¦', 'info');
      setTimeout(() => { window.location.href = 'manager-dashboard.html'; }, 800); // /pages/manager-dashboard.html
    });
  }

  // Formulaire login serveur
  const formWaiter = document.getElementById('form-login-waiter');
  if (formWaiter) {
    formWaiter.addEventListener('submit', e => {
      e.preventDefault();
      const id = document.getElementById('employee-id')?.value?.trim();
      if (!id) { showToast('Veuillez saisir votre ID employe', 'error'); return; }
      showToast('Service demarre !', 'success');
      setTimeout(() => { window.location.href = 'waiter-tablet.html'; }, 800); // /pages/waiter-tablet.html
    });
  }

  // Formulaire login coursier
  const formCourier = document.getElementById('form-login-courier');
  if (formCourier) {
    formCourier.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Connexion reussie !', 'success');
      setTimeout(() => { window.location.href = 'courier-delivery.html'; }, 800); // /pages/courier-delivery.html
    });
  }
}

/* ============================================================
   4. KDS — PAD PIN CUISINE
   ============================================================ */
function initKdsPinPad() {
  const pinDisplay = document.getElementById('kds-pin-display');
  const pinDots    = $$('[data-pin-dot]');
  const pinBtns    = $$('[data-pin-digit]');
  const pinBackspace = document.getElementById('kds-backspace');
  const pinClear     = document.getElementById('kds-clear');
  const pinSubmit    = document.getElementById('kds-submit');

  if (!pinDisplay && !pinDots.length) return;

  let pin = '';
  const maxLen = 4;

  function updateDisplay() {
    pinDots.forEach((dot, i) => {
      if (i < pin.length) {
        dot.classList.remove('bg-stone-700');
        dot.classList.add('bg-amber-400');
      } else {
        dot.classList.add('bg-stone-700');
        dot.classList.remove('bg-amber-400');
      }
    });
  }

  pinBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (pin.length < maxLen) {
        pin += btn.dataset.pinDigit;
        updateDisplay();
        btn.classList.add('scale-95');
        setTimeout(() => btn.classList.remove('scale-95'), 100);
        
        // Redirection automatique quand le PIN est complet
        if (pin.length === maxLen && pinSubmit) {
          setTimeout(() => pinSubmit.click(), 200);
        }
      }
    });
  });

  if (pinBackspace) {
    pinBackspace.addEventListener('click', () => {
      pin = pin.slice(0, -1);
      updateDisplay();
    });
  }
  if (pinClear) {
    pinClear.addEventListener('click', () => { pin = ''; updateDisplay(); });
  }
  if (pinSubmit) {
    pinSubmit.addEventListener('click', () => {
      if (pin.length < 4) { showToast('PIN incomplet', 'error'); return; }
      showToast('Accès au KDS autorisé !', 'success');
      const href = pinSubmit.dataset.href || 'kitchen-kds.html';
      setTimeout(() => { window.location.href = href; }, 600);
    });
  }
}

/* ============================================================
   5. KDS — GESTION DES COMMANDES (Marquer prêt / Commencer)
   ============================================================ */
function initKdsActions() {
  // Remplacé par render.js et les appels onclick inline
  const refreshBtn = document.getElementById('kds-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      refreshBtn.querySelector('.material-symbols-outlined')?.classList.add('spinning');
      showToast('Actualisation en cours…', 'info');
      setTimeout(() => {
        refreshBtn.querySelector('.material-symbols-outlined')?.classList.remove('spinning');
        showToast('KDS à jour', 'success');
      }, 1200);
    });
  }
}

/* ============================================================
   6. TABLETTE SERVEUR — SÉLECTION DE TABLE
   ============================================================ */
function initWaiterTablet() {
  // Logique des tables remplacée par render.js
  
  // Bouton Nouvelle Commande
  const newOrderBtn = document.getElementById('btn-new-order');
  if (newOrderBtn) {
    newOrderBtn.addEventListener('click', () => {
      showToast('Nouvelle commande creee !', 'success');
    });
  }

  // Bouton Envoyer en cuisine
  const sendKitchenBtn = document.getElementById('btn-send-kitchen');
  if (sendKitchenBtn) {
    sendKitchenBtn.addEventListener('click', () => {
      sendKitchenBtn.disabled = true;
      sendKitchenBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Envoyee !';
      sendKitchenBtn.style.background = '#16a34a';
      showToast('Commande envoyee en cuisine !', 'success');
      
      // Simuler l'ajout
      Store.addOrder({
        table: document.querySelector('.table-circle--active')?.closest('[data-table-id]')?.dataset.tableId || 'T1',
        type: 'sur_place',
        items: [{itemId: 'm2', quantity: 1, name: 'Yassa Poulet'}],
        total: 5000,
        status: 'en_attente'
      });

      setTimeout(() => {
        sendKitchenBtn.disabled = false;
        sendKitchenBtn.innerHTML = '<span class="material-symbols-outlined">chef_hat</span> Envoyer en cuisine';
        sendKitchenBtn.style.background = '';
      }, 3000);
    });
  }
}

/* ============================================================
   7. MANAGER — SIDEBAR ACTIVE LINK
   ============================================================ */
function initManagerSidebar() {
  const currentPage = window.location.pathname.split('/').pop();
  $$('.manager-sidebar nav a').forEach(link => {
    const linkPage = link.getAttribute('href')?.split('/').pop();
    if (linkPage === currentPage || link.getAttribute('href') === '#') {
      // Dejà gere via class="active" dans le HTML
    }
  });

  // Logout buttons
  $$('[data-action="logout"]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('Deconnexiona€¦', 'info');
      setTimeout(() => { window.location.href = '../index.html'; }, 800);
    });
  });

  // Bouton Nouvelle Réservation (sidebar)
  const newResaBtn = document.getElementById('btn-new-réservation');
  if (newResaBtn) {
    newResaBtn.addEventListener('click', () => {
      showToast('Fonctionnalite : Nouvelle Réservation', 'info');
    });
  }
}

/* ============================================================
   8. MANAGER DASHBOARD — KPI & INTERACTIONS
   ============================================================ */
function initManagerDashboard() {
  // Mise à jour de la date
  const dateEl = document.getElementById('dashboard-date');
  if (dateEl) dateEl.textContent = getCurrentDate();

  // Boutons "Voir tout"
  $$('[data-action="voir-tout"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target) window.location.href = target;
    });
  });

  // Boutons visibility commandes
  $$('[data-action="view-order"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const orderId = btn.closest('tr')?.querySelector('td')?.textContent;
      showToast(`Details commande ${orderId}`, 'info');
    });
  });

  // Filtre select revenus
  const revenueSelect = document.getElementById('revenue-period');
  if (revenueSelect) {
    revenueSelect.addEventListener('change', () => {
      showToast(`Donnees : ${revenueSelect.value}`, 'info');
    });
  }
}

/* ============================================================
   9. MANAGER ORDERS — FILTRES ET RECHERCHE
   ============================================================ */
function initManagerOrders() {
  const searchInput = document.getElementById('orders-search');
  const filterBtns  = $$('[data-filter-orders]');
  const rows        = $$('[data-order-row]');

  // Filtres onglets
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active-tab'));
      this.classList.add('active-tab');
      const filter = this.dataset.filterOrders;

      rows.forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else {
          const status = row.dataset.orderStatus;
          row.style.display = status === filter ? '' : 'none';
        }
      });
    });
  });

  // Recherche live
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }
}

/* ============================================================
   10. MANAGER MENU — FILTRES CATÉGORIES
   ============================================================ */
function initManagerMenu() {
  const categoryBtns = $$('[data-menu-category]');
  const menuItems    = $$('[data-menu-item]');

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      categoryBtns.forEach(b => {
        b.classList.remove('btn--primary');
        b.classList.add('btn--ghost');
      });
      this.classList.remove('btn--ghost');
      this.classList.add('btn--primary');

      const cat = this.dataset.menuCategory;
      menuItems.forEach(item => {
        item.style.display = (cat === 'all' || item.dataset.menuItem === cat) ? '' : 'none';
      });
    });
  });

  // Bouton Ajouter un plat
  const addBtn = document.getElementById('btn-add-dish');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      showToast('Formulaire ajout plat — à integrer', 'info');
    });
  }
}

/* ============================================================
   11. MANAGER STAFF — FILTRES & PANEL APERà‡U
   ============================================================ */
function initManagerStaff() {
  const roleBtns   = $$('[data-staff-role]');
  const staffRows  = $$('[data-staff-row]');
  const panel      = document.getElementById('staff-preview-panel');
  const closePanel = document.getElementById('btn-close-staff-panel');

  // Filtres rôles
  roleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      roleBtns.forEach(b => b.classList.remove('active-tab'));
      this.classList.add('active-tab');
      const role = this.dataset.staffRole;
      staffRows.forEach(row => {
        row.style.display = (role === 'all' || row.dataset.staffRow === role) ? '' : 'none';
      });
    });
  });

  // Recherche membres
  const searchInput = document.getElementById('staff-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      staffRows.forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // Fermer panel
  if (closePanel && panel) {
    closePanel.addEventListener('click', () => {
      panel.style.transform = 'translateX(100%)';
    });
  }

  // Boutons action
  $$('[data-action="edit-staff"]').forEach(btn => {
    btn.addEventListener('click', () => showToast('Modifier le membre', 'info'));
  });
  $$('[data-action="view-staff"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (panel) panel.style.transform = 'translateX(0)';
    });
  });
  $$('[data-action="delete-staff"]').forEach(btn => {
    btn.addEventListener('click', () => showToast('Supprimer le membre ?', 'error'));
  });

  // Ajouter membre
  const addBtn = document.getElementById('btn-add-member');
  if (addBtn) {
    addBtn.addEventListener('click', () => showToast('Formulaire ajout membre — à integrer', 'info'));
  }
}

/* ============================================================
   12. COURSIER — LIVRAISON
   ============================================================ */
function initCourierDelivery() {
  const deliveredBtn = document.getElementById('btn-mark-delivered');
  if (deliveredBtn) {
    deliveredBtn.addEventListener('click', () => {
      deliveredBtn.disabled = true;
      deliveredBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Livree !';
      deliveredBtn.style.background = '#16a34a';
      showToast('Livraison confirmee !', 'success');
      setTimeout(() => { window.location.href = '../index.html'; }, 2000);
    });
  }

  const callBtn = document.getElementById('btn-call-client');
  if (callBtn) callBtn.addEventListener('click', () => showToast('Appel en coursa€¦', 'info'));

  const chatBtn = document.getElementById('btn-chat-client');
  if (chatBtn) chatBtn.addEventListener('click', () => showToast('Messagerie ouverte', 'info'));

  // Horloge
  const clockEl = document.getElementById('kds-clock');
  if (clockEl) {
    clockEl.textContent = getCurrentTime();
    setInterval(() => { clockEl.textContent = getCurrentTime(); }, 30000);
  }
}

/* ============================================================
   13. TOAST NOTIFICATIONS
   ============================================================ */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    Object.assign(container.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      zIndex: '9999', display: 'flex', flexDirection: 'column', gap: '10px',
      pointerEvents: 'none'
    });
    document.body.appendChild(container);
  }

  const colors = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#15803d', icon: 'check_circle' },
    error:   { bg: '#fef2f2', border: '#fca5a5', text: '#b91c1c', icon: 'error' },
    info:    { bg: '#fffbeb', border: '#fde68a', text: '#b45309', icon: 'info' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#b45309', icon: 'warning' },
  };
  const c = colors[type] || colors.info;

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  Object.assign(toast.style, {
    background: c.bg, border: `1px solid ${c.border}`,
    color: c.text, padding: '12px 16px',
    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '14px', fontWeight: '500',
    opacity: '0', transform: 'translateX(20px)',
    transition: 'opacity 0.3s, transform 0.3s',
    pointerEvents: 'all', minWidth: '240px', maxWidth: '360px',
  });
  toast.innerHTML = `
    <span class="material-symbols-outlined" style="font-size:20px;flex-shrink:0;">${c.icon}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ============================================================
   14. HORLOGE TEMPS RÉEL (KDS / Waiter)
   ============================================================ */
function initClock() {
  $$('[data-live-clock]').forEach(el => {
    el.textContent = getCurrentTime();
    setInterval(() => { el.textContent = getCurrentTime(); }, 1000);
  });
}

/* ============================================================
   15. CSS SPINNING (pour refresh)
   ============================================================ */
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinning { animation: spin 0.8s linear infinite; display: inline-block; }
`;
document.head.appendChild(spinStyle);

/* ============================================================
   INIT — Detection automatique de la page courante
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Commun à toutes les pages
  initPasswordToggle();
  initClock();
  initLoginForms();

  // Detection de contexte par body data-page ou par classes presentes
  const body = document.body;
  const page = body.dataset.page || '';

  if (page === 'kds' || body.classList.contains('kds-body')) {
    initKdsPinPad();
    initKdsActions();
  }
  if (page === 'waiter') initWaiterTablet();
  if (page === 'manager-dashboard') {
    initManagerSidebar();
    initManagerDashboard();
  }
  if (page === 'manager-orders') {
    initManagerSidebar();
    initManagerOrders();
  }
  if (page === 'manager-menu') {
    initManagerSidebar();
    initManagerMenu();
  }
  if (page === 'manager-staff') {
    initManagerSidebar();
    initManagerStaff();
  }
  if (['manager-analytics','manager-réservations','manager-inventory','manager-settings'].includes(page)) {
    initManagerSidebar();
  }
  if (page === 'courier') initCourierDelivery();

  // Fallback: init tout si pas de data-page
  if (!page) {
    initKdsPinPad();
    initKdsActions();
    initWaiterTablet();
    initManagerSidebar();
    initManagerDashboard();
    initManagerOrders();
    initManagerMenu();
    initManagerStaff();
    initCourierDelivery();
  }
});

