document.addEventListener('DOMContentLoaded', function() {
    // Manejar clics en botones "Comprar Ahora"
    const buyButtons = document.querySelectorAll('.buy-now');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtener datos del producto desde el elemento padre
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.dataset.name;
            const productPrice = productCard.dataset.price;
            
            // Guardar información del producto en localStorage
            const productData = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            };
            
            localStorage.setItem('selectedProduct', JSON.stringify(productData));
            
            // Redirigir a la página de facturación
            window.location.href = 'facturacion.html';
        });
    });
});