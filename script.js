let cart = []; 
let allProducts = []; 

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(data => {
    displayProducts(data);
    allProducts = data;
  });



function displayProducts(products) {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; 
  if (products.length === 0) {
    productList.innerHTML = '<p class="no-products-message">No products found.</p>';
  } else {
  products.forEach(product => {
    productList.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <div class="rating">
        <p>₹${product.price}</p>
        <p>${product.rating.rate} ⭐</p>
        </div>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}
}

function addToCart(productId) {
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      const existingProduct = cart.find(item => item.id === product.id);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      renderCart();
      updateCartCount();
    });
}


function renderCart() {
  const cartContainer = document.getElementById('cart');
  const totalPriceElement = document.getElementById('total-price');
  const placeOrderBtn = document.querySelector('.cart-summary button');
  cartContainer.innerHTML = ''; 
  let totalPrice = 0;

  if (cart.length === 0) {  
    cartContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    placeOrderBtn.disabled = true;  
  } else {
    
    cart.forEach(item => {
      totalPrice += item.price * item.quantity; 
      cartContainer.innerHTML += `
        <div class="cart-item"> 
           <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
              <h3>${item.title}</h3>
              <p>₹${item.price}</p>
            </div>
            <div class="quantity">
              <button onclick="updateQuantity(${item.id}, 'decrease')">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, 'increase')">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>  
      `;
    });
    placeOrderBtn.disabled = false; 
  }
  
  totalPriceElement.innerText = totalPrice.toFixed(2);
}



function updateQuantity(productId, action) {
  cart = cart.map(item => {
    if (item.id === productId) {
      if (action === 'increase') {
        item.quantity += 1;
      } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
      }
    }
    return item;
  });
  renderCart(); 
  updateCartCount(); 
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart(); 
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((count, item) => count + item.quantity, 0);
  cartCount.innerText = totalItems;
}


function placeOrder() {
  if (cart.length === 0) {
    alert('Your cart is empty!'); 
    return;
  }
  alert('Order placed successfully!'); 
  cart = []; 
  renderCart(); 
  updateCartCount(); 
}

function toggleCart() {
  const cartSection = document.getElementById('cart-section');
  cartSection.classList.toggle('cart-hidden');
  cartSection.classList.toggle('cart-visible');
}

// Search functionality
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredProducts = allProducts.filter(product => 
    product.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts); 
});



document.addEventListener('DOMContentLoaded', () => {
  displaySkeletonLoaders(30);
  fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
          const productList = document.getElementById('product-list');
          productList.innerHTML = '';
          displayProducts(data);    
      })
      .catch(error => {
          console.error('Error fetching products:', error);
     
      });
});


function displaySkeletonLoaders(numberOfLoaders) {
const productList = document.getElementById('product-list');
let loadersHtml = ''; 

for (let i = 0; i < numberOfLoaders; i++) {
  loadersHtml += `
    <div class="skeleton-product">
        <div style="height: 200px;"></div> 
        <h3></h3>  
        <div class="rating">
          <p></p>
          <p></p>
        </div>
        <button></button> 
    </div> 
  `;
}
productList.innerHTML = loadersHtml;
}