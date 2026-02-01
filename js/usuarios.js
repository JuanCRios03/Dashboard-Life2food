// Usuarios functionality
let allUsers = [];
let allProducts = []; // Almacenar todos los productos
let userProducts = {}; // Productos por usuario (por email)

document.addEventListener('DOMContentLoaded', function() {
    loadUsersAndProducts(); // Cargar usuarios y productos
    initUsuariosPage();
});

// Cargar usuarios y productos desde la API
async function loadUsersAndProducts() {
    try {
        console.log('Cargando usuarios y productos...');
        
        // Cargar usuarios y productos en paralelo
        const [users, products] = await Promise.all([
            UsersAPI.getAll(),
            ProductsAPI.getAll()
        ]);
        
        allUsers = users;
        allProducts = products;
        
        console.log('Usuarios cargados:', users.length);
        console.log('Productos cargados:', products.length);
        console.log('Productos completos:', products);
        
        // Agrupar productos por usuario (usando email como key)
        groupProductsByUser(users, products);
        
        // Mostrar usuarios con sus productos
        displayUsers(users);
        
        // Actualizar estadísticas
        updateUserStats(users);
        
    } catch (error) {
        console.error('Error cargando datos:', error);
        showError('No se pudieron cargar los datos. Verifica la conexión con la API.');
    }
}

// Agrupar productos por usuario
function groupProductsByUser(users, products) {
    // Inicializar objeto vacío para cada usuario
    users.forEach(user => {
        const userEmail = user.email || user.correo;
        userProducts[userEmail] = [];
    });
    
    // Filtrar productos por usuario
    products.forEach(product => {
        if (product.user && product.user.email) {
            const userEmail = product.user.email;
            if (!userProducts[userEmail]) {
                userProducts[userEmail] = [];
            }
            userProducts[userEmail].push(product);
        }
    });
    
    console.log('Productos agrupados por usuario:', userProducts);
}

// Actualizar estadísticas de usuarios
function updateUserStats(users) {
    // Total de usuarios
    const totalUsers = users.length;
    document.getElementById('totalUsers').textContent = totalUsers;
    
    // Usuarios activos (aquellos con active !== false)
    const activeUsers = users.filter(u => u.active !== false).length;
    document.getElementById('activeUsers').textContent = activeUsers;
    
    // Usuarios nuevos este mes
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const newUsers = users.filter(user => {
        const createdDate = new Date(user.created_at || user.createdAt || user.fechaRegistro);
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    
    document.getElementById('newUsers').textContent = newUsers;
    
    console.log(`Estadísticas: Total=${totalUsers}, Activos=${activeUsers}, Nuevos=${newUsers}`);
}

// Mostrar usuarios en la tabla
function displayUsers(users) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px;">No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        // Obtener el nombre completo del usuario
        const firstName = user.first_name || user.firstName || user.name || user.nombre || '';
        const lastName = user.last_name || user.lastName || user.apellido || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';
        
        // Obtener productos del usuario usando su email
        const userEmail = user.email || user.correo;
        const products = userProducts[userEmail] || [];
        
        let productsDisplay = '';
        
        if (products.length === 0) {
            productsDisplay = '<span class="purchases-preview">Sin productos publicados</span>';
        } else if (products.length === 1) {
            productsDisplay = `<span class="purchases-preview">${products[0].name}</span>`;
        } else {
            productsDisplay = `<span class="purchases-preview">${products.length} productos publicados</span>`;
        }
        
        return `
        <tr>
            <td>${user.id}</td>
            <td>${fullName}</td>
            <td>${userEmail}</td>
            <td class="purchases-cell">${productsDisplay}</td>
            <td>${formatDate(user.createdAt || user.created_at || user.fechaRegistro || new Date())}</td>
            <td>
                <span class="badge ${user.active !== false ? 'badge-success' : 'badge-danger'}">
                    ${user.active !== false ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn-action" onclick="showPurchasesModal('${userEmail}')" title="Ver detalles y productos">Ver</button>
                <button class="btn-action" onclick="editUser(${user.id})" title="Editar">Editar</button>
                <button class="btn-action" onclick="deleteUserById(${user.id})" title="Eliminar">Eliminar</button>
            </td>
        </tr>
        `;
    }).join('');
}

function initUsuariosPage() {
    // Búsqueda de usuarios
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterUsers(e.target.value);
        });
    }
    
    // Filtro de estado
    const statusFilter = document.querySelector('.filter-select');
    if (statusFilter) {
        statusFilter.addEventListener('change', function(e) {
            filterByStatus(e.target.value);
        });
    }
}

function filterUsers(searchTerm) {
    // En producción, esto hará una petición al backend
    console.log('Buscando usuarios:', searchTerm);
    
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

function filterByStatus(status) {
    console.log('Filtrando por estado:', status);
    
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const badge = row.querySelector('.badge');
            if (badge) {
                const rowStatus = badge.textContent.toLowerCase();
                if (
                    (status === 'active' && rowStatus === 'activo') ||
                    (status === 'inactive' && rowStatus === 'inactivo')
                ) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    });
}

function setupActionButtons() {
    // Botones de ver detalles
    document.querySelectorAll('.btn-action[title="Ver detalles"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.querySelector('td').textContent;
            viewUserDetails(userId);
        });
    });
    
    // Botones de editar
    document.querySelectorAll('.btn-action[title="Editar"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const userId = row.querySelector('td').textContent;
            editUser(userId);
        });
    });
}

