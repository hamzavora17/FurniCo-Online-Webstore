console.log("FurniCo marketing website loaded");

// --- Page Loader Logic ---
setTimeout(() => {
  document.body.classList.add('loaded');
}, 100);

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

function addToCart(name, price, imageSrc) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, imageSrc: imageSrc, quantity: 1 });
  }
  
  localStorage.setItem('furnicoCart', JSON.stringify(cart));
  updateCartCount();
  showToast(name + " has been added to your cart!");
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
          <p>$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${index}, -1)" aria-label="Decrease quantity">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-item-subtotal">
          <strong>$${itemTotal.toFixed(2)}</strong>
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

    subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;
    
    if (discountRow && discountDisplay) {
      discountRow.style.display = discountRate > 0 ? 'flex' : 'none';
      discountDisplay.textContent = `-$${discountAmount.toFixed(2)}`;
    }

    totalDisplay.textContent = `$${total.toFixed(2)}`;
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
        html += `<li><span>${item.name} (x${item.quantity || 1})</span><span>$${itemTotal.toFixed(2)}</span></li>`;
        total += itemTotal;
      });
      html += `</ul><div class="order-total"><strong>Total: $${total.toFixed(2)}</strong></div>`;
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

// --- Newsletter Modal Logic ---
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('newsletterModal');
  const closeModal = modal ? modal.querySelector('.close-modal') : null;
  const modalForm = document.getElementById('modalNewsletterForm');

  if (modal && closeModal) {
    // Show modal after 5 seconds (using sessionStorage to show only once per session)
    if (!sessionStorage.getItem('newsletterShown')) {
      setTimeout(() => {
        modal.classList.add('show');
        sessionStorage.setItem('newsletterShown', 'true');
      }, 5000);
    } else {
      // If newsletter already shown, try showing sale popup after a short delay
      setTimeout(showSalePopup, 2000);
    }

    closeModal.addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(showSalePopup, 500);
    });

    // Close if clicking outside the modal content
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
        setTimeout(showSalePopup, 500);
      }
    });

    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Success! Use code WELCOME10 for 10% off.");
        modal.classList.remove('show');
        setTimeout(showSalePopup, 500);
      });
    }
  }
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
        else if (range === '0-200' && price < 200) show = true;
        else if (range === '200-500' && price >= 200 && price <= 500) show = true;
        else if (range === '500-1000' && price >= 500 && price <= 1000) show = true;
        else if (range === '1000+' && price > 1000) show = true;

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