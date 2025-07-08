const burger = document.getElementById('burger-menu');
const navUl = document.querySelector('nav ul');
burger.addEventListener('click', () => {
  navUl.classList.toggle('active');
});
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 50 ? '#111' : '#222';
});
const scrollBtn = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
});
scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
const cookieNotification = document.getElementById('cookie-notification');
const acceptCookiesBtn = document.getElementById('accept-cookies');
if (sessionStorage.getItem('cookiesAccepted')) {
  cookieNotification.style.display = 'none';
} else {
  cookieNotification.style.display = 'flex';
}
acceptCookiesBtn.addEventListener('click', () => {
  sessionStorage.setItem('cookiesAccepted', 'true');
  cookieNotification.style.display = 'none';
});
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
function updateCartDisplay() {
  const cartProducts = document.getElementById('cart-products');
  if (!cartProducts) return;
  if (!cart.length) {
    cartProducts.innerHTML = '<p>No products selected.</p>';
    return;
  }
  cartProducts.innerHTML = '';
  cart.forEach(product => {
    const div = document.createElement('div');
    div.className = 'cart-product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <div class="cart-product-info">
        <span class="cart-product-name">${product.title}</span>
        <span class="cart-product-price">$${product.price}</span>
        <span class="cart-product-qty">Quantity: ${product.quantity}</span>
      </div>
      <button class="remove-from-cart"></button>
    `;
    div.querySelector('.remove-from-cart').addEventListener('click', () => {
      if (product.quantity > 1) {
        product.quantity--;
      } else {
        cart = cart.filter(p => p.id !== product.id);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartDisplay();
    });
    cartProducts.appendChild(div);
  });
}
updateCartDisplay();
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
async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products?limit=20');
    const data = await res.json();
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = '';
    data.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h3>${product.title}</h3>
        <img src="${product.image}" alt="${product.title}" style="max-width:100px;max-height:100px;object-fit:contain;display:block;margin:0 auto 8px;">
        <p>${product.description.substring(0, 60)}...</p>
        <strong>$${product.price}</strong><br>
        <button class="view-detail">View in Detail</button>
        <button>Add to Cart</button>
      `;
      card.querySelector('button:last-of-type').addEventListener('click', () => {
        const existing = cart.find(p => p.id === product.id);
        if (existing) {
          existing.quantity++;
        } else {
          cart.push({ id: product.id, title: product.title, image: product.image, price: product.price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('Product added to cart!');
      });
      card.querySelector('.view-detail').addEventListener('click', () => {
        window.location.href = `description.html?id=${product.id}`;
      });
      productList.appendChild(card);
    });
  } catch (err) {
    document.getElementById('product-list').innerHTML = '<p>Failed to load products.</p>';
  }
}
fetchProducts();
const form = document.getElementById('contact-form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const telephoneNumber = document.getElementById('personal-number').value.trim();
  const personalId = document.getElementById('personal-id').value.trim() || 'None';
  const selectedProducts = (JSON.parse(localStorage.getItem('cart') || '[]')).map(p => ({ name: p.title, quantity: p.quantity }));
  const nameRegex = /^[A-Za-z\s\-]+$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const telephoneNumberRegex = /^\+995\s*\d{3}\s*\d{2}\s*\d{2}\s*\d{2}$/;
  if (!name) { alert('Please enter your name.'); return; }
  if (!nameRegex.test(name)) { alert('Name must only contain letters, spaces, or hyphens.'); return; }
  if (!emailRegex.test(email)) { alert('Please enter a valid email address.'); return; }
  if (telephoneNumber && !telephoneNumberRegex.test(telephoneNumber)) { alert('Telephone number must be in the format +995 558 23 25 22.'); return; }
  alert('Form submitted successfully!');
  form.reset();
});
const personalIdInput = document.getElementById('personal-id');
const toggleIdBtn = document.getElementById('toggle-id-visibility');
if (personalIdInput && toggleIdBtn) {
  toggleIdBtn.addEventListener('click', () => {
    if (personalIdInput.type === 'text') {
      personalIdInput.type = 'password';
      toggleIdBtn.textContent = 'Show';
    } else {
      personalIdInput.type = 'text';
      toggleIdBtn.textContent = 'Hide';
    }
  });
  personalIdInput.addEventListener('input', () => {
    personalIdInput.value = personalIdInput.value.replace(/\D/g, '');
    if (personalIdInput.value.length > 11) {
      personalIdInput.value = personalIdInput.value.slice(0, 11);
    }
  });
}
const telephoneInput = document.getElementById('personal-number');
if (telephoneInput) {
  const prefix = '+995 ';
  telephoneInput.addEventListener('focus', () => {
    if (telephoneInput.value === '') {
      telephoneInput.value = prefix;
      setTimeout(() => {
        telephoneInput.setSelectionRange(prefix.length, prefix.length);
      }, 0);
    }
  });
  telephoneInput.addEventListener('keydown', (e) => {
    const cursorPos = telephoneInput.selectionStart;
    if ((e.key === 'Backspace' && cursorPos <= prefix.length) || (e.key === 'Delete' && cursorPos < prefix.length)) {
      e.preventDefault();
    }
  });
  telephoneInput.addEventListener('input', () => {
    const currentValue = telephoneInput.value;
    if (currentValue === '') return;
    if (!currentValue.startsWith(prefix)) {
      const digits = currentValue.replace(/\D/g, '');
      telephoneInput.value = prefix + digits;
    }
    if (currentValue.length < prefix.length) {
      telephoneInput.value = prefix;
    }
    if (telephoneInput.selectionStart < prefix.length) {
      telephoneInput.setSelectionRange(prefix.length, prefix.length);
    }
  });
  telephoneInput.addEventListener('blur', () => {
    const digitsOnly = telephoneInput.value.replace(/\D/g, '');
  });
}
const navLinks = document.querySelectorAll('nav a[href^="#"]');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      e.preventDefault();
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const sectionTop = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 12;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
      navUl.classList.remove('active');
      burger.classList.remove('active');
    }
  });
});
function typeWriterEffectWords(element, text, speed = 80) {
  const words = text.split(' ');
  let i = 0;
  function type() {
    if (i <= words.length) {
      element.innerHTML = words.slice(0, i).join(' ') + (i < words.length ? ' <span class=\"type-cursor\">|</span>' : '');
      i++;
      setTimeout(type, speed);
    } else {
      element.innerHTML = words.join(' ');
    }
  }
  type();
}
let aboutTypedStarted = false;
function startAboutTypewriterIfVisible() {
  if (aboutTypedStarted) return;
  const aboutTyped = document.getElementById('about-typed');
  if (!aboutTyped) return;
  const rect = aboutTyped.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    aboutTypedStarted = true;
    const text = aboutTyped.getAttribute('data-text');
    typeWriterEffectWords(aboutTyped, text, 80);
    window.removeEventListener('scroll', startAboutTypewriterIfVisible);
  }
}
window.addEventListener('scroll', startAboutTypewriterIfVisible);
window.addEventListener('DOMContentLoaded', startAboutTypewriterIfVisible);