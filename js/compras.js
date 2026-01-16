// Compras functionality
let allUsers = [];
let allPurchases = []; // Lista de todas las compras individuales
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    loadCartsData();
    initComprasPage();
});

// Cargar carritos de todos los usuarios
async function loadCartsData() {
    try {
        console.log('🔄 Cargando compras...');
        
        // Obtener todos los usuarios
        const users = await UsersAPI.getAll();
        allUsers = users;
        
        console.log('✅ Usuarios cargados:', users.length);
        
        // Obtener carritos de todos los usuarios y convertir a compras individuales
        const cartPromises = users.map(async (user) => {
            try {
                const cart = await CartAPI.getCart(user.id);
                
                // Procesar estructura del carrito
                let items = [];
                if (Array.isArray(cart)) {
                    items = cart;
                } else if (cart && cart.items) {
                    items = cart.items;
                } else if (cart && cart.cartItems) {
                    items = cart.cartItems;
                }
                
                // Convertir cada item del carrito en una compra individual
                return items.map(item => ({
                    user: user,
                    item: item
                }));
            } catch (error) {
                // Usuario sin carrito
                return [];
            }
        });
        
        const results = await Promise.all(cartPromises);
        // Aplanar el array de arrays
        allPurchases = results.flat();
        
        console.log('✅ Total de compras individuales:', allPurchases.length);
        console.log('📦 Datos de compras:', allPurchases);
        
        // Mostrar compras en la tabla
        displayPurchases(currentPage);
        
        // Actualizar estadísticas
        updatePurchasesStats(allPurchases);
        
        // Configurar paginación
        setupPagination();
        
    } catch (error) {
        console.error('Error cargando compras:', error);
        showError('No se pudieron cargar las compras. Verifica la conexión con la API.');
    }
}

// Mostrar compras en la tabla con paginación
function displayPurchases(page) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    
    if (allPurchases.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No hay compras registradas</td></tr>';
        return;
    }
    
    // Calcular índices para la página actual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const purchasesToShow = allPurchases.slice(startIndex, endIndex);
    
    tbody.innerHTML = purchasesToShow.map((purchase, index) => {
        const user = purchase.user;
        const item = purchase.item;
        
        const firstName = user.first_name || user.firstName || user.name || '';
        const lastName = user.last_name || user.lastName || user.apellido || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';
        const userEmail = user.email || user.correo || 'Sin email';
        
        const productName = item.product?.name || item.productName || item.name || 'Producto sin nombre';
        const quantity = item.quantity || item.cantidad || 1;
        const price = item.product?.price || item.price || item.precio || 0;
        const total = price * quantity;
        
        const globalIndex = startIndex + index + 1;
        
        return `
        <tr>
            <td>#${globalIndex}</td>
            <td>${fullName}</td>
            <td>${userEmail}</td>
            <td>${productName}</td>
            <td>${quantity}</td>
            <td>$${price.toFixed(2)}</td>
            <td><strong>$${total.toFixed(2)}</strong></td>
            <td>
                <button class="btn-action" onclick="showPurchaseDetails(${startIndex + index})" title="Ver detalles">👁️</button>
            </td>
        </tr>
        `;
    }).join('');
}

// Actualizar estadísticas de compras
function updatePurchasesStats(purchases) {
    // Total de compras
    document.getElementById('totalCarts').textContent = purchases.length;
    
    // Total de items
    const totalItems = purchases.reduce((sum, purchase) => {
        return sum + (purchase.item.quantity || purchase.item.cantidad || 1);
    }, 0);
    document.getElementById('totalItems').textContent = totalItems;
    
    // Valor total
    const totalValue = purchases.reduce((sum, purchase) => {
        const price = purchase.item.product?.price || purchase.item.price || purchase.item.precio || 0;
        const quantity = purchase.item.quantity || purchase.item.cantidad || 1;
        return sum + (price * quantity);
    }, 0);
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    
    // Promedio por compra
    const avgPurchase = purchases.length > 0 ? totalValue / purchases.length : 0;
    document.getElementById('avgCart').textContent = `$${avgPurchase.toFixed(2)}`;
    
    console.log(`📊 Estadísticas: ${purchases.length} compras, ${totalItems} items, $${totalValue.toFixed(2)} total`);
}

