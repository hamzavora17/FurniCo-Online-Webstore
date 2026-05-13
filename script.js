console.log("FurniCo marketing website loaded");

// --- Page Loader Logic ---
setTimeout(() => {
  document.body.classList.add('loaded');
}, 1000);

// --- Dark Mode Logic ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle ? themeToggle.querySelector('i') : null;

// Check local storage
if (localStorage.getItem('furnicoTheme') === 'dark') {
  body.classList.add('dark-mode');
  if (icon) icon.classList.replace('fa-moon', 'fa-sun');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');

    // Update Icon
    if (icon) {
      if (isDark) {
        icon.classList.replace('fa-moon', 'fa-sun');
      } else {
        icon.classList.replace('fa-sun', 'fa-moon');
      }
    }

    // Save preference
    localStorage.setItem('furnicoTheme', isDark ? 'dark' : 'light');
  });
}

// --- Navbar Scroll Effect ---
const navbar = document.querySelector('.navbar');
if (navbar) {
  const navLogo = navbar.querySelector('.logo');
  if (navLogo) {
    navLogo.style.cursor = 'pointer';
    navLogo.removeAttribute('onclick');
    navLogo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 10) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Inject Mobile Menu Button dynamically
  const nav = navbar.querySelector('nav');
  if (nav) {
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation');

    // Insert before nav
    navbar.insertBefore(mobileMenuBtn, nav);

    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    });

    // Close menu when a link is clicked
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        mobileMenuBtn.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }
}

// --- Active Nav Link Logic ---
const navLinksList = document.querySelectorAll('.navbar nav a');
const currentPath = window.location.pathname.split('/').pop() || 'index.html';

navLinksList.forEach(link => {
  if (link.getAttribute('href') === currentPath) {
    link.classList.add('active');
  }
});

// --- Sale Banner Logic ---
const saleBanner = document.getElementById('saleBanner');
const closeBanner = document.getElementById('closeBanner');
const discountCode = document.getElementById('discountCode');

function showSalePopup() {
  if (saleBanner && !sessionStorage.getItem('salePopupShown')) {
    saleBanner.classList.add('show');
    sessionStorage.setItem('salePopupShown', 'true');
    startSaleTimer();
  }
}

if (saleBanner && closeBanner) {
  closeBanner.addEventListener('click', () => {
    saleBanner.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === saleBanner) {
      saleBanner.classList.remove('show');
    }
  });
}