function viewUserDetails(userId) {
    console.log('Ver detalles del usuario:', userId);
    const user = allUsers.find(u => u.id == userId);
    if (user) {
        const firstName = user.first_name || user.firstName || user.name || '';
        const lastName = user.last_name || user.lastName || user.apellido || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';
        
        alert(`Usuario: ${fullName}\nEmail: ${user.email || user.correo}\nTeléfono: ${user.phone || user.telefono || user.phone_number || 'N/A'}`);
    }
}

function editUser(userId) {
    console.log('Editar usuario:', userId);
    const user = allUsers.find(u => u.id == userId);
    if (user) {
        const firstName = user.first_name || user.firstName || user.name || '';
        const lastName = user.last_name || user.lastName || user.apellido || '';
        
        const newFirstName = prompt('Nuevo nombre:', firstName);
        const newLastName = prompt('Nuevo apellido:', lastName);
        const newEmail = prompt('Nuevo email:', user.email || user.correo);
        
        if (newFirstName && newEmail) {
            updateUser(userId, { 
                first_name: newFirstName, 
                last_name: newLastName,
                email: newEmail 
            });
        }
    }
}

async function updateUser(id, data) {
    try {
        await UsersAPI.update(id, data);
        showSuccess('Usuario actualizado correctamente');
        loadUsers();
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        showError('No se pudo actualizar el usuario');
    }
}

async function deleteUserById(userId) {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
            await UsersAPI.delete(userId);
            showSuccess('Usuario eliminado correctamente');
            loadUsers();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            showError('No se pudo eliminar el usuario');
        }
    }
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

// Mostrar modal de compras
function showPurchasesModal(userEmail) {
    const user = allUsers.find(u => (u.email || u.correo) === userEmail);
    const products = userProducts[userEmail] || [];
    
    if (!user) return;
    
    console.log('Mostrando modal para usuario:', user);
    console.log('Productos del usuario:', products);
    
    const firstName = user.first_name || user.firstName || user.name || '';
    const lastName = user.last_name || user.lastName || user.apellido || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Sin nombre';
    const userStatus = user.active !== false ? 'Activo' : 'Inactivo';
    const registrationDate = formatDate(user.createdAt || user.created_at || user.fechaRegistro || new Date());
    
    // Actualizar información del usuario con más detalles
    document.getElementById('modalUserInfo').innerHTML = `
        <div style="background: var(--light-bg); padding: 15px; border-radius: 8px; margin-bottom: 10px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div><strong>Nombre:</strong> ${fullName}</div>
                <div><strong>Email:</strong> ${userEmail}</div>
                <div><strong>Registro:</strong> ${registrationDate}</div>
                <div><strong>Estado:</strong> <span class="badge ${user.active !== false ? 'badge-success' : 'badge-danger'}">${userStatus}</span></div>
            </div>
        </div>
        <h3 style="color: var(--primary-color); margin-bottom: 15px;">Productos Publicados (${products.length})</h3>
    `;
    
    // Actualizar lista de productos
    const purchasesList = document.getElementById('modalPurchasesList');
    
    if (products.length === 0) {
        purchasesList.innerHTML = '<li class="no-purchases">Este usuario no ha publicado productos todavía</li>';
        document.getElementById('modalPurchasesSummary').innerHTML = '';
    } else {
        purchasesList.innerHTML = products.map((product, index) => {
            const productName = product.name || 'Producto sin nombre';
            const amount = product.amount || 0;
            const price = product.price || 0;
            const description = product.description || 'Sin descripción';
            const expirationDate = product.expirationDate ? new Date(product.expirationDate).toLocaleDateString('es-CO') : 'Sin fecha';
            
            return `
                <li class="purchase-item">
                    <div class="purchase-item-header">
                        <span class="product-name">${productName}</span>
                        <span class="product-quantity">Stock: ${amount}</span>
                    </div>
                    <div class="product-details">
                        Precio: $${price.toFixed(2)} | Vence: ${expirationDate}
                    </div>
                    <div class="product-details" style="margin-top: 5px; font-style: italic; color: #666;">
                        ${description}
                    </div>
                </li>
            `;
        }).join('');
        
        // Calcular totales
        const totalStock = products.reduce((sum, product) => sum + (product.amount || 0), 0);
        const totalValue = products.reduce((sum, product) => sum + ((product.amount || 0) * (product.price || 0)), 0);
        
        document.getElementById('modalPurchasesSummary').innerHTML = `
            <span>Total en inventario: <strong>${totalStock} unidades</strong></span>
            <span>Valor total: <strong>$${totalValue.toFixed(2)}</strong></span>
        `;
    }
    
    // Mostrar modal
    document.getElementById('purchasesModal').classList.add('active');
}

// Cerrar modal de compras
function closePurchasesModal() {
    document.getElementById('purchasesModal').classList.remove('active');
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(event) {
    const modal = document.getElementById('purchasesModal');
    if (event.target === modal) {
        closePurchasesModal();
    }
});

// Exportar a CSV
function exportToCSV() {
    console.log('Exportando usuarios a CSV...');
    // Implementar exportación real cuando tengas datos del backend
    alert('Exportación de CSV\n(Esta funcionalidad se implementará con datos reales)');
}
