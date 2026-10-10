// ============================================
// ITS GAMES — CHECKOUT MANUAL VIA PIX
// ============================================

// Insira a chave Pix da loja entre as aspas.
// ATENÇÃO: em um repositório público, esta chave
// ficará visível para qualquer pessoa.
const PIX_KEY = "8505e901-353c-42c1-baa2-a0b532f939b7";

const PRODUCTS = [
  { id: "ff-100", name: "100 Diamantes Free Fire", price: 3.00, cat: "freefire", icon: "💎" },
  { id: "ff-310", name: "310 Diamantes Free Fire", price: 11.49, cat: "freefire", icon: "💎" },
  { id: "ff-520", name: "520 Diamantes Free Fire", price: 17.49, cat: "freefire", icon: "💎" },
  { id: "rbx-40", name: "40 Robux", price: 2.49, cat: "roblox", icon: "🟩" },
  { id: "rbx-80", name: "80 Robux", price: 4.00, cat: "roblox", icon: "🟩" },
  { id: "rbx-400", name: "400 Robux", price: 14.49, cat: "roblox", icon: "🟩" }
];

// Carrinho começa vazio
let cartItems = [];

const brl = n =>
  Number(n).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

// Artes neon
function productArt(p) {
  const isFF = p.cat === "freefire";
  const amount = {
    "ff-100": "100",
    "ff-310": "310",
    "ff-520": "520",
    "rbx-40": "40",
    "rbx-80": "80",
    "rbx-400": "400"
  }[p.id];

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

  const item = cartItems.find(x => x.id === id);

  if (item) {
    item.q++;
  } else {
    cartItems.push({ ...p, q: 1 });
  }

  save();
  openCart();
}

function save() {
  cartCount.textContent = cartItems.reduce(
    (sum, item) => sum + item.q, 0
  );

  renderCart();
}

function renderCart() {
  if (cartItems.length) {
    cart.innerHTML = `
      <button class="clearCart" onclick="clearCart()">
        🧹 Esvaziar carrinho
      </button>
      ${cartItems.map(item => `
        <div class="cartItem">
          <div>
            <b>${item.name}</b><br>
            <span>${brl(item.price)} × ${item.q}</span><br>
            <strong>${brl(item.price * item.q)}</strong>
          </div>
          <div class="qty">
            <button aria-label="Diminuir quantidade"
              onclick="change('${item.id}', -1)">−</button>
            <button aria-label="Aumentar quantidade"
              onclick="change('${item.id}', 1)">+</button>
            <button class="removeItem"
              aria-label="Remover ${item.name}"
              onclick="removeItem('${item.id}')">🗑️</button>
          </div>
        </div>
      `).join("")}
    `;
  } else {
    cart.innerHTML =
      '<p style="color:#8090a5">Seu carrinho está vazio.</p>';
  }

  total.textContent = brl(
    cartItems.reduce((sum, item) => sum + item.price * item.q, 0)
  );
}

function change(id, delta) {
  const item = cartItems.find(x => x.id === id);
  if (!item) return;

  item.q += delta;

  if (item.q <= 0) {
    removeItem(id);
    return;
  }

  save();
}

function removeItem(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  save();
}

function clearCart() {
  if (!cartItems.length) return;
  cartItems = [];
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

// Copiar texto
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();

    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }

    field.remove();
    return ok;
  }
}

// Checkout manual
async function checkout() {
  if (!cartItems.length) {
    alert("Adicione algum produto ao carrinho.");
    return;
  }

  if (
    !PIX_KEY ||
    PIX_KEY === "INSIRA_SUA_CHAVE_PIX_AQUI"
  ) {
    alert("A chave Pix da loja ainda não foi configurada.");
    return;
  }

  const orderTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.q, 0
  );

  const orderText = cartItems.map(item =>
    `${item.name} × ${item.q} — ${brl(item.price * item.q)}`
  ).join("\n");

  const box = document.createElement("div");
  box.className = "pixModal";

  const card = document.createElement("div");
  card.className = "pixCard";

  const close = document.createElement("button");
  close.className = "close";
  close.textContent = "✕";
  close.onclick = () => box.remove();

  const heading = document.createElement("h2");
  heading.textContent = "Finalizar pedido";

  const details = document.createElement("pre");
  details.style.whiteSpace = "pre-wrap";
  details.textContent = orderText;

  const totalLine = document.createElement("h3");
  totalLine.textContent = `Total: ${brl(orderTotal)}`;

  const keyLabel = document.createElement("p");
  keyLabel.textContent = "Chave Pix da loja";

  const keyField = document.createElement("textarea");
  keyField.readOnly = true;
  keyField.value = PIX_KEY;
  keyField.style.width = "100%";
  keyField.style.boxSizing = "border-box";
  keyField.style.minHeight = "65px";

  const copyKey = document.createElement("button");
  copyKey.className = "pay";
  copyKey.textContent = "Copiar chave Pix";

  copyKey.onclick = async () => {
    const ok = await copyText(PIX_KEY);
    copyKey.textContent = ok
      ? "Chave copiada!"
      : "Selecione a chave para copiar";

    if (!ok) {
      keyField.focus();
      keyField.select();
    }
  };

  const instructions = document.createElement("p");
  instructions.textContent =
    `Faça o Pix de ${brl(orderTotal)} usando a chave acima. ` +
    "Informe esse valor ao pagar.";

  const warning = document.createElement("p");
  warning.textContent =
    "A loja precisa confirmar o recebimento diretamente no PicPay. " +
    "O comprovante sozinho não confirma o pagamento. " +
    "O produto só será liberado após a confirmação.";

  const copyOrder = document.createElement("button");
  copyOrder.className = "pay";
  copyOrder.textContent = "Copiar resumo do pedido";

  copyOrder.onclick = async () => {
    const summary =
      `ITS GAMES — PEDIDO\n\n${orderText}\n\n` +
      `TOTAL: ${brl(orderTotal)}\n` +
      "Aguardando confirmação do pagamento pela loja.";

    const ok = await copyText(summary);
    copyOrder.textContent = ok
      ? "Resumo copiado!"
      : "Não foi possível copiar";
  };

  card.append(
    close,
    heading,
    details,
    totalLine,
    keyLabel,
    keyField,
    copyKey,
    instructions,
    warning,
    copyOrder
  );

  box.appendChild(card);
  document.body.appendChild(box);
}

render();
save();