function startSaleTimer() {
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!hoursEl || !minutesEl || !secondsEl) return;

  // Set deadline to 24 hours from now if not set (persists in localStorage)
  let deadline = parseInt(localStorage.getItem('saleDeadline'));
  if (isNaN(deadline)) {
    deadline = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('saleDeadline', deadline);
  }

  const updateTimer = () => {
    const now = new Date().getTime();
    const t = deadline - now;

    if (t >= 0) {
      hoursEl.innerHTML = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
      minutesEl.innerHTML = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      secondsEl.innerHTML = Math.floor((t % (1000 * 60)) / 1000).toString().padStart(2, '0');
    } else {
      document.getElementById('saleCountdown').innerHTML = "Offer Expired!";
    }
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

if (discountCode) {
  discountCode.addEventListener('click', () => {
    const codeText = discountCode.innerText;
    navigator.clipboard.writeText(codeText);

    // Visual feedback
    discountCode.innerText = "COPIED!";
    setTimeout(() => {
      discountCode.innerText = codeText;
    }, 2000);
  });
}

// --- Shopping Cart Logic ---

// Load cart from local storage or initialize empty
let cart = JSON.parse(localStorage.getItem('furnicoCart')) || [];

const cartBadgeElement = document.getElementById('cartCount');

function updateCartCount() {
  if (cartBadgeElement) {
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    cartBadgeElement.textContent = totalItems;
    cartBadgeElement.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger reflow to enable transition
  void toast.offsetWidth;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function showLoginPromptPopup() {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';

  const modal = document.createElement('div');
  modal.style.backgroundColor = 'var(--bg-white, #ffffff)';
  modal.style.padding = '40px 50px';
  modal.style.borderRadius = '16px';
  modal.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
  modal.style.textAlign = 'center';
  modal.style.transform = 'translateY(-20px) scale(0.95)';
  modal.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  modal.style.minWidth = '320px';

  const icon = document.createElement('div');
  icon.innerHTML = '<i class="fa-solid fa-lock"></i>';
  icon.style.fontSize = '50px';
  icon.style.color = 'var(--primary-color, #000)';
  icon.style.marginBottom = '20px';

  const text = document.createElement('h3');
  text.innerText = 'Login required to add items in the cart';
  text.style.margin = '0 0 15px 0';
  text.style.color = 'var(--text-main, #333)';
  text.style.fontSize = '1.25rem';

  const subText = document.createElement('p');
  subText.innerText = 'Please log in to continue.';
  subText.style.margin = '0 0 25px 0';
  subText.style.color = 'var(--text-muted, #666)';
  subText.style.fontSize = '1rem';

  const btnGroup = document.createElement('div');
  btnGroup.style.display = 'flex';
  btnGroup.style.gap = '15px';
  btnGroup.style.justifyContent = 'center';

  const loginBtn = document.createElement('button');
  loginBtn.innerText = 'Login';
  loginBtn.style.padding = '12px 25px';
  loginBtn.style.backgroundColor = 'var(--primary-color, #000)';
  loginBtn.style.color = '#fff';
  loginBtn.style.border = 'none';
  loginBtn.style.borderRadius = '8px';
  loginBtn.style.cursor = 'pointer';
  loginBtn.style.fontWeight = '600';
  loginBtn.style.transition = 'transform 0.2s';
  loginBtn.onmouseover = () => loginBtn.style.transform = 'translateY(-2px)';
  loginBtn.onmouseout = () => loginBtn.style.transform = 'none';
  loginBtn.onclick = () => {
    window.location.href = 'login.html';
  };

  const closeBtn = document.createElement('button');
  closeBtn.innerText = 'Cancel';
  closeBtn.style.padding = '12px 25px';
  closeBtn.style.backgroundColor = 'transparent';
  closeBtn.style.color = 'var(--text-main, #333)';
  closeBtn.style.border = '1px solid #ccc';
  closeBtn.style.borderRadius = '8px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.fontWeight = '600';
  closeBtn.style.transition = 'background-color 0.2s';
  closeBtn.onmouseover = () => closeBtn.style.backgroundColor = 'rgba(0,0,0,0.05)';
  closeBtn.onmouseout = () => closeBtn.style.backgroundColor = 'transparent';
  closeBtn.onclick = () => {
    overlay.style.opacity = '0';
    modal.style.transform = 'translateY(-20px) scale(0.95)';
    setTimeout(() => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 300);
  };

  btnGroup.appendChild(closeBtn);
  btnGroup.appendChild(loginBtn);

  modal.appendChild(icon);
  modal.appendChild(text);
  modal.appendChild(subText);
  modal.appendChild(btnGroup);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Trigger reflow
  void overlay.offsetWidth;
  overlay.style.opacity = '1';
  modal.style.transform = 'translateY(0) scale(1)';
}

function formatINR(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showAddToCartPopup(name, price, imageSrc) {
  // Find current item in cart to get quantity
  const cartData = JSON.parse(localStorage.getItem('furnicoCart')) || [];
  let currentItem = cartData.find(item => item.name === name);
  let currentQty = currentItem ? currentItem.quantity : 1;

  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';

  const modal = document.createElement('div');
  modal.style.backgroundColor = 'var(--bg-white, #ffffff)';
  modal.style.padding = '30px 40px';
  modal.style.borderRadius = '16px';
  modal.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
  modal.style.textAlign = 'center';
  modal.style.transform = 'translateY(-20px) scale(0.95)';
  modal.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  modal.style.minWidth = '320px';
  modal.style.maxWidth = '400px';

  const icon = document.createElement('div');
  icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
  icon.style.fontSize = '45px';
  icon.style.color = '#27ae60';
  icon.style.marginBottom = '15px';

  const title = document.createElement('h3');
  title.innerText = 'Added to Cart!';
  title.style.margin = '0 0 20px 0';
  title.style.color = 'var(--text-main, #333)';
  title.style.fontSize = '1.4rem';

  const productDetails = document.createElement('div');
  productDetails.style.display = 'flex';
  productDetails.style.alignItems = 'center';
  productDetails.style.gap = '15px';
  productDetails.style.padding = '15px';
  productDetails.style.backgroundColor = 'rgba(0,0,0,0.03)';
  productDetails.style.borderRadius = '12px';
  productDetails.style.marginBottom = '20px';
  productDetails.style.textAlign = 'left';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.width = '70px';
  img.style.height = '70px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '8px';

  const infoDiv = document.createElement('div');
  infoDiv.style.flex = '1';

  const pName = document.createElement('h4');
  pName.innerText = name;
  pName.style.margin = '0 0 5px 0';
  pName.style.fontSize = '1.05rem';
  pName.style.color = 'var(--text-main, #333)';

  const pPrice = document.createElement('p');
  pPrice.innerText = formatINR(price);
  pPrice.style.margin = '0';
  pPrice.style.color = 'var(--accent-color, #c0a080)';
  pPrice.style.fontWeight = '600';

  infoDiv.appendChild(pName);
  infoDiv.appendChild(pPrice);
  productDetails.appendChild(img);
  productDetails.appendChild(infoDiv);

  // Quantity adjuster
  const qtyWrapper = document.createElement('div');
  qtyWrapper.style.display = 'flex';
  qtyWrapper.style.alignItems = 'center';
  qtyWrapper.style.justifyContent = 'space-between';
  qtyWrapper.style.marginBottom = '25px';

  const qtyLabel = document.createElement('span');
  qtyLabel.innerText = 'Quantity:';
  qtyLabel.style.fontWeight = '500';

  const qtyControls = document.createElement('div');
  qtyControls.style.display = 'flex';
  qtyControls.style.alignItems = 'center';
  qtyControls.style.gap = '15px';
  qtyControls.style.backgroundColor = 'var(--bg-white, #fff)';
  qtyControls.style.border = '1px solid rgba(0,0,0,0.1)';
  qtyControls.style.padding = '5px 10px';
  qtyControls.style.borderRadius = '8px';

  const btnMinus = document.createElement('button');
  btnMinus.innerHTML = '<i class="fa-solid fa-minus"></i>';
  btnMinus.style.border = 'none';
  btnMinus.style.background = 'none';
  btnMinus.style.cursor = 'pointer';
  btnMinus.style.fontSize = '0.9rem';
  btnMinus.style.color = 'var(--text-muted, #666)';

  const qtyDisplay = document.createElement('span');
  qtyDisplay.innerText = currentQty;
  qtyDisplay.style.fontWeight = '600';
  qtyDisplay.style.minWidth = '20px';

  const btnPlus = document.createElement('button');
  btnPlus.innerHTML = '<i class="fa-solid fa-plus"></i>';
  btnPlus.style.border = 'none';
  btnPlus.style.background = 'none';
  btnPlus.style.cursor = 'pointer';
  btnPlus.style.fontSize = '0.9rem';
  btnPlus.style.color = 'var(--text-main, #333)';

  const updateCartItemQty = (newQty) => {
    if (newQty < 1) return;
    qtyDisplay.innerText = newQty;
    
    const itemIndex = cart.findIndex(i => i.name === name);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQty;
      localStorage.setItem('furnicoCart', JSON.stringify(cart));
      updateCartCount();
      if(typeof renderCart === 'function') renderCart();
    }
  };

  btnMinus.onclick = () => updateCartItemQty(parseInt(qtyDisplay.innerText) - 1);
  btnPlus.onclick = () => updateCartItemQty(parseInt(qtyDisplay.innerText) + 1);

  qtyControls.appendChild(btnMinus);
  qtyControls.appendChild(qtyDisplay);
  qtyControls.appendChild(btnPlus);
  
  qtyWrapper.appendChild(qtyLabel);
  qtyWrapper.appendChild(qtyControls);

  const actionGroup = document.createElement('div');
  actionGroup.style.display = 'flex';
  actionGroup.style.gap = '15px';

  const continueBtn = document.createElement('button');
  continueBtn.innerText = 'Continue Shopping';
  continueBtn.style.flex = '1';
  continueBtn.style.padding = '12px 10px';
  continueBtn.style.backgroundColor = 'transparent';
  continueBtn.style.color = 'var(--text-main, #333)';
  continueBtn.style.border = '1px solid #ccc';
  continueBtn.style.borderRadius = '8px';
  continueBtn.style.cursor = 'pointer';
  continueBtn.style.fontWeight = '600';
  continueBtn.style.fontSize = '0.95rem';
  continueBtn.style.transition = 'background-color 0.2s';
  continueBtn.onclick = () => {
    overlay.style.opacity = '0';
    modal.style.transform = 'translateY(-20px) scale(0.95)';
    setTimeout(() => {
      if (document.body.contains(overlay)) document.body.removeChild(overlay);
    }, 300);
  };

  const checkoutBtn = document.createElement('button');
  checkoutBtn.innerText = 'View Cart';
  checkoutBtn.style.flex = '1';
  checkoutBtn.style.padding = '12px 10px';
  checkoutBtn.style.backgroundColor = 'var(--primary-color, #000)';
  checkoutBtn.style.color = '#fff';
  checkoutBtn.style.border = 'none';
  checkoutBtn.style.borderRadius = '8px';
  checkoutBtn.style.cursor = 'pointer';
  checkoutBtn.style.fontWeight = '600';
  checkoutBtn.style.fontSize = '0.95rem';
  checkoutBtn.onclick = () => {
    window.location.href = 'checkout.html';
  };

  actionGroup.appendChild(continueBtn);
  actionGroup.appendChild(checkoutBtn);

  modal.appendChild(icon);
  modal.appendChild(title);
  modal.appendChild(productDetails);
  modal.appendChild(qtyWrapper);
  modal.appendChild(actionGroup);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  void overlay.offsetWidth;
  overlay.style.opacity = '1';
  modal.style.transform = 'translateY(0) scale(1)';
}

function addToCart(name, price, imageSrc) {
  const user = localStorage.getItem('furnico_user');
  if (!user) {
    showLoginPromptPopup();
    return;
  }

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, imageSrc: imageSrc, quantity: 1 });
  }

  localStorage.setItem('furnicoCart', JSON.stringify(cart));
  updateCartCount();
  showAddToCartPopup(name, price, imageSrc);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('furnicoCart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

function updateQuantity(index, change) {
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    localStorage.setItem('furnicoCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
  }
}

function renderCart() {
  const checkoutContainer = document.querySelector('.checkout-container');
  if (!checkoutContainer) return;

  const cartList = document.getElementById('cartItems');
  const subtotalDisplay = document.getElementById('summarySubtotal');
  const totalDisplay = document.getElementById('summaryTotal');
  const discountRow = document.getElementById('summaryDiscountRow');
  const discountDisplay = document.getElementById('summaryDiscount');

  if (cart.length === 0) {
    checkoutContainer.innerHTML = `
      <div class="cart-empty" style="grid-column: 1 / -1;">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <a href="index.html" class="btn">Start Shopping</a>
      </div>
    `;
    return;
  }

  if (cartList && subtotalDisplay && totalDisplay) {
    cartList.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p>${formatINR(item.price)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-subtotal">
          <strong>${formatINR(itemTotal)}</strong>
        </div>
        <div class="cart-item-remove">
          <button onclick="removeFromCart(${index})" aria-label="Remove item">&times;</button>
        </div>
      `;
      cartList.appendChild(cartItem);
    });

    const discountRate = parseFloat(localStorage.getItem('furnicoDiscountRate')) || 0;
    const discountAmount = subtotal * discountRate;
    const total = subtotal - discountAmount;

    subtotalDisplay.textContent = formatINR(subtotal);

    if (discountRow && discountDisplay) {
      discountRow.style.display = discountRate > 0 ? 'flex' : 'none';
      discountDisplay.textContent = '-' + formatINR(discountAmount);
    }

    totalDisplay.textContent = formatINR(total);
  }
}

// --- Checkout Page Logic ---
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Render cart only on the checkout page
  if (document.querySelector('.checkout-container')) {
    renderCart();
  }

  // Billing form toggle
  const sameAsShippingCheck = document.getElementById('sameAsShipping');
  const billingForm = document.getElementById('billingForm');

  if (sameAsShippingCheck && billingForm) {
    sameAsShippingCheck.addEventListener('change', () => {
      billingForm.classList.toggle('hidden', sameAsShippingCheck.checked);
    });
  }

  const orderSummary = document.getElementById('orderSummary');

  // --- Order Summary Logic (Thank You Page) ---
  if (orderSummary) {
    const lastOrder = JSON.parse(localStorage.getItem('furnicoLastOrder')) || [];
    if (lastOrder.length > 0) {
      let html = '<h3>Order Summary</h3><ul class="order-list">';
      let total = 0;
      lastOrder.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        html += `<li><span>${item.name} (x${item.quantity || 1})</span><span>${formatINR(itemTotal)}</span></li>`;
        total += itemTotal;
      });
      html += `</ul><div class="order-total"><strong>Total: ${formatINR(total)}</strong></div>`;
      orderSummary.innerHTML = html;
    }
  }

  // --- Coupon Logic ---
  const applyCouponBtn = document.getElementById('applyCoupon');
  const couponInput = document.getElementById('couponCode');
  const couponMessage = document.getElementById('couponMessage');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const code = couponInput.value.trim().toUpperCase();
      let rate = 0;

      if (code === 'WELCOME10' || code === 'WIN10') {
        rate = 0.10;
        couponMessage.textContent = "10% Discount Applied!";
        couponMessage.className = "success";
      } else if (code === 'FURNI20' || code === 'WIN20') {
        rate = 0.20;
        couponMessage.textContent = "20% Discount Applied!";
        couponMessage.className = "success";
      } else if (code === 'WIN5') {
        rate = 0.05;
        couponMessage.textContent = "5% Discount Applied!";
        couponMessage.className = "success";
      } else {
        rate = 0;
        couponMessage.textContent = "Invalid Coupon Code";
        couponMessage.className = "error";
      }

      localStorage.setItem('furnicoDiscountRate', rate);
      renderCart();
    });
  }

  // Use event delegation for buttons that might be added dynamically
  document.body.addEventListener('click', (event) => {
    // Place Order Button
    if (event.target.matches('.checkout-container .buy-btn')) {
      event.preventDefault();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Validation
      const shippingIds = ['fullName', 'email', 'address', 'city', 'zip'];
      let isValid = true;

      // Validate shipping fields
      for (const id of shippingIds) {
        const el = document.getElementById(id);
        if (el) {
          if (!el.value.trim()) {
            isValid = false;
            el.style.borderColor = "#e74c3c"; // Highlight error
          } else {
            el.style.borderColor = ""; // Reset to CSS default
          }
        }
      }

      // Validate billing fields if the form is visible
      const sameAsShipping = document.getElementById('sameAsShipping');
      if (sameAsShipping && !sameAsShipping.checked) {
        const billingIds = ['billingFullName', 'billingAddress', 'billingCity', 'billingZip'];
        for (const id of billingIds) {
          const el = document.getElementById(id);
          if (el) {
            if (!el.value.trim()) {
              isValid = false;
              el.style.borderColor = "#e74c3c";
            } else {
              el.style.borderColor = ""; // Reset to CSS default
            }
          }
        }
      }

      if (!isValid) {
        alert("Please fill in all required shipping and billing details.");
        return;
      }

      localStorage.setItem('furnicoLastOrder', JSON.stringify(cart));
      cart = [];
      localStorage.setItem('furnicoCart', JSON.stringify(cart));
      localStorage.removeItem('furnicoDiscountRate');
      updateCartCount();
      window.location.href = 'thank-you.html';
    }

    // Clear Cart Button
    if (event.target.matches('#clearCartBtn')) {
      if (cart.length > 0 && confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        localStorage.setItem('furnicoCart', JSON.stringify(cart));
        localStorage.removeItem('furnicoDiscountRate');
        updateCartCount();
        renderCart();
      } else {
        // This handles the buy button on other pages if it exists.
        if (event.target.matches('.buy-btn')) {
          // Potentially handle other "buy" buttons if necessary
        }
      }
    }
  });
});

// --- Contact Form Logic ---
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const originalFormContent = contactForm.innerHTML;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }

    setTimeout(() => {
      contactForm.innerHTML = `
        <div class="contact-success-message">
          <i class="fa-solid fa-circle-check"></i>
          <h3>Message Sent!</h3>
          <p>Thank you for reaching out. We'll get back to you shortly.</p>
          <button type="button" class="btn" id="resetContactForm" style="width: 100%; margin-top: 10px;">Send Another Message</button>
        </div>
      `;
      contactForm.classList.add('success');

      document.getElementById('resetContactForm').addEventListener('click', () => {
        contactForm.innerHTML = originalFormContent;
        contactForm.classList.remove('success');
      });
    }, 1500);
  });
}

// --- Newsletter Logic ---
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thanks for subscribing! You'll hear from us soon.");
    newsletterForm.reset();
  });
}

// --- Scroll Animation (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  // Target sections, cards, and features for animation
  const animatedElements = document.querySelectorAll('.section, .card, .product-card, .feature, .hero-content, .footer, .checkout-container, .about-grid');
  animatedElements.forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
  });
});

// --- Sale Popup Auto-Show Logic ---
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(showSalePopup, 2000);
});

// --- Notify Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const notifyModal = document.getElementById('notifyModal');
  const closeNotify = document.getElementById('closeNotifyModal');
  const notifyForm = document.getElementById('notifyForm');

  if (notifyModal && closeNotify) {
    closeNotify.addEventListener('click', () => {
      notifyModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
      if (e.target === notifyModal) {
        notifyModal.classList.remove('show');
      }
    });

    if (notifyForm) {
      notifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = notifyForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitted!';
        }

        alert("You will be notified via email soon!");

        // Use a timeout to close the modal, allowing the user to see the disabled button.
        // The button is reset for the next time the modal is opened.
        setTimeout(() => {
          notifyModal.classList.remove('show');
          notifyForm.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Notify Me';
          }
        }, 1500);
      });
    }
  }
});

// --- Filter Logic ---
const priceFilter = document.getElementById('priceFilter');
if (priceFilter) {
  priceFilter.addEventListener('change', () => {
    const range = priceFilter.value;
    const products = document.querySelectorAll('.product-card');

    products.forEach(card => {
      const priceElement = card.querySelector('strong');
      if (priceElement) {
        const priceText = priceElement.innerText;
        const price = parseInt(priceText.replace(/[^0-9]/g, ''));

        let show = false;
        if (range === 'all') show = true;
        else if (range === '0-16000' && price < 16000) show = true;
        else if (range === '16000-40000' && price >= 16000 && price <= 40000) show = true;
        else if (range === '40000-80000' && price >= 40000 && price <= 80000) show = true;
        else if (range === '80000+' && price > 80000) show = true;

        card.style.display = show ? 'block' : 'none';
      }
    });
  });
}

// --- FAQ Accordion Logic ---
const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(acc => {
  acc.addEventListener('click', () => {
    acc.classList.toggle('active');
    const panel = acc.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// --- AR Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const arModal = document.getElementById('arModal');
  const closeAr = document.getElementById('closeArModal');

  if (arModal && closeAr) {
    closeAr.addEventListener('click', () => {
      arModal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
      if (e.target === arModal) {
        arModal.classList.remove('show');
      }
    });
  }
});

// --- Custom Cursor Logic ---
const cursorDot = document.createElement('div');
cursorDot.classList.add('cursor-dot');
document.body.appendChild(cursorDot);

const cursorOutline = document.createElement('div');
cursorOutline.classList.add('cursor-outline');
document.body.appendChild(cursorOutline);

let cursorVisible = false;
let cursorX = 0;
let cursorY = 0;
let isCursorUpdating = false;

window.addEventListener('mousemove', (e) => {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (!cursorVisible) {
    cursorDot.style.opacity = 1;
    cursorOutline.style.opacity = 1;
    cursorVisible = true;
  }

  if (!isCursorUpdating) {
    isCursorUpdating = true;
    requestAnimationFrame(() => {
      // Instant follow for the dot
      cursorDot.style.left = `${cursorX}px`;
      cursorDot.style.top = `${cursorY}px`;

      // Smooth glide follow for the outline using Web Animations API
      cursorOutline.animate({
        left: `${cursorX}px`,
        top: `${cursorY}px`
      }, { duration: 400, fill: "forwards" });

      isCursorUpdating = false;
    });
  }
}, { passive: true });

// Event delegation for hover states on all interactive elements
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, input, select, textarea, .feature, .card, .resource-link, .footer-logo, .logo, .accordion-header, .dropbtn, #discountCode')) {
    cursorOutline.classList.add('cursor-hover');
    cursorDot.classList.add('cursor-hover');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.closest('a, button, input, select, textarea, .feature, .card, .resource-link, .footer-logo, .logo, .accordion-header, .dropbtn, #discountCode')) {
    cursorOutline.classList.remove('cursor-hover');
    cursorDot.classList.remove('cursor-hover');
  }
});

// --- Cursor Click Effect ---
window.addEventListener('mousedown', () => {
  cursorDot.classList.add('cursor-click');
  cursorOutline.classList.add('cursor-click');
});
window.addEventListener('mouseup', () => {
  cursorDot.classList.remove('cursor-click');
  cursorOutline.classList.remove('cursor-click');
});

// --- Auth Logic ---
document.addEventListener('DOMContentLoaded', () => {
  updateAuthNav();
});

function updateAuthNav() {
  const user = localStorage.getItem('furnico_user');
  const navs = document.querySelectorAll('header.navbar nav');

  navs.forEach(nav => {
    let authLink = nav.querySelector('.auth-link');

    if (!authLink) {
      authLink = document.createElement('a');
      authLink.className = 'auth-link';

      const checkoutLink = nav.querySelector('a[href="checkout.html"]');
      const themeToggleBtn = nav.querySelector('#themeToggle');

      if (checkoutLink) {
        nav.insertBefore(authLink, checkoutLink);
      } else if (themeToggleBtn) {
        nav.insertBefore(authLink, themeToggleBtn);
      } else {
        nav.appendChild(authLink);
      }
    }

    if (user) {
      // Logged in
      authLink.innerHTML = `<i class="fa-regular fa-user"></i> ${user} <span style="font-size: 0.8em; opacity: 0.7; margin-left: 4px;">(Logout)</span>`;
      authLink.href = '#';
      authLink.onclick = (e) => {
        e.preventDefault();
        localStorage.removeItem('furnico_user');
        cart = [];
        localStorage.setItem('furnicoCart', JSON.stringify(cart));
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
        updateAuthNav();

        // Show stylish logout popup
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '9999';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';

        const modal = document.createElement('div');
        modal.style.backgroundColor = 'var(--bg-white, #ffffff)';
        modal.style.padding = '40px 50px';
        modal.style.borderRadius = '16px';
        modal.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        modal.style.textAlign = 'center';
        modal.style.transform = 'translateY(-20px) scale(0.95)';
        modal.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        modal.style.minWidth = '280px';
        modal.style.minHeight = '200px';
        modal.style.display = 'flex';
        modal.style.flexDirection = 'column';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';

        // Loader elements
        const loaderContainer = document.createElement('div');
        loaderContainer.style.display = 'flex';
        loaderContainer.style.flexDirection = 'column';
        loaderContainer.style.alignItems = 'center';

        const spinner = document.createElement('div');
        spinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        spinner.style.fontSize = '40px';
        spinner.style.color = 'var(--primary-color, #000)';
        spinner.style.marginBottom = '15px';

        const loadingText = document.createElement('h3');
        loadingText.innerText = 'Logging out...';
        loadingText.style.margin = '0';
        loadingText.style.color = 'var(--text-muted, #666)';
        loadingText.style.fontSize = '1.2rem';

        loaderContainer.appendChild(spinner);
        loaderContainer.appendChild(loadingText);

        // Success elements
        const successContainer = document.createElement('div');
        successContainer.style.display = 'none';
        successContainer.style.flexDirection = 'column';
        successContainer.style.alignItems = 'center';

        const icon = document.createElement('div');
        icon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        icon.style.fontSize = '50px';
        icon.style.color = '#27ae60';
        icon.style.marginBottom = '20px';
        icon.style.opacity = '0';

        const text = document.createElement('h3');
        text.innerText = 'Successfully Logged Out';
        text.style.margin = '0 0 25px 0';
        text.style.color = 'var(--text-main, #333)';
        text.style.fontSize = '1.5rem';
        text.style.opacity = '0';

        const btn = document.createElement('button');
        btn.innerText = 'Continue';
        btn.style.padding = '12px 35px';
        btn.style.backgroundColor = 'var(--primary-color, #000)';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = '600';
        btn.style.fontSize = '1rem';
        btn.style.transition = 'background-color 0.3s, transform 0.2s';

        btn.onmouseover = () => btn.style.transform = 'translateY(-2px)';
        btn.onmouseout = () => btn.style.transform = 'none';

        btn.onclick = () => {
          overlay.style.opacity = '0';
          modal.style.transform = 'translateY(-20px) scale(0.95)';
          setTimeout(() => {
            if (document.body.contains(overlay)) {
              document.body.removeChild(overlay);
            }
          }, 300);
        };

        successContainer.appendChild(icon);
        successContainer.appendChild(text);
        successContainer.appendChild(btn);

        modal.appendChild(loaderContainer);
        modal.appendChild(successContainer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Trigger reflow
        void overlay.offsetWidth;
        overlay.style.opacity = '1';
        modal.style.transform = 'translateY(0) scale(1)';

        // Switch to success after 1 second
        setTimeout(() => {
          loaderContainer.style.display = 'none';
          successContainer.style.display = 'flex';

          icon.animate([
            { transform: 'scale(0) rotate(-45deg)', opacity: 0 },
            { transform: 'scale(1.2) rotate(10deg)', opacity: 1, offset: 0.7 },
            { transform: 'scale(1) rotate(0deg)', opacity: 1 }
          ], {
            duration: 600,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fill: 'forwards'
          });

          text.animate([
            { transform: 'translateY(20px)', opacity: 0 },
            { transform: 'translateY(-5px)', opacity: 1, offset: 0.7 },
            { transform: 'translateY(0)', opacity: 1 }
          ], {
            duration: 500,
            delay: 150,
            easing: 'ease-out',
            fill: 'forwards'
          });
        }, 1000);
      };
    } else {
      // Logged out
      authLink.innerHTML = `<i class="fa-regular fa-user"></i> Login`;
      authLink.href = 'login.html';
      authLink.onclick = null;
    }
  });
}
