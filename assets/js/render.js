/**
 * FOOD PILOT — RENDER.JS
 * Logique de rendu dynamique de l'interface basée sur le Store (localStorage)
 */

const Render = {
  init() {
    const page = document.body.dataset.page || '';
    
    // Initial render
    this.renderPage(page);
    
    // Re-render when store changes
    Store.subscribe(() => {
      this.renderPage(page);
    });
  },

  renderPage(page) {
    if (page === 'client') {
      this.renderClientMenu();
      this.renderClientCart();
      this.renderClientOrders();
      this.renderClientReservations();
    }
    if (page === 'client-menu') this.renderClientMenu(); // legacy support
    if (page === 'kds') this.renderKdsOrders();
    if (page === 'waiter') this.renderWaiterTablet();
    if (page === 'manager-orders') this.renderManagerOrders();
    if (page === 'manager-dashboard') this.renderManagerDashboard();
  },

  // ==========================================
  // === 1. MODULE CLIENT (SPA)
  // ==========================================
  
  renderClientMenu() {
    const container = document.getElementById('client-menu-container');
    if (!container) return;

    const activeCatBtn = document.querySelector('#menu-categories .category-pill.active');
    const activeCategory = activeCatBtn ? activeCatBtn.dataset.cat : 'all';
    
    let items = Store.data.menu;
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    
    let html = '';
    items.forEach(item => {
      html += `
        <div class="dish-card bg-white p-4 flex gap-4 items-start rounded-2xl border border-stone-100 shadow-sm relative">
          <div class="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-stone-900 mb-1">${item.name}</h3>
            <p class="text-sm text-stone-500 mb-2 line-clamp-2">Temps prép: ${item.prepTime} min</p>
            <div class="flex items-center justify-between mt-2">
              <span class="font-bold text-primary text-lg">${formatCFA(item.price)}</span>
              <button class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary-tint transition-colors" onclick="ClientApp.addToCart('${item.id}')">
                <span class="material-symbols-outlined text-lg">add</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  renderClientCart() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('btn-checkout');
    
    if (badge) {
      const count = Store.data.cart.reduce((c, i) => c + i.quantity, 0);
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
    
    if (itemsContainer) {
      let html = '';
      if (Store.data.cart.length === 0) {
        html = '<div class="text-center py-10 text-stone-500">Votre panier est vide</div>';
        if (checkoutBtn) checkoutBtn.disabled = true;
      } else {
        if (checkoutBtn) checkoutBtn.disabled = false;
        Store.data.cart.forEach(item => {
          html += `
            <div class="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              <div class="flex-1">
                <p class="font-bold text-stone-800">${item.name}</p>
                <p class="text-sm text-primary font-semibold">${formatCFA(item.price)}</p>
              </div>
              <div class="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-stone-200">
                <button onclick="ClientApp.updateCartQty('${item.id}', -1)" class="text-stone-400 hover:text-primary"><span class="material-symbols-outlined text-sm">remove</span></button>
                <span class="font-bold w-4 text-center">${item.quantity}</span>
                <button onclick="ClientApp.updateCartQty('${item.id}', 1)" class="text-stone-400 hover:text-primary"><span class="material-symbols-outlined text-sm">add</span></button>
              </div>
              <button onclick="ClientApp.removeFromCart('${item.id}')" class="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"><span class="material-symbols-outlined text-sm">delete</span></button>
            </div>
          `;
        });
      }
      itemsContainer.innerHTML = html;
    }
    
    if (totalEl) totalEl.textContent = formatCFA(Store.getCartTotal());
  },

  renderClientOrders() {
    const container = document.getElementById('client-orders-list');
    if (!container) return;
    
    // On simule que le client voit uniquement ses commandes (filtrage basique clientName='Client Web')
    const myOrders = Store.data.orders.filter(o => o.clientName === 'Client Web' || o.table === 'Client').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (myOrders.length === 0) {
      container.innerHTML = '<div class="text-center py-10 text-stone-500">Vous n\'avez aucune commande en cours.</div>';
      return;
    }

    let html = '';
    myOrders.forEach(order => {
      let statusColor = '';
      let statusText = '';
      let canCancel = order.status === 'en_attente';
      let isPaid = order.status === 'payee';
      
      const steps = ['en_attente', 'en_preparation', 'en_cuisson', 'prete', 'en_livraison', 'livree'];
      let currentStepIndex = steps.indexOf(order.status);
      if (order.status === 'servie' || order.status === 'payee') currentStepIndex = 5; // Considérée comme livrée/finie
      
      switch(order.status) {
        case 'en_attente': statusText = 'En attente'; statusColor = 'bg-stone-100 text-stone-600 border-stone-200'; break;
        case 'en_preparation': statusText = 'En préparation'; statusColor = 'bg-orange-100 text-orange-700 border-orange-200'; break;
        case 'en_cuisson': statusText = 'En cuisson'; statusColor = 'bg-orange-100 text-orange-700 border-orange-200'; break;
        case 'prete': statusText = 'Prête !'; statusColor = 'bg-yellow-100 text-yellow-700 border-yellow-200'; break;
        case 'en_livraison': statusText = 'En livraison'; statusColor = 'bg-blue-100 text-blue-700 border-blue-200'; break;
        case 'livree': 
        case 'servie': 
        case 'payee': statusText = 'Terminée'; statusColor = 'bg-green-100 text-green-700 border-green-200'; break;
        case 'annulee': statusText = 'Annulée'; statusColor = 'bg-red-100 text-red-700 border-red-200'; break;
      }

      const formatTime = (isoString) => new Date(isoString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      const lastUpdateStr = order.lastUpdate ? formatTime(order.lastUpdate) : formatTime(order.createdAt);

      html += `
        <div class="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm transition-all duration-300">
          <div class="flex justify-between items-start mb-6">
            <div>
              <p class="text-xs text-stone-500 uppercase tracking-wider">Commande N° ${order.id}</p>
              <p class="text-xs text-stone-400 mt-1">Mise à jour à ${lastUpdateStr}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColor} animate-pulse">${statusText}</span>
          </div>
          
          ${order.status !== 'annulee' ? `
          <div class="relative flex justify-between items-center mb-8 px-2">
            <!-- Ligne de fond -->
            <div class="absolute top-1/2 left-0 right-0 h-1 bg-stone-100 -z-10 -translate-y-1/2 rounded-full"></div>
            <!-- Ligne de progression -->
            <div class="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-in-out" style="width: ${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%;"></div>
            
            ${steps.map((step, index) => {
              const isPast = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              let icon = '';
              if (index === 0) icon = 'schedule';
              else if (index === 1) icon = 'restaurant_menu';
              else if (index === 2) icon = 'local_fire_department';
              else if (index === 3) icon = 'done_all';
              else if (index === 4) icon = 'two_wheeler';
              else if (index === 5) icon = 'check_circle';
              
              return `
              <div class="flex flex-col items-center gap-2">
                <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${isPast ? 'bg-primary border-primary text-white scale-110 shadow-md' : 'bg-white border-stone-200 text-stone-300'}">
                  <span class="material-symbols-outlined text-[16px]">${icon}</span>
                </div>
                <!-- Cacher le texte sur petit écran pour éviter le chevauchement -->
                <span class="text-[9px] font-bold uppercase tracking-wider ${isCurrent ? 'text-primary' : (isPast ? 'text-stone-700' : 'text-stone-400')} hidden sm:block">${step.replace('en_', '').replace('_', ' ')}</span>
              </div>
              `;
            }).join('')}
          </div>` : ''}
          
          <div class="space-y-2 mb-4 border-t border-stone-100 pt-4">
            ${order.items.map(i => `<div class="flex justify-between text-sm"><span class="text-stone-600 font-medium">${i.quantity}x ${i.name}</span></div>`).join('')}
          </div>
          
          <div class="flex justify-between items-center border-t border-stone-100 pt-4">
            <span class="font-bold text-lg text-stone-900">${formatCFA(order.total)}</span>
            <div class="flex gap-2">
              <button onclick="ClientApp.showInvoice('${order.id}')" class="btn btn--outline py-2 px-3 text-sm">Facture</button>
              ${canCancel ? `<button onclick="ClientApp.cancelOrder('${order.id}')" class="btn py-2 px-3 text-sm bg-red-50 text-red-600 border-red-200 hover:bg-red-100 transition-colors">Annuler</button>` : ''}
              ${(!isPaid && order.status !== 'annulee' && order.status !== 'livree') ? `<button onclick="ClientApp.openPaymentForOrder('${order.id}')" class="btn btn--primary py-2 px-3 text-sm">Payer</button>` : ''}
            </div>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  renderClientReservations() {
    const container = document.getElementById('client-resa-list');
    if (!container) return;
    
    const myResas = Store.data.reservations.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (myResas.length === 0) {
      container.innerHTML = '<div class="text-sm text-stone-500 italic">Aucune réservation pour le moment.</div>';
      return;
    }
    
    let html = '';
    myResas.forEach(r => {
      html += `
        <div class="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
          <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <span class="material-symbols-outlined">event_seat</span>
          </div>
          <div class="flex-1">
            <p class="font-bold text-stone-900">${r.date} à ${r.time}</p>
            <p class="text-sm text-stone-500">${r.pax} personne(s) • ${r.name}</p>
          </div>
          <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">${r.status}</span>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  // ==========================================
  // === 2. CUISINE (KDS) ===
  // ==========================================
  renderKdsOrders() {
    const main = document.querySelector('main > div');
    if (!main) return;
    
    const kdsOrders = Store.data.orders.filter(o => ['en_attente', 'en_preparation', 'en_cuisson', 'prete'].includes(o.status));
    
    let html = '';
    kdsOrders.forEach(order => {
      let statusColor, statusText, actionBtn, actionData;
      
      if (order.status === 'en_attente') {
        statusColor = 'bg-stone-800 text-stone-400 border-stone-700';
        statusText = 'En attente';
        actionBtn = 'bg-stone-800 text-stone-300 hover:bg-stone-700';
        actionText = 'Commencer la préparation';
        actionData = 'en_preparation';
      } else if (order.status === 'en_preparation') {
        statusColor = 'bg-amber-900/40 text-amber-400 border-amber-700/40';
        statusText = 'En prépa.';
        actionBtn = 'bg-amber-600 text-white hover:bg-amber-500';
        actionText = 'Passer en cuisson';
        actionData = 'en_cuisson';
      } else if (order.status === 'en_cuisson') {
        statusColor = 'bg-orange-900/40 text-orange-400 border-orange-700/40';
        statusText = 'En cuisson';
        actionBtn = 'bg-orange-600 text-white hover:bg-orange-500';
        actionText = 'Marquer Prêt ✓';
        actionData = 'prete';
      } else if (order.status === 'prete') {
        statusColor = 'bg-green-900/30 text-green-400 border-green-700/30';
        statusText = '✓ Prête';
        actionBtn = 'bg-green-600 text-white hover:bg-green-500';
        actionText = 'Notifier le serveur →';
        actionData = 'servie';
      }

      let itemsHtml = order.items.map(item => {
        const menuItem = Store.data.menu.find(m => m.id === item.itemId);
        const name = menuItem ? menuItem.name : (item.name || 'Plat inconnu');
        return `
          <div class="flex items-start gap-3">
            <span class="font-bold text-lg ${order.status === 'prete' ? 'text-green-600' : 'text-stone-500'}">×${item.quantity}</span>
            <div>
              <p class="text-sm font-semibold ${order.status === 'prete' ? 'text-stone-300 line-through opacity-50' : 'text-stone-300'}">${name}</p>
              ${item.note ? `<p class="text-xs text-stone-500">${item.note}</p>` : ''}
            </div>
          </div>
        `;
      }).join('');

      html += `
        <div class="kds-card w-72 flex-shrink-0 flex flex-col ${order.status === 'prete' ? 'kds-card--ready' : ''}">
          <div class="kds-card-header" style="border-bottom-color:#292524;">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="font-label-caps text-[10px] text-stone-400 uppercase tracking-widest">${order.id}</span>
              </div>
              <p class="font-bold text-stone-400 text-lg">${order.table || order.clientName}</p>
            </div>
            <div class="text-right">
              <span class="font-label-caps text-[10px] ${statusColor} border px-2 py-1 rounded-full uppercase">${statusText}</span>
              <p class="text-xs text-stone-500 mt-1">${new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          </div>
          <div class="flex-1 p-4 space-y-3 overflow-y-auto">
            ${itemsHtml}
          </div>
          <div class="p-4 border-t border-stone-800/50 space-y-2">
            <button class="w-full py-3 rounded-xl font-semibold transition-colors ${actionBtn}" onclick="Store.updateOrderStatus('${order.id}', '${actionData}')">
              ${actionText}
            </button>
          </div>
        </div>
      `;
    });
    
    if (kdsOrders.length === 0) {
      html = `<div class="flex items-center justify-center w-full h-full text-stone-500 italic">Aucune commande en cours</div>`;
    }

    main.innerHTML = html;
  },

  // ==========================================
  // === 3. SERVEUR (TABLET) ===
  // ==========================================
  renderWaiterTablet() {
    const tablesGrid = document.querySelector('.grid.gap-4'); 
    if (!tablesGrid) return;

    let html = '';
    Store.data.tables.forEach(table => {
      const isOccupied = table.status === 'occupee';
      html += `
        <button class="bg-white p-4 rounded-2xl border ${isOccupied ? 'border-amber-200 shadow-sm' : 'border-stone-100'} hover:shadow-md transition-all text-left flex flex-col justify-between h-32 relative overflow-hidden" data-table-id="${table.id}" onclick="Render.selectWaiterTable('${table.id}')">
          ${isOccupied ? '<div class="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-[40px] flex items-start justify-end p-3"><span class="w-3 h-3 rounded-full bg-amber-500"></span></div>' : ''}
          <div>
            <h3 class="font-h3 text-stone-800">${table.name}</h3>
            <p class="text-xs ${isOccupied ? 'text-amber-600 font-medium' : 'text-stone-400'} mt-1 uppercase tracking-widest">${isOccupied ? 'Occupée' : 'Libre'}</p>
          </div>
        </button>
      `;
    });
    tablesGrid.innerHTML = html;
  },

  selectWaiterTable(tableId) {
    const table = Store.data.tables.find(t => t.id === tableId);
    showToast(`${table.name} sélectionnée`, 'info');
  },

  // ==========================================
  // === 4. MANAGER ===
  // ==========================================
  renderManagerOrders() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    let html = '';
    Store.data.orders.forEach(order => {
      let statusBadge = '';
      switch(order.status) {
        case 'en_attente': statusBadge = '<span class="badge badge--inactif">En attente</span>'; break;
        case 'en_preparation': statusBadge = '<span class="badge badge--actif">En prépa</span>'; break;
        case 'en_cuisson': statusBadge = '<span class="badge badge--actif">En cuisson</span>'; break;
        case 'prete': statusBadge = '<span class="badge badge--pret">Prête</span>'; break;
        case 'servie': statusBadge = '<span class="badge badge--pret">Servie</span>'; break;
        case 'payee': statusBadge = '<span class="badge badge--paye">Payée</span>'; break;
        case 'annulee': statusBadge = '<span class="badge badge--inactif">Annulée</span>'; break;
      }

      html += `
        <tr data-order-row="${order.status}">
          <td class="font-medium text-stone-900">${order.id}</td>
          <td>${order.table || order.clientName}</td>
          <td>${order.items.reduce((sum, i) => sum + i.quantity, 0)} articles</td>
          <td class="font-semibold text-stone-900">${formatCFA(order.total)}</td>
          <td>${statusBadge}</td>
          <td class="text-right">
            <button class="btn-icon" title="Voir détails" onclick="showToast('Détails ${order.id} (simulation)', 'info')"><span class="material-symbols-outlined">visibility</span></button>
            ${order.status !== 'payee' ? `<button class="btn-icon" title="Encaisser" onclick="Store.updateOrderStatus('${order.id}', 'payee'); showToast('Commande encaissée', 'success');"><span class="material-symbols-outlined text-green-600">payments</span></button>` : ''}
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  },

  renderManagerDashboard() {
    const caEl = document.getElementById('dash-ca');
    const cmdEl = document.getElementById('dash-cmd');
    
    if (caEl) {
      const ca = Store.data.orders.filter(o => o.status === 'payee').reduce((sum, o) => sum + o.total, 0);
      caEl.textContent = formatCFA(ca);
    }
    if (cmdEl) {
      cmdEl.textContent = Store.data.orders.length;
    }
    this.renderManagerOrders(); 
  }
};

// ==========================================
// GLOBAL CLIENT APP LOGIC
// ==========================================
const ClientApp = {
  currentPendingOrderId: null,

  addToCart(itemId) {
    const item = Store.data.menu.find(i => i.id === itemId);
    if (item) {
      Store.addToCart(item);
      showToast(`${item.name} ajouté au panier`, 'success');
      
      // Petit effet d'animation sur l'icône panier
      const badge = document.getElementById('cart-badge');
      if (badge) {
        badge.classList.add('scale-150');
        setTimeout(() => badge.classList.remove('scale-150'), 200);
      }
    }
  },

  removeFromCart(itemId) {
    Store.removeFromCart(itemId);
  },

  updateCartQty(itemId, delta) {
    const item = Store.data.cart.find(i => i.id === itemId);
    if (item) {
      if (item.quantity + delta <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity += delta;
        Store.saveData();
      }
    }
  },

  openCart() {
    document.getElementById('cart-modal').classList.add('active');
  },

  closeCart() {
    document.getElementById('cart-modal').classList.remove('active');
  },

  openPayment() {
    if (Store.data.cart.length === 0) return showToast('Panier vide', 'error');
    this.currentPendingOrderId = null; // On paye le panier actuel
    this.closeCart();
    document.getElementById('payment-modal').classList.add('active');
  },

  openPaymentForOrder(orderId) {
    this.currentPendingOrderId = orderId;
    document.getElementById('payment-modal').classList.add('active');
  },

  closePayment() {
    document.getElementById('payment-modal').classList.remove('active');
  },

  processPayment(method) {
    showToast(`Paiement via ${method} en cours...`, 'info');
    this.closePayment();
    
    setTimeout(() => {
      if (this.currentPendingOrderId) {
        // Payer une commande existante
        Store.updateOrderStatus(this.currentPendingOrderId, 'payee');
        showToast('Paiement réussi !', 'success');
      } else {
        // Payer le panier (créer la commande et la marquer payée... ou laisser en attente si paiement cash)
        const items = Store.data.cart.map(i => ({ itemId: i.id, quantity: i.quantity, name: i.name }));
        const isCash = method === 'Espèces';
        
        Store.addOrder({
          table: 'Client',
          type: 'a_emporter',
          items: items,
          total: Store.getCartTotal(),
          clientName: 'Client Web',
          status: isCash ? 'en_attente' : 'payee'
        });

        Store.clearCart();
        showToast(isCash ? 'Commande validée !' : 'Paiement réussi ! Commande en cuisine.', 'success');
        
        // Rediriger vers l'onglet commandes
        document.querySelector('[data-target="tab-orders"]')?.click();
      }
    }, 1500); // Simulation loading
  },

  cancelOrder(orderId) {
    if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
      Store.cancelOrder(orderId);
      showToast('Commande annulée', 'success');
    }
  },

  showInvoice(orderId) {
    const order = Store.data.orders.find(o => o.id === orderId);
    if (!order) return;
    
    let itemsHtml = order.items.map(i => `
      <div class="flex justify-between py-2 border-b border-stone-100 last:border-0 text-sm">
        <span class="text-stone-700">${i.quantity}x ${i.name}</span>
        <span class="font-semibold">${formatCFA((Store.data.menu.find(m => m.id === i.itemId)?.price || 0) * i.quantity)}</span>
      </div>
    `).join('');

    const invoiceHtml = `
      <div class="text-center mb-6 border-b border-stone-200 pb-6">
        <h3 class="font-h2 text-primary italic text-xl">Food Pilot</h3>
        <p class="text-xs text-stone-500 mt-1">Le Baobab d'Or</p>
        <p class="text-xs text-stone-500 mt-4">Facture N° ${order.id}</p>
        <p class="text-xs text-stone-500">${new Date(order.createdAt).toLocaleString('fr-FR')}</p>
      </div>
      <div class="mb-6">
        ${itemsHtml}
      </div>
      <div class="flex justify-between items-center font-bold text-lg border-t border-stone-800 pt-4">
        <span>TOTAL TTC</span>
        <span class="text-primary">${formatCFA(order.total)}</span>
      </div>
      <div class="text-center mt-8">
        <span class="inline-block px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold uppercase">${order.status === 'payee' ? 'Payée' : 'Non payée'}</span>
      </div>
    `;

    document.getElementById('invoice-details').innerHTML = invoiceHtml;
    document.getElementById('invoice-modal').classList.add('active');
  }
};

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  Render.init();
  
  // Navigation SPA Client
  document.querySelectorAll('.client-bottom-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelectorAll('.client-bottom-nav .nav-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const target = this.dataset.target;
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      document.getElementById(target)?.classList.add('active');
    });
  });

  // Filtres catégories menu client
  document.querySelectorAll('#menu-categories .category-pill').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('#menu-categories .category-pill').forEach(b => {
        b.classList.remove('active', 'text-white');
        b.classList.add('bg-stone-100', 'text-stone-600');
      });
      this.classList.add('active', 'text-white');
      this.classList.remove('bg-stone-100', 'text-stone-600');
      
      // Re-render menu
      Render.renderClientMenu();
    });
  });

  // Soumission Formulaire Réservation
  const resaForm = document.getElementById('resa-form');
  if (resaForm) {
    resaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('resa-name').value;
      const date = document.getElementById('resa-date').value;
      const time = document.getElementById('resa-time').value;
      const pax = document.getElementById('resa-pax').value;

      Store.addReservation({ name, date, time, pax });
      showToast('Réservation confirmée avec succès !', 'success');
      resaForm.reset();
    });
  }
});
