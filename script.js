const PRODUCTS=[
{id:"ff-1000",name:"1.000 Diamantes Free Fire",price:24.90,cat:"freefire",icon:"💎"},
{id:"rbx-1700",name:"1.700 Robux",price:54.90,cat:"roblox",icon:"🟩"},
{id:"gp-50",name:"Gift Card Google Play R$50",price:49.90,cat:"gift",icon:"🎁"},
{id:"fone-rgb",name:"Fone Gamer RGB",price:129.90,cat:"hardware",icon:"🎧"},
{id:"mouse-gamer",name:"Mouse Gamer",price:79.90,cat:"hardware",icon:"🖱️"},
{id:"teclado",name:"Teclado Gamer",price:119.90,cat:"hardware",icon:"⌨️"}
];
let cart=JSON.parse(localStorage.getItem("its_cart")||"[]");
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
function render(list=PRODUCTS){products.innerHTML=list.map(p=>`<article class="card"><div class="pic">${p.icon}</div><h3>${p.name}</h3><div class="price">${brl(p.price)}</div><button class="add" onclick="add('${p.id}')">Adicionar ao carrinho</button></article>`).join("")}
function add(id){let p=PRODUCTS.find(x=>x.id===id),i=cart.find(x=>x.id===id);i?i.q++:cart.push({...p,q:1});save();openCart()}
function save(){localStorage.setItem("its_cart",JSON.stringify(cart));cartCount.textContent=cart.reduce((a,x)=>a+x.q,0);renderCart()}
function renderCart(){cart.innerHTML=cart.length?cart.map(x=>`<div class="cartItem"><div><b>${x.name}</b><br><span>${brl(x.price)} × ${x.q}</span></div><div class="qty"><button onclick="change('${x.id}',-1)">−</button> <button onclick="change('${x.id}',1)">+</button></div></div>`).join(""):`<p style="color:#8090a5">Seu carrinho está vazio.</p>`;total.textContent=brl(cart.reduce((a,x)=>a+x.price*x.q,0))}
function change(id,d){let x=cart.find(x=>x.id===id);if(!x)return;x.q+=d;if(x.q<=0)cart=cart.filter(x=>x.id!==id);save()}
function openCart(){overlay.style.display="block";renderCart()}
function closeCart(e){if(!e||e.target===overlay)overlay.style.display="none"}
function filter(cat){render(PRODUCTS.filter(p=>p.cat===cat))}
function doSearch(){let q=search.value.toLowerCase();render(PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)))}
search.addEventListener("keydown",e=>{if(e.key==="Enter")doSearch()})
async function checkout(){
 if(!cart.length)return alert("Adicione algum produto ao carrinho.");
 const items=cart.map(x=>({id:x.id,name:x.name,quantity:x.q,unit_price:x.price}));
 try{
   const r=await fetch("/api/create-pix",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items})});
   const data=await r.json();
   if(!r.ok)throw new Error(data.error||"Não foi possível criar o pagamento.");
   if(data.qr_code||data.pix_copia_e_cola){showPix(data);return}
   if(data.checkout_url){location.href=data.checkout_url;return}
   throw new Error("Resposta de pagamento sem QR Code ou checkout.");
 }catch(e){alert("Pix ainda não configurado no servidor. Configure as credenciais da conta PicPay responsável pela loja.")}
}
function showPix(data){
 const box=document.createElement("div");box.className="pixModal";
 box.innerHTML=`<div class="pixCard"><button class="close" onclick="this.parentElement.parentElement.remove()">✕</button><h2>Pagamento Pix</h2>${data.qr_code?`<img src="${data.qr_code}" alt="QR Code Pix">`:""}<p>Pix Copia e Cola</p><textarea readonly>${data.pix_copia_e_cola||""}</textarea><button class="pay" onclick="navigator.clipboard.writeText(this.previousElementSibling.value);this.textContent='Copiado!'">Copiar código Pix</button></div>`;
 document.body.appendChild(box)
}
render();save();
