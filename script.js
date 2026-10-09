
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

// Cria uma arte neon em SVG para cada pacote
function productArt(p) {
  const isFF = p.cat === "freefire";
  const amount = p.id === "ff-100" ? "100"
    : p.id === "ff-310" ? "310"
    : p.id === "ff-520" ? "520"
    : p.id === "rbx-40" ? "40"
    : p.id === "rbx-80" ? "80" : "400";

  const color = isFF ? "#00aaff" : "#39ff14";
  const title = isFF ? "DIAMANTES" : "ROBUX";
  const uid = p.id.replace(/[^a-z0-9]/gi, "");

  const art = isFF
    ? `<g>
        <path d="M45 54 L64 35 L106 35 L125 54 L85 108 Z"
          fill="url(#gem-${uid})" stroke="#b9f4ff" stroke-width="2"/>
        <path d="M45 54 L72 54 L64 35 M125 54 L98 54 L106 35
          M72 54 L85 108 L98 54 M72 54 L98 54"
          fill="none" stroke="#d8f8ff" stroke-width="1.5"/>
      </g>`
    : `<g transform="rotate(12 85 70)">
        <rect x="49" y="34" width="72" height="72" rx="9"
          fill="url(#gem-${uid})" stroke="#c3ffb2" stroke-width="2"/>
        <rect x="72" y="57" width="26" height="26" rx="2"
          fill="#07151a" stroke="#b2ff9d" stroke-width="2"/>
      </g>`;

  return `<svg viewBox="0 0 170 145"
    role="img" aria-label="${p.name}"
    xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg-${uid}">
        <stop offset="0" stop-color="${color}" stop-opacity=".30"/>
        <stop offset="1" stop-color="#06101e" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="gem-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffffff"/>
        <stop offset=".35" stop-color="${color}"/>
        <stop offset="1" stop-color="${isFF ? "#0646a8" : "#087b24"}"/>
      </linearGradient>
      <filter id="glow-${uid}">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
    </defs>
    <rect width="170" height="145" rx="12" fill="#071323"/>
    <rect width="170" height="145" rx="12" fill="url(#bg-${uid})"/>
    <ellipse cx="85" cy="105" rx="53" ry="12"
      fill="${color}" opacity=".6" filter="url(#glow-${uid})"/>
    <ellipse cx="85" cy="111" rx="43" ry="7"
      fill="none" stroke="${color}" stroke-width="2" opacity=".8"/>
    <g fill="${color}" opacity=".7">
      <circle cx="32" cy="42" r="2"/>
      <circle cx="138" cy="35" r="2.5"/>
      <circle cx="129" cy="85" r="2"/>
      <circle cx="44" cy="91" r="1.5"/>
    </g>
    ${art}
    <rect x="8" y="8" width="56" height="23" rx="6"
      fill="#071323" stroke="${color}"/>
    <text x="36" y="24" text-anchor="middle" fill="#fff"
      font-size="12" font-weight="bold">${amount}</text>
    <text x="85" y="133" text-anchor="middle" fill="${color}"
      font-size="9" font-weight="bold" letter-spacing="1">${title}</text>
  </svg>`;
}

function render(list = PRODUCTS) {
  products.innerHTML = list.map(p => `
    <article class="card">
      <div class="pic productArt">${productArt(p)}</div>
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

