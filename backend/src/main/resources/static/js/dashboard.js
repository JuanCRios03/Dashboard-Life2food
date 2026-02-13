// Dashboard functionality
let productsChartInstance = null;
let categoriesChartInstance = null;

document.addEventListener('DOMContentLoaded', function() {
    // Cargar estadísticas reales primero
    loadDashboardStats();
    
    // Inicializar gráficos después de cargar datos
    setTimeout(() => {
        initCharts();
    }, 1000);
    
    // Actualizar datos cada 30 segundos
    setInterval(loadDashboardStats, 30000);
});

// Cargar estadísticas del dashboard
async function loadDashboardStats() {
    try {
        console.log('Cargando estadísticas del dashboard...');
        
        // Obtener datos de usuarios
        const users = await UsersAPI.getAll();
        const userCount = users.length;
        const userElement = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (userElement) {
            userElement.textContent = formatNumber(userCount);
        }
        console.log('Usuarios cargados:', userCount);

        // Obtener compras y valor total desde carritos
        const cartResponses = await Promise.all(
            users.map(user => CartAPI.getCart(user.id).catch(() => null))
        );
        let totalItems = 0;
        let totalValue = 0;

        cartResponses.forEach(cart => {
            const items = normalizeCartItems(cart);
            items.forEach(item => {
                const quantity = item.quantity || item.cantidad || 1;
                const price = item.product?.price || item.price || item.precio || 0;
                totalItems += quantity;
                totalValue += (price * quantity);
            });
        });

        const purchasesElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (purchasesElement) {
            purchasesElement.textContent = formatNumber(totalItems);
        }

        const revenueElement = document.querySelector('.stat-card:nth-child(3) .stat-number');
        if (revenueElement) {
            revenueElement.textContent = formatCurrency(totalValue);
        }
        console.log('Compras y valor total:', totalItems, totalValue);
        
        // Obtener datos de productos
        const products = await ProductsAPI.getAll();
        const productCount = products.length;
        const productElement = document.querySelector('.stat-card:nth-child(4) .stat-number');
        if (productElement) {
            productElement.textContent = productCount;
        }
        console.log('Productos cargados:', productCount);
        
        // Actualizar gráfica de productos con datos reales
        if (products.length > 0) {
            updateProductsChart(products);
            updateCategoriesChart(products);
        }
        
        console.log('Dashboard actualizado con datos reales');
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        alert('Error al cargar datos de la API. Revisa la consola para más detalles.');
    }
}

function normalizeCartItems(cart) {
    if (!cart) return [];
    if (Array.isArray(cart)) return cart;
    if (cart.items && Array.isArray(cart.items)) return cart.items;
    if (cart.cartItems && Array.isArray(cart.cartItems)) return cart.cartItems;
    return [];
}

function initCharts() {
    // Gráfico de Barras - Ventas por Mes
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [3200, 4100, 3800, 5200, 4900, 5800, 6200, 5400],
                    backgroundColor: '#4CAF50',
                    borderColor: '#388E3C',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Gráfico de Barras Horizontal - Productos Más Vendidos
    const productsCtx = document.getElementById('productsChart');
    if (productsCtx) {
        productsChartInstance = new Chart(productsCtx, {
            type: 'bar',
            data: {
                labels: ['Cargando...'],
                datasets: [{
                    label: 'Productos',
                    data: [0],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Gráfico de Pastel - Distribución de Categorías
    const categoriesCtx = document.getElementById('categoriesChart');
    if (categoriesCtx) {
        categoriesChartInstance = new Chart(categoriesCtx, {
            type: 'pie',
            data: {
                labels: ['Cargando...'],
                datasets: [{
                    data: [1],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Gráfico de Dona - Usuarios Nuevos vs Recurrentes
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        new Chart(usersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Nuevos', 'Recurrentes'],
                datasets: [{
                    data: [35, 65],
                    backgroundColor: [
                        '#2196F3',
                        '#4CAF50'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function updateDashboardData() {
    loadDashboardStats();
}

// Actualizar gráfica de productos con datos reales
function updateProductsChart(products) {
    if (!productsChartInstance) return;
    
    // Tomar los primeros 5 productos
    const topProducts = products.slice(0, 5);
    const labels = topProducts.map(p => p.name || p.nombre || 'Sin nombre');
    const data = topProducts.map(p => p.stock || 0);
    
    productsChartInstance.data.labels = labels;
    productsChartInstance.data.datasets[0].data = data;
    productsChartInstance.update();
    
    console.log('Gráfica de productos actualizada');
}

// Actualizar gráfica de categorías con datos reales
function updateCategoriesChart(products) {
    if (!categoriesChartInstance) return;
    
    // Contar productos por categoría
    const categoryCounts = {};
    products.forEach(p => {
        const category = p.category || p.categoria || 'Sin categoría';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    const labels = Object.keys(categoryCounts);
    const data = Object.values(categoryCounts);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#4BC0C0'];
    
    categoriesChartInstance.data.labels = labels;
    categoriesChartInstance.data.datasets[0].data = data;
    categoriesChartInstance.data.datasets[0].backgroundColor = colors.slice(0, labels.length);
    categoriesChartInstance.update();
    
    console.log('Gráfica de categorías actualizada');
}

// Función para formatear números
function formatNumber(num) {
    return new Intl.NumberFormat('es-CO').format(num);
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(amount);
}

// Función para formatear fechas
function formatDate(date) {
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}
