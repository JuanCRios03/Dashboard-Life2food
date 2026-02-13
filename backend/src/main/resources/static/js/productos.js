// Productos functionality
let allProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProducts(); // Cargar productos desde la API
    initProductosPage();
});

// Cargar productos desde la API
async function loadProducts() {
    try {
        const products = await ProductsAPI.getAll();
        allProducts = products;
        displayProducts(products);
    } catch (error) {
        console.error('Error cargando productos:', error);
        showError('No se pudieron cargar los productos. Verifica la conexión con la API.');
    }
}

// Mostrar productos en la tabla
function displayProducts(products) {
    const tbody = document.querySelector('.data-table tbody');
    if (!tbody) return;

    tbody.innerHTML = products.map(product => {
        const name = product.name || product.nombre || 'Sin nombre';
        const category = product.category || product.categoria || 'Sin categoría';
        const price = Number(product.price ?? product.precio ?? 0);
        const sales = Number(product.sales ?? product.ventas ?? 0);
        const revenue = Number(product.revenue ?? product.ingresos ?? (price * sales));
        const stock = Number(product.stock ?? product.amount ?? 0);
        const isActive = product.active !== false;

        const statusLabel = !isActive
            ? 'Inactivo'
            : stock > 10
                ? 'Activo'
                : stock > 0
                    ? 'Stock bajo'
                    : 'Sin stock';

        const statusClass = !isActive
            ? 'badge-danger'
            : stock > 10
                ? 'badge-success'
                : 'badge-warning';

        return `
        <tr>
            <td>#${product.id ?? ''}</td>
            <td>${renderProductImage(product)}</td>
            <td>${name}</td>
            <td>${category}</td>
            <td>${formatCurrency(price)}</td>
            <td>${sales}</td>
            <td>${formatCurrency(revenue)}</td>
            <td>${stock}</td>
            <td><span class="badge ${statusClass}">${statusLabel}</span></td>
            <td>
                <button class="btn-action" onclick="viewProductDetails(${product.id})" title="Ver">Ver</button>
                <button class="btn-action" onclick="editProduct(${product.id})" title="Editar">Editar</button>
                <button class="btn-action" onclick="deleteProductById(${product.id})" title="Eliminar">Eliminar</button>
            </td>
        </tr>
        `;
    }).join('');
}

function renderProductImage(product) {
    const imageUrl = product.image || product.imageUrl || product.imagen || product.foto;
    if (imageUrl) {
        return `<img class="product-img" src="${imageUrl}" alt="${product.name || product.nombre || 'Producto'}">`;
    }
    return '<div class="product-img">IMG</div>';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount || 0);
}

function initProductosPage() {
    // Búsqueda de productos
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            filterProducts(e.target.value);
        });
    }
    
    // Filtro de categoría
    const categoryFilter = document.querySelector('.filter-select');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            filterByCategory(e.target.value);
        });
    }
}

function filterProducts(searchTerm) {
    console.log('Buscando productos:', searchTerm);
    
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

function filterByCategory(category) {
    console.log('Filtrando por categoría:', category);
    
    const rows = document.querySelectorAll('.data-table tbody tr');
    rows.forEach(row => {
        if (category === 'all') {
            row.style.display = '';
        } else {
            const categoryCell = row.querySelectorAll('td')[3]; // Columna de categoría
            if (categoryCell) {
                const productCategory = categoryCell.textContent.toLowerCase();
                const filterCategory = category.toLowerCase();
                
                // Mapear valores del filtro a nombres de categorías
                const categoryMap = {
                    'burgers': 'hamburguesa',
                    'pizza': 'pizza',
                    'salads': 'ensalada',
                    'drinks': 'bebida',
                    'desserts': 'postre'
                };
                
                if (productCategory.includes(categoryMap[filterCategory] || filterCategory)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        }
    });
}

function setupProductButtons() {
    // Botones de ver
    document.querySelectorAll('.btn-action[title="Ver"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const productId = row.querySelector('td').textContent;
            viewProductDetails(productId);
        });
    });
    
    // Botones de editar
    document.querySelectorAll('.btn-action[title="Editar"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const productId = row.querySelector('td').textContent;
            editProduct(productId);
        });
    });
}

function viewProductDetails(productId) {
    console.log('Ver detalles del producto:', productId);
    const product = allProducts.find(p => p.id == productId);
    if (product) {
        alert(`Producto: ${product.name || product.nombre}\nPrecio: $${product.price || product.precio}\nStock: ${product.stock || 0}`);
    }
}

function editProduct(productId) {
    console.log('Editar producto:', productId);
    const product = allProducts.find(p => p.id == productId);
    if (product) {
        const newName = prompt('Nuevo nombre:', product.name || product.nombre);
        const newPrice = prompt('Nuevo precio:', product.price || product.precio);
        
        if (newName && newPrice) {
            updateProduct(productId, { name: newName, price: parseFloat(newPrice) });
        }
    }
}

async function updateProduct(id, data) {
    try {
        await ProductsAPI.update(id, data);
        showSuccess('Producto actualizado correctamente');
        loadProducts();
    } catch (error) {
        console.error('Error actualizando producto:', error);
        showError('No se pudo actualizar el producto');
    }
}

async function deleteProductById(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        try {
            await ProductsAPI.delete(productId);
            showSuccess('Producto eliminado correctamente');
            loadProducts();
        } catch (error) {
            console.error('Error eliminando producto:', error);
            showError('No se pudo eliminar el producto');
        }
    }
}

// Exportar productos a CSV
function exportProductsToCSV() {
    console.log('Exportando productos a CSV...');
    alert('Exportación de productos\n(Esta funcionalidad se implementará con datos reales)');
}

// Actualizar stock de producto
function updateProductStock(productId, newStock) {
    console.log(`Actualizando stock del producto ${productId}: ${newStock}`);
    
    // En producción, esto hará una petición PATCH al backend
    // window.auth.authenticatedFetch(`/api/products/${productId}/stock`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({ stock: newStock })
    // });
}

// Función para obtener productos más vendidos
function getTopProducts() {
    console.log('Obteniendo productos más vendidos...');
    
    // En producción, esto hará una petición al backend
    // window.auth.authenticatedFetch('/api/products/top-selling')
    //     .then(response => response.json())
    //     .then(data => {
    //         updateTopProductsChart(data);
    //     });
}
