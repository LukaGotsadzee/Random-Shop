
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function showNotification(message) {
  let notif = document.getElementById('cart-notification');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'cart-notification';
    notif.style.position = 'fixed';
    notif.style.top = '24px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = '#222';
    notif.style.color = '#fff';
    notif.style.padding = '12px 32px';
    notif.style.borderRadius = '8px';
    notif.style.fontWeight = 'bold';
    notif.style.fontSize = '1.1rem';
    notif.style.zIndex = '3000';
    notif.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    notif.style.display = 'none';
    document.body.appendChild(notif);
  }
  notif.textContent = message;
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.display = 'none';
  }, 1500);
}

async function loadProductDetail() {
  const id = getProductId();
  if (!id) {
    document.getElementById('product-detail').innerHTML = '<p>Product not found.</p>';
    return;
  }
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    const detailDiv = document.getElementById('product-detail');
    detailDiv.innerHTML = `
      <h3>${product.title}</h3>
      <img src="${product.image}" alt="${product.title}" style="max-width:140px;max-height:140px;object-fit:contain;display:block;margin:0 auto 12px;">
      <p>${product.description}</p>
      <strong>$${product.price}</strong>
      <button id="add-to-cart-detail">Add to Cart</button>
    `;
    document.getElementById('add-to-cart-detail').addEventListener('click', () => {
      let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
      const existing = cart.find(p => p.id === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        cart.push({ id: product.id, title: product.title, image: product.image, price: product.price, quantity: 1 });
      }
      sessionStorage.setItem('cart', JSON.stringify(cart));
      showNotification('Product added to cart!');
    });
  } catch (err) {
    document.getElementById('product-detail').innerHTML = '<p>Failed to load product details.</p>';
  }
}

window.onload = loadProductDetail; 