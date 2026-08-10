const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.getElementById('dots');
let current = 0;
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Slide ${i+1}`);
  dot.onclick = () => showSlide(i);
  dotsWrap.appendChild(dot);
});
const dots = [...document.querySelectorAll('.dot')];

function showSlide(index){
  current = (index + slides.length) % slides.length;
  slides.forEach((s,i)=>s.classList.toggle('active', i===current));
  dots.forEach((d,i)=>d.classList.toggle('active', i===current));
}
document.getElementById('nextBtn').onclick=()=>showSlide(current+1);
document.getElementById('prevBtn').onclick=()=>showSlide(current-1);
setInterval(()=>showSlide(current+1),5000);

const searchOverlay=document.getElementById('searchOverlay');
const searchInput=document.getElementById('searchInput');
const searchResults=document.getElementById('searchResults');
document.getElementById('searchBtn').onclick=()=>{searchOverlay.classList.add('open');searchInput.focus();};
document.getElementById('closeSearch').onclick=()=>searchOverlay.classList.remove('open');
searchOverlay.addEventListener('click',e=>{if(e.target===searchOverlay)searchOverlay.classList.remove('open');});

const products=[...document.querySelectorAll('.product-card')];
function renderSearch(){
  const q=searchInput.value.toLowerCase().trim();
  searchResults.innerHTML='';
  products.filter(p=>p.dataset.name.toLowerCase().includes(q)).forEach(p=>{
    const div=document.createElement('div');
    div.className='result';
    div.innerHTML=`<span>${p.dataset.name}</span><small>Rp${Number(p.dataset.price).toLocaleString('id-ID')}</small>`;
    div.onclick=()=>{searchOverlay.classList.remove('open');document.getElementById('menu').scrollIntoView();};
    searchResults.appendChild(div);
  });
}
searchInput.addEventListener('input',renderSearch);

let cart=[];
const cartPanel=document.getElementById('cartPanel'), backdrop=document.getElementById('backdrop');
function openCart(){cartPanel.classList.add('open');backdrop.classList.add('open');}
function closeCart(){cartPanel.classList.remove('open');backdrop.classList.remove('open');}
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
backdrop.onclick=closeCart;

document.querySelectorAll('.add-cart').forEach(btn=>{
  btn.onclick=()=>{
    const card=btn.closest('.product-card');
    const existing=cart.find(x=>x.name===card.dataset.name);
    if(existing) existing.qty++;
    else cart.push({name:card.dataset.name,price:+card.dataset.price,qty:1});
    updateCart(); openCart();
  };
});
function updateCart(){
  const count=cart.reduce((sum,x)=>sum+x.qty,0);
  document.getElementById('cartCount').textContent=count;
  const items=document.getElementById('cartItems');
  if(!cart.length){items.innerHTML='<p class="empty" data-i18n="emptyCart">Keranjang masih kosong.</p>';}
  else items.innerHTML=cart.map((x,i)=>`
    <div class="cart-row"><span>${x.name}<br><small>${x.qty} × Rp${x.price.toLocaleString('id-ID')}</small></span>
    <strong>Rp${(x.qty*x.price).toLocaleString('id-ID')}</strong>
    <button onclick="removeItem(${i})">×</button></div>`).join('');
  const total=cart.reduce((sum,x)=>sum+x.price*x.qty,0);
  document.getElementById('cartTotal').textContent='Rp'+total.toLocaleString('id-ID');
  const msg=cart.length ? 'Hallo, kak aku mau pesan ' + cart.map(x=>`${x.name} ${x.qty}`).join(', ') + ' ya kak.' : 'Hallo, kak aku mau pesan dubai chewy cookie nya 5 ya kak.';
  document.getElementById('checkoutBtn').href='https://wa.me/6282282208520?text='+encodeURIComponent(msg);
}
function removeItem(i){cart.splice(i,1);updateCart();}

const translations={
  id:{navHome:'Home',navMenu:'Menu',navStory:'Our Story',navContact:'Contact',eyebrow:'THE DUBAI CHOCOLATE EXPERIENCE',heroTitle:'Chewy, rich,<br><em>unforgettable.</em>',heroText:'Gigitan lembut dengan cokelat premium dan sentuhan Dubai yang bikin susah berhenti.',shopNow:'Shop Cookies',discover:'Discover our story →',reviewText:'dari pecinta cookie',ourMenu:'OUR MENU',menuTitle:'Pick your<br><em>favorite bite.</em>',menuText:'Dibuat fresh dengan tekstur chewy, bagian tengah lumer, dan rasa cokelat yang bold.',addCart:'+ Add to cart',storyTitle:'A little luxury<br><em>in every bite.</em>',storyText:'Terinspirasi dari tren cokelat Dubai, kami memadukan cookie chewy dengan pistachio cream, cokelat premium, dan crunchy kataifi. Hasilnya? Mewah, creamy, dan tetap fun.',tryNow:'Try the collection →',footerText:'Little cookies. Big chocolate energy.',searchLabel:'SEARCH',cartTitle:'Your Cart',emptyCart:'Keranjang masih kosong.',checkout:'Pesan via WhatsApp'},
  en:{navHome:'Home',navMenu:'Menu',navStory:'Our Story',navContact:'Contact',eyebrow:'THE DUBAI CHOCOLATE EXPERIENCE',heroTitle:'Chewy, rich,<br><em>unforgettable.</em>',heroText:'Soft-baked bites with premium chocolate and a Dubai-inspired twist you won’t forget.',shopNow:'Shop Cookies',discover:'Discover our story →',reviewText:'from cookie lovers',ourMenu:'OUR MENU',menuTitle:'Pick your<br><em>favorite bite.</em>',menuText:'Freshly made with a chewy texture, molten center, and bold chocolate flavor.',addCart:'+ Add to cart',storyTitle:'A little luxury<br><em>in every bite.</em>',storyText:'Inspired by Dubai chocolate, we blend chewy cookies with pistachio cream, premium chocolate, and crunchy kataifi. The result? Luxurious, creamy, and fun.',tryNow:'Try the collection →',footerText:'Little cookies. Big chocolate energy.',searchLabel:'SEARCH',cartTitle:'Your Cart',emptyCart:'Your cart is empty.',checkout:'Order via WhatsApp'}
};
function setLang(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.innerHTML=translations[lang][key];});
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  searchInput.placeholder=searchInput.dataset['placeholder'+(lang==='id'?'Id':'En')];
}
document.querySelectorAll('.lang-btn').forEach(btn=>btn.onclick=()=>setLang(btn.dataset.lang));
setLang('id');

document.getElementById('menuBtn').onclick=()=>{
  const nav=document.querySelector('.nav');
  nav.style.display=nav.style.display==='flex'?'none':'flex';
  nav.style.position='absolute';nav.style.top='78px';nav.style.left='0';nav.style.right='0';
  nav.style.padding='20px';nav.style.background='var(--cream)';nav.style.flexDirection='column';
};
