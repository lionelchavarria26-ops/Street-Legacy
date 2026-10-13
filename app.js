const products = [
  {id:"dragón", name:"Baggy Pants Dragón", price:99, category:"Pantalones", tag:"MÁS VENDIDO", art:"pants", sizes:["28","30","32"], colors:["Cenizo","Negro"]},
  {id:"phoenix", name:"Baggy Pants Phoenix", price:99, category:"Pantalones", tag:"STREETWEAR", art:"pants", sizes:["28","30","32"], colors:["Maíz","Negro"]},
  {id:"angel", name:"Baggy Pants Y2K Angel", price:99, category:"Pantalones", tag:"Y2K", art:"pants", sizes:["28","30","32"], colors:["Lavado","Negro"]},
  {id:"camuflaje", name:"Baggy Pant Camu", price:105, category:"Pantalones", tag:"NUEVO", art:"pants", sizes:["28","30","32"], colors:["Camu"]},
  {id:"eclipse", name:"Doble Zip Eclipse", price:105, category:"Hoodies", tag:"BOXy FIT", art:"zip", sizes:["S","M"], colors:["Negro"]},
  {id:"sinner", name:"Doble Zip Sinner", price:105, category:"Hoodies", tag:"STREETWEAR", art:"zip", sizes:["S","M"], colors:["Melange","Negro"]},
  {id:"doble-manga", name:"Doble Manga Boxy", price:55, category:"Polos", tag:"BÁSICO", art:"tee", sizes:["S","M","L"], colors:["Negro","Plomo oscuro","Marrón","Blanco"]},
  {id:"manga-larga", name:"Manga Larga Boxy", price:55, category:"Polos", tag:"BÁSICO", art:"tee", sizes:["M","L"], colors:["Negro","Blanco"]},
  {id:"attitude", name:"Zip Hoodie Attitude", price:99, category:"Hoodies", tag:"BORDADO", art:"zip", sizes:["M","L"], colors:["Azul noche","Hueso"]},
  {id:"savage", name:"Hoodie Savage + Spider", price:80, category:"Hoodies", tag:"STREETWEAR", art:"zip", sizes:["M","L"], colors:["Negro"]}
];
let cart = [];
let activeFilter = "Todos";
const money = n => "S/ " + n.toFixed(2);
const grid = document.getElementById("product-grid");

function renderProducts(){
  const visible = products.filter(p => activeFilter === "Todos" || p.category === activeFilter);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-art ${p.art}"><span class="product-tag">${p.tag}</span></div>
      <div class="product-info">
        <p class="product-name">${p.name}</p>
        <p class="product-price">${money(p.price)}</p>
        <div class="product-options">
          <select id="size-${p.id}" aria-label="Talla de ${p.name}">${p.sizes.map(s=>`<option value="${s}">Talla ${s}</option>`).join("")}</select>
          <select id="color-${p.id}" aria-label="Color de ${p.name}">${p.colors.map(c=>`<option value="${c}">${c}</option>`).join("")}</select>
        </div>
        <button class="add-button" data-add="${p.id}">AÑADIR AL CARRITO +</button>
      </div>
    </article>`).join("");
}
function renderCart(){
  document.getElementById("cart-count").textContent = cart.reduce((s,i)=>s+i.qty,0);
  const items = document.getElementById("cart-items");
  if(!cart.length){items.innerHTML='<p class="empty-cart">Tu carrito está vacío.</p>';}
  else {items.innerHTML=cart.map((i,index)=>`
    <div class="cart-item">
      <div><h3>${i.name}</h3><p>Talla ${i.size} · ${i.color}</p><strong>${money(i.price*i.qty)}</strong></div>
      <div><div class="qty-controls"><button data-dec="${index}" aria-label="Reducir cantidad">−</button><span>${i.qty}</span><button data-inc="${index}" aria-label="Aumentar cantidad">+</button></div><button class="remove-button" data-remove="${index}">Eliminar</button></div>
    </div>`).join("");}
  document.getElementById("cart-total").textContent = money(cart.reduce((s,i)=>s+i.price*i.qty,0));
}
grid.addEventListener("click",e=>{
  const id=e.target.dataset.add;if(!id)return;
  const p=products.find(x=>x.id===id);
  const size=document.getElementById("size-"+id).value;
  const color=document.getElementById("color-"+id).value;
  const existing=cart.find(i=>i.id===id&&i.size===size&&i.color===color);
  if(existing)existing.qty++;else cart.push({...p,size,color,qty:1});
  renderCart();
  document.body.classList.add("cart-open");
  document.getElementById("cart-drawer").setAttribute("aria-hidden","false");
});
document.getElementById("cart-items").addEventListener("click",e=>{
  const inc=e.target.dataset.inc,dec=e.target.dataset.dec,remove=e.target.dataset.remove;
  if(inc!==undefined)cart[inc].qty++;
  if(dec!==undefined){cart[dec].qty--;if(cart[dec].qty<=0)cart.splice(dec,1);}
  if(remove!==undefined)cart.splice(remove,1);
  renderCart();
});
document.querySelector(".filters").addEventListener("click",e=>{
  const f=e.target.dataset.filter;if(!f)return;
  activeFilter=f;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===e.target));renderProducts();
});
function closeCart(){document.body.classList.remove("cart-open");document.getElementById("cart-drawer").setAttribute("aria-hidden","true");}
document.getElementById("open-cart").addEventListener("click",()=>{document.body.classList.add("cart-open");document.getElementById("cart-drawer").setAttribute("aria-hidden","false");});
document.getElementById("close-cart").addEventListener("click",closeCart);
document.getElementById("drawer-backdrop").addEventListener("click",closeCart);
document.getElementById("checkout-button").addEventListener("click",()=>{
  if(!cart.length){alert("Añade al menos una prenda a tu carrito.");return;}
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const lines = cart.map(i=>`• ${i.name} | Talla ${i.size} | Color ${i.color} | Cantidad ${i.qty} | ${money(i.price*i.qty)}`);
  const message = `¡Hola, Street Legacy! Quiero realizar este pedido:\\n\\n${lines.join("\\n")}\\n\\nTotal de prendas: ${money(total)}\\n\\nMi nombre: \\nDistrito y dirección de entrega: \\nMétodo de pago: Yape o transferencia\\n\\n¿Me confirman disponibilidad y costo de envío?`;
  // Reemplaza el número de ejemplo con el número de WhatsApp de Street Legacy en formato internacional peruano, sin + ni espacios.
  const whatsappNumber = "51922818535";
  if(whatsappNumber.includes("TU_NUMERO")){
    closeCart();
    document.body.classList.add("modal-open");
    document.getElementById("checkout-title").textContent = "Conectar tu WhatsApp";
    document.querySelector(".checkout-modal > p:not(.eyebrow)").textContent = "El carrito ya prepara el pedido. Antes de usarlo, abre app.js y reemplaza 51TU_NUMERO por tu número real de WhatsApp con código de país 51, sin el signo + ni espacios. Luego este botón abrirá el chat con el pedido listo para enviar.";
    return;
  }
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,"_blank","noopener,noreferrer");
});
function closeModal(){document.body.classList.remove("modal-open");}
document.getElementById("close-checkout").addEventListener("click",closeModal);
document.getElementById("understood").addEventListener("click",closeModal);
document.getElementById("checkout-backdrop").addEventListener("click",e=>{if(e.target.id==="checkout-backdrop")closeModal();});
renderProducts();renderCart();