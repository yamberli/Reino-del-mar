// ==========================================================================
// Registro del Service Worker para soporte PWA Offline
// ==========================================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registrado con éxito en el alcance:', registration.scope);
      })
      .catch((error) => {
        console.error('Fallo al registrar el Service Worker:', error);
      });
  });
}

// ==========================================================================
// Datos Estáticos (Mapeados del mockData original de React Native)
// ==========================================================================
const products = [
  {
    id: '1',
    name: 'Salmón Fresco (Filete)',
    category: 'Fresco',
    price: '$18.00 / kg',
    description: 'Delicioso filete de salmón fresco, ideal para a la plancha o al horno.',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Camarones Jumbo',
    category: 'Congelado',
    price: '$22.50 / kg',
    description: 'Camarones pelados y desvenados, listos para cocinar.',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Ceviche Mixto Peruano',
    category: 'Preparados',
    price: '$12.00 / porción',
    description: 'Ceviche fresco del día con pesca variada y mariscos, toque de rocoto y limón.',
    image: 'https://images.unsplash.com/photo-1535316067757-96a9dccbc4cc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Pulpo Pre-cocido',
    category: 'Congelado',
    price: '$25.00 / kg',
    description: 'Pulpo tierno listo para preparar a la gallega o a la parrilla.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    name: 'Jugo Vitamínico Naranja-Zanahoria',
    category: 'Jugos',
    price: '$4.50 / botella',
    description: 'Refrescante y nutritivo para acompañar tu comida.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    name: 'Atún Rojo (Lomo)',
    category: 'Fresco',
    price: '$28.00 / kg',
    description: 'Lomo de atún rojo de alta calidad, perfecto para sushi o sellado.',
    image: 'https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=800&q=80',
  }
];

const promotions = [
  {
    id: '1',
    title: 'Combo Parrillero',
    description: 'Lleva 2kg de Camarones y 1kg de Pulpo con 15% de descuento.',
  },
  {
    id: '2',
    title: 'Viernes de Ceviche',
    description: 'En la compra de 2 ceviches mixtos, llévate 2 jugos vitamínicos gratis.',
  }
];

// ==========================================================================
// Control de Navegación SPA
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  const screens = document.querySelectorAll('.screen');
  const navItems = document.querySelectorAll('.nav-item');
  const quickLinks = document.querySelectorAll('.link-card[data-goto]');
  const toast = document.getElementById('app-toast');

  // Función para mostrar pantalla
  function showScreen(screenId) {
    // Ocultar todas las pantallas y quitar clase activa de navegación
    screens.forEach(s => s.classList.remove('active'));
    navItems.forEach(item => item.classList.remove('active'));

    // Mostrar la pantalla correspondiente
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    // Activar los botones de navegación correspondientes (móvil y escritorio)
    navItems.forEach(item => {
      if (item.getAttribute('data-screen') === screenId) {
        item.classList.add('active');
      }
    });

    // Desplazarse al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Event Listeners para navegación estándar
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const screenId = item.getAttribute('data-screen');
      showScreen(screenId);
    });
  });

  // Event Listeners para accesos rápidos (Home Quick Links)
  quickLinks.forEach(link => {
    link.addEventListener('click', () => {
      const screenId = link.getAttribute('data-goto');
      showScreen(screenId);
    });
  });

  // ==========================================================================
  // Renderizado y Filtrado de Catálogo
  // ==========================================================================
  const productsList = document.getElementById('products-list');
  const filterPills = document.querySelectorAll('#category-filters .filter-pill');

  function renderProducts(category = 'Todos') {
    productsList.innerHTML = '';
    
    const filtered = category === 'Todos' 
      ? products 
      : products.filter(p => p.category === category);

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-img-wrapper">
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
        </div>
        <div class="product-body">
          <div class="product-header-row">
            <h3 class="product-name">${p.name}</h3>
            <span class="product-price">${p.price}</span>
          </div>
          <span class="product-category">${p.category}</span>
          <p class="product-desc">${p.description}</p>
          <button class="btn-primary btn-add-cart" data-name="${p.name}">Agregar</button>
        </div>
      `;
      productsList.appendChild(card);
    });

    // Agregar eventos a los nuevos botones
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.target.getAttribute('data-name');
        showToast(`¡${name} agregado al carrito!`);
      });
    });
  }

  // Inicializar Catálogo
  renderProducts();

  // Filtrado al hacer click en las pestañas de categorías
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const category = pill.getAttribute('data-category');
      renderProducts(category);
    });
  });

  // ==========================================================================
  // Renderizado de Ofertas Especiales (Promociones)
  // ==========================================================================
  const promotionsList = document.getElementById('promotions-list');

  function renderPromotions() {
    promotionsList.innerHTML = '';
    promotions.forEach(promo => {
      const card = document.createElement('div');
      card.className = 'promo-card';
      card.innerHTML = `
        <div class="promo-header">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3>${promo.title}</h3>
        </div>
        <p class="promo-description">${promo.description}</p>
        <button class="btn-promo btn-apply-promo" data-title="${promo.title}">Aprovechar Oferta</button>
      `;
      promotionsList.appendChild(card);
    });

    // Eventos para botones de promociones
    document.querySelectorAll('.btn-apply-promo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const title = e.target.getAttribute('data-title');
        showToast(`¡Oferta "${title}" aplicada con éxito!`);
      });
    });
  }

  // Inicializar Promociones
  renderPromotions();

  // ==========================================================================
  // Formulario de Contacto
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const infoInput = document.getElementById('contact-info');
      const messageInput = document.getElementById('contact-message');

      // Animación en el botón de envío
      const submitBtn = document.getElementById('btn-submit-contact');
      submitBtn.innerText = 'Enviando...';
      submitBtn.disabled = true;

      // Simular retraso de red
      setTimeout(() => {
        showToast(`¡Gracias ${nameInput.value}! Mensaje enviado con éxito.`);
        contactForm.reset();
        submitBtn.innerText = 'Enviar Mensaje';
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  // ==========================================================================
  // Función Toast de Notificaciones
  // ==========================================================================
  let toastTimeout;
  function showToast(message) {
    clearTimeout(toastTimeout);
    toast.innerText = message;
    toast.classList.add('show');
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});
