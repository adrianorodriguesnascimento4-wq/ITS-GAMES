
const PRODUCTS = [
  { id: "ff-100", name: "100 Diamantes Free Fire", price: 3.00, cat: "freefire", icon: "💎" },
  { id: "ff-310", name: "310 Diamantes Free Fire", price: 11.49, cat: "freefire", icon: "💎" },
  { id: "ff-520", name: "520 Diamantes Free Fire", price: 17.49, cat: "freefire", icon: "💎" },
  { id: "rbx-40", name: "40 Robux", price: 2.49, cat: "roblox", icon: "🟩" },
  { id: "rbx-80", name: "80 Robux", price: 4.00, cat: "roblox", icon: "🟩" },
  { id: "rbx-400", name: "400 Robux", price: 14.49, cat: "roblox", icon: "🟩" }
];

let cart = JSON.parse(localStorage.getItem("its_cart") || "[]");

const brl = n =>
  Number(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function render(list = PRODUCTS) {
  products.innerHTML = list.map(p => `
    <article class="card">
      <div class="pic">${p.icon}</div>
      <h3>${p.name}</h3>
      <div class="price">${brl(p.price)}</div>
      <button class="add" onclick="add('${p.id}')">
        Adicionar ao carrinho
      </button>
    </article>
  `).join("");
}

function add(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const item = cart.find(x => x.id === id);

  if (item) {
    item.q++;
  } else {
    cart.push({ ...p, q: 1 });
  }

  save();
  openCart();
}

function save() {
  localStorage.setItem("its_cart", JSON.stringify(cart));

  cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.q, 0
  );

  renderCart();
}

function renderCart() {
  cart.innerHTML = cart.length
    ? cart.map(item => `
        <div class="cartItem">
          <div>
            <b>${item.name}</b><br>
            <span>${brl(item.price)} × ${item.q}</span>
          </div>
          <div class="qty">
            <button onclick="change('${item.id}', -1)">−</button>
            <button onclick="change('${item.id}', 1)">+</button>
          </div>
        </div>
      `).join("")
    : '<p style="color:#8090a5">Seu carrinho está vazio.</p>';

  total.textContent = brl(
    cart.reduce((sum, item) => sum + item.price * item.q, 0)
  );
}

function change(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;

  item.q += delta;

  if (item.q <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  save();
}

function openCart() {
  overlay.style.display = "block";
  renderCart();
}

function closeCart(event) {
  if (!event || event.target === overlay) {
    overlay.style.display = "none";
  }
}

function filter(cat) {
  render(PRODUCTS.filter(p => p.cat === cat));
}

function doSearch() {
  const query = search.value.trim().toLowerCase();

  render(
    PRODUCTS.filter(p => p.name.toLowerCase().includes(query))
  );
}

search.addEventListener("keydown", event => {
  if (event.key === "Enter") doSearch();
});

async function checkout() {
  if (!cart.length) {
    alert("Adicione algum produto ao carrinho.");
    return;
  }

  const items = cart.map(item => ({
    id: item.id,
    quantity: item.q
  }));

  try {
    const response = await fetch(
      "https://its-games-backend.vercel.app/api/create-pix",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ items })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro retornado pelo servidor:", data);

      const details = data.details;
      const message =
        (details && (details.message || details.error)) ||
        data.error ||
        "Não foi possível criar o Pix.";

      throw new Error(message);
    }

    const pixCode =
      data.pix_copia_e_cola ||
      data.qr_code ||
      "";

    if (pixCode || data.qr_code_base64) {
      showPix(data);
      return;
    }

    if (data.checkout_url) {
      location.href = data.checkout_url;
      return;
    }

    console.error("Resposta inesperada do servidor:", data);

    throw new Error(
      "O servidor respondeu, mas não retornou o código Pix."
    );
  } catch (error) {
    console.error("Falha no checkout:", error);

    alert(
      "Não foi possível gerar o Pix.\n\nMotivo: " +
      error.message
    );
  }
}

function showPix(data) {
  const box = document.createElement("div");
  box.className = "pixModal";

  const card = document.createElement("div");
  card.className = "pixCard";

  const close = document.createElement("button");
  close.className = "close";
  close.textContent = "✕";
  close.onclick = () => box.remove();

  const heading = document.createElement("h2");
  heading.textContent = "Pagamento Pix";

  card.append(close, heading);

  if (data.qr_code_base64) {
    const image = document.createElement("img");
    image.alt = "QR Code Pix";
    image.src = data.qr_code_base64.startsWith("data:")
      ? data.qr_code_base64
      : "data:image/png;base64," + data.qr_code_base64;

    card.appendChild(image);
  }

  const label = document.createElement("p");
  label.textContent = "Pix Copia e Cola";

  const textarea = document.createElement("textarea");
  textarea.readOnly = true;
  textarea.value = data.pix_copia_e_cola || data.qr_code || "";

  const copy = document.createElement("button");
  copy.className = "pay";
  copy.textContent = "Copiar código Pix";

  copy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(textarea.value);
      copy.textContent = "Copiado!";
    } catch {
      textarea.focus();
      textarea.select();
      alert("Selecione e copie o código Pix manualmente.");
    }
  };

  card.append(label, textarea, copy);
  box.appendChild(card);
  document.body.appendChild(box);
}

render();
save();
