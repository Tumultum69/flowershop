const headerHTML = `
<div class="container nav-container">
    <a href="index.html" class="logo">Floristé</a>
    <nav>
        <ul class="nav-menu">
            <li><a href="index.html">Главная</a></li>
            <li><a href="catalog.html">Каталог</a></li>
            <li><a href="cart.html">Корзина (<span id="cart-count">0</span>)</a></li>
            <li><a href="contacts.html">Контакты</a></li>
            <li><a href="profile.html">Профиль</a></li>
        </ul>
    </nav>
</div>`;
if(document.getElementById('header-placeholder')) document.getElementById('header-placeholder').innerHTML = headerHTML;

let products = JSON.parse(localStorage.getItem('flowers_db')) || [
    { id: 1, name: "Роза Нежность", price: 3500, category: "all", img: "https://unsplash.com" },
    { id: 2, name: "Композиция XL", price: 5200, category: "boxes", img: "https://unsplash.com" }
];
let cart = JSON.parse(localStorage.getItem('user_cart')) || [];
let userRole = localStorage.getItem('user_role') || 'guest';

function renderCatalog(filter = 'all') {
    const list = document.getElementById('catalog-list');
    if(!list) return;
    const filtered = (filter === 'all') ? products : products.filter(p => p.category === filter);
    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>${p.price} ₽</p>
            <button class="btn" onclick="addToCart(${p.id})">Купить</button>
            ${userRole === 'admin' ? `<button class="btn btn-del" onclick="deleteProduct(${p.id})">Удалить</button>` : ''}
        </div>
    `).join('');
}

function addToCart(id) {
    cart.push(products.find(p => p.id === id));
    localStorage.setItem('user_cart', JSON.stringify(cart));
    updateCartCount();
    alert("Добавлено в корзину!");
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    if(el) el.innerText = cart.length;
}

function renderCartPage() {
    const list = document.getElementById('cart-list');
    if(!list) return;
    let total = 0;
    list.innerHTML = cart.map((item, i) => {
        total += item.price;
        return `<div style="background:#fff; padding:15px; margin-bottom:10px; display:flex; justify-content:space-between; border-radius:10px;">
            <span>${item.name}</span> <b>${item.price} ₽</b>
            <button onclick="removeFromCart(${i})" style="color:red; border:none; background:none; cursor:pointer;">❌</button>
        </div>`;
    }).join('');
    document.getElementById('total-sum').innerText = total;
    document.getElementById('cart-total').style.display = cart.length ? 'block' : 'none';
}

function removeFromCart(i) {
    cart.splice(i, 1);
    localStorage.setItem('user_cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}

function login() {
    const email = document.getElementById('email').value;
    localStorage.setItem('user_role', email === 'admin@mail.ru' ? 'admin' : 'user');
    location.reload();
}

function logout() {
    localStorage.removeItem('user_role');
    location.reload();
}

function checkAuth() {
    const isAdmin = localStorage.getItem('user_role') === 'admin';
    if(document.getElementById('admin-ui')) {
        document.getElementById('auth-ui').style.display = isAdmin ? 'none' : 'block';
        document.getElementById('admin-ui').style.display = isAdmin ? 'block' : 'none';
    }
}

function addNewProduct() {
    const name = document.getElementById('new-name').value;
    const price = parseInt(document.getElementById('new-price').value);
    const category = document.getElementById('new-cat').value;
    if(name && price) {
        products.push({ id: Date.now(), name, price, category, img: "https://unsplash.com" });
        localStorage.setItem('flowers_db', JSON.stringify(products));
        alert("Товар добавлен!");
    }
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('flowers_db', JSON.stringify(products));
    renderCatalog();
}

updateCartCount();