// Configurar paginación
function setupPagination() {
    const totalPages = Math.ceil(allPurchases.length / itemsPerPage);
    const paginationDiv = document.querySelector('.pagination');
    
    if (!paginationDiv || totalPages <= 1) return;
    
    let paginationHTML = '<button class="btn-page" onclick="changePage(\'prev\')">« Anterior</button>';
    
    // Mostrar páginas
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button class="btn-page ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    paginationHTML += '<button class="btn-page" onclick="changePage(\'next\')">Siguiente »</button>';
    
    paginationDiv.innerHTML = paginationHTML;
}

// Cambiar página
function changePage(page) {
    const totalPages = Math.ceil(allPurchases.length / itemsPerPage);
    
    if (page === 'prev') {
        if (currentPage > 1) currentPage--;
    } else if (page === 'next') {
        if (currentPage < totalPages) currentPage++;
    } else {
        currentPage = page;
    }
    
    displayPurchases(currentPage);
    setupPagination();
    
    // Scroll al inicio de la tabla
    document.querySelector('.table-container').scrollIntoView({ behavior: 'smooth' });
}

// Mostrar detalles de una compra específica
function showPurchaseDetails(index) {
    const purchase = allPurchases[index];
    if (!purchase) return;
    
    const user = purchase.user;
    const item = purchase.item;
    
    const firstName = user.first_name || user.firstName || user.name || '';
    const lastName = user.last_name || user.lastName || user.apellido || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';
    const userEmail = user.email || user.correo || 'Sin email';
    
    const productName = item.product?.name || item.productName || item.name || 'Producto sin nombre';
    const quantity = item.quantity || item.cantidad || 1;
    const price = item.product?.price || item.price || item.precio || 0;
    const total = price * quantity;
    const productDesc = item.product?.description || item.description || 'Sin descripción';
    
    console.log('🛒 Mostrando detalle de compra:', purchase);
    
    // Información de la compra
    document.getElementById('modalCartInfo').innerHTML = `
        <div style="background: var(--light-bg); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <h3 style="color: var(--primary-color); margin-bottom: 10px;">Información del Cliente</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>👤 Cliente:</strong> ${fullName}</div>
                <div><strong>📧 Email:</strong> ${userEmail}</div>
            </div>
        </div>
        <h3 style="color: var(--primary-color); margin-bottom: 15px;">📦 Detalle del Producto</h3>
    `;
    
    // Detalle del producto
    const cartList = document.getElementById('modalCartList');
    cartList.innerHTML = `
        <li class="purchase-item">
            <div class="purchase-item-header">
                <span class="product-name">🛍️ ${productName}</span>
                <span class="product-quantity">x${quantity}</span>
            </div>
            <div class="product-details" style="margin-top: 8px;">
                ${productDesc}
            </div>
            <div class="product-details" style="margin-top: 8px;">
                💵 Precio unitario: $${price.toFixed(2)} | <strong>Subtotal: $${total.toFixed(2)}</strong>
            </div>
        </li>
    `;
    
    // Resumen
    document.getElementById('modalCartSummary').innerHTML = `
        <span>🛒 Cantidad: <strong>${quantity}</strong></span>
        <span>💰 Total: <strong>$${total.toFixed(2)}</strong></span>
    `;
    
    // Mostrar modal
    document.getElementById('cartModal').classList.add('active');
}

// Cerrar modal
function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCartModal();
    }
});

function initComprasPage() {
    // Búsqueda de órdenes
    const searchInput = document.getElementById('searchOrders');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterOrders(e.target.value);
        });
    }
    
    // Filtro de estado
    const statusFilter = document.querySelector('.filter-select');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            filterByOrderStatus(e.target.value);
        });
    }
    
    // Filtros de fecha
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    
    if (dateFrom && dateTo) {
        dateFrom.addEventListener('change', applyDateFilter);
        dateTo.addEventListener('change', applyDateFilter);
    }
    
    // Botones de acción
    setupOrderButtons();
}

function filterOrders(searchTerm) {
    console.log('Buscando órdenes:', searchTerm);
    
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterByOrderStatus(status) {
    console.log('Filtrando por estado de orden:', status);
    
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const badge = row.querySelector('.badge');
            if (badge) {
                const orderStatus = badge.textContent.toLowerCase();
                if (
                    (status === 'completed' && orderStatus === 'completada') ||
                    (status === 'pending' && orderStatus === 'pendiente') ||
                    (status === 'cancelled' && orderStatus === 'cancelada')
                ) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    });
}

function applyDateFilter() {
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    console.log('Filtrando por fechas:', dateFrom, 'a', dateTo);
    
    if (!dateFrom || !dateTo) return;
    
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    
    // En producción, esto haría una petición al backend
    alert(`Filtrando compras desde ${dateFrom} hasta ${dateTo}\n(Esta funcionalidad se implementará con datos reales del backend)`);
}

function setupOrderButtons() {
    document.querySelectorAll('.btn-action[title="Ver detalles"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const orderId = row.querySelector('td').textContent;
            viewOrderDetails(orderId);
        });
    });
}

function viewOrderDetails(orderId) {
    console.log('Ver detalles de la orden:', orderId);
    
    // Simulación de detalles
    const details = `
Detalles de la Orden ${orderId}

Esta funcionalidad mostrará:
- Información completa del cliente
- Lista detallada de productos
- Dirección de entrega
- Estado de la orden
- Historial de cambios
- Tiempo estimado de entrega

(Se implementará con un modal y datos reales del backend)
    `;
    
    alert(details);
}

// Exportar compras a CSV
function exportOrdersToCSV() {
    console.log('Exportando compras a CSV...');
    alert('Exportación de compras\n(Esta funcionalidad se implementará con datos reales)');
}

// Actualizar estado de orden
function updateOrderStatus(orderId, newStatus) {
    console.log(`Actualizando orden ${orderId} a estado: ${newStatus}`);
    
    // En producción, esto hará una petición PUT al backend
    // window.auth.authenticatedFetch(`/api/orders/${orderId}/status`, {
    //     method: 'PUT',
    //     body: JSON.stringify({ status: newStatus })
    // });
}
