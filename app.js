/* ============================================================
   Morda Café – app.js  v4.0
   Human-like AI · Smart Cart · Fake Order Flow · Swirl
   Powered by Maphake Automation
   ============================================================ */

// ── PAGE CURTAIN ──────────────────────────────────────────────
(function(){
  const c=document.getElementById('pageCurtain');
  if(!c)return;
  setTimeout(()=>c.classList.add('out'),60);
  document.addEventListener('click',e=>{
    const lnk=e.target.closest('[data-nav]');
    if(!lnk)return;
    const href=lnk.getAttribute('href');
    if(!href||href==='#'||href.startsWith('http')||href.startsWith('mailto')||href.startsWith('tel'))return;
    e.preventDefault();
    c.classList.remove('out');c.classList.add('in');
    setTimeout(()=>window.location.href=href,520);
  });
})();

// ── COFFEE SWIRL ──────────────────────────────────────────────
(function(){
  const canvas=document.getElementById('swirlCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,pts=[],t=0,raf;
  const COLS=[[194,138,69,.22],[107,63,42,.16],[247,233,210,.11],[43,11,8,.30],[194,138,69,.09],[232,211,176,.10],[150,90,50,.14]];
  function resize(){W=canvas.width=innerWidth;H=canvas.height=innerHeight;}
  function flow(x,y,t){return Math.sin(x*.0024+t*.33+Math.cos(y*.0019+t*.17))*Math.cos(y*.002-t*.21+Math.sin(x*.0028+t*.11))*Math.PI*2+Math.sin((x+y)*.0014+t*.14)*Math.PI;}
  function spawn(){const c=COLS[Math.floor(Math.random()*COLS.length)];const life=.3+Math.random()*.7;return{x:Math.random()*W,y:Math.random()*H,px:0,py:0,spd:.5+Math.random()*2,r:c[0],g:c[1],b:c[2],a:c[3],sz:.4+Math.random()*1.8,life,ml:life};}
  function init(){resize();ctx.fillStyle='#1F0404';ctx.fillRect(0,0,W,H);pts=[];for(let i=0;i<300;i++){const p=spawn();p.px=p.x;p.py=p.y;pts.push(p);}}
  function draw(){
    t+=.006;ctx.fillStyle='rgba(31,4,4,0.022)';ctx.fillRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];p.px=p.x;p.py=p.y;
      const a=flow(p.x,p.y,t);p.x+=Math.cos(a)*p.spd;p.y+=Math.sin(a)*p.spd;p.life-=.0013;
      if(p.x<-5||p.x>W+5||p.y<-5||p.y>H+5||p.life<=0){const n=spawn();n.px=n.x;n.py=n.y;pts[i]=n;continue;}
      ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);
      ctx.strokeStyle=`rgba(${p.r},${p.g},${p.b},${p.a*(p.life/p.ml)})`;ctx.lineWidth=p.sz;ctx.lineCap='round';ctx.stroke();
    }
    raf=requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{cancelAnimationFrame(raf);init();draw();});
  init();draw();
})();

// ── NAVBAR ────────────────────────────────────────────────────
(function(){
  const nb=document.getElementById('navbar');
  const tog=document.getElementById('navToggle');
  const lnks=document.getElementById('navLinks');
  if(!nb)return;
  window.addEventListener('scroll',()=>nb.classList.toggle('scrolled',scrollY>60));
  if(tog&&lnks){
    tog.addEventListener('click',()=>{lnks.classList.toggle('open');tog.classList.toggle('active');});
    lnks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{lnks.classList.remove('open');tog.classList.remove('active');}));
  }
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────
(function(){
  const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');});},{threshold:.06});
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el=>obs.observe(el));
})();

// ── MENU TABS ─────────────────────────────────────────────────
(function(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-'+btn.dataset.tab)?.classList.add('active');
    });
  });
})();

// ── GALLERY FILTER ────────────────────────────────────────────
(function(){
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat=btn.dataset.cat;
      document.querySelectorAll('.g-card').forEach(card=>{
        const show=cat==='all'||card.dataset.cat===cat;
        card.style.opacity='0';card.style.transform='scale(0.9)';
        setTimeout(()=>{card.style.display=show?'block':'none';if(show)requestAnimationFrame(()=>{card.style.opacity='1';card.style.transform='scale(1)';});},230);
      });
    });
  });
})();

// ── CART SYSTEM ───────────────────────────────────────────────
window.CART={
  items:[],
  add(name,price,desc){
    const ex=this.items.find(i=>i.name===name);
    if(ex){ex.qty++;}else{this.items.push({name,price:parseFloat(String(price).replace('R','')),desc:desc||'',qty:1});}
    this.update();this.bump();
  },
  remove(name){this.items=this.items.filter(i=>i.name!==name);this.update();},
  qty(name,delta){const i=this.items.find(x=>x.name===name);if(i){i.qty+=delta;if(i.qty<=0)this.remove(name);else this.update();}},
  total(){return this.items.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);},
  count(){return this.items.reduce((s,i)=>s+i.qty,0);},
  update(){
    const badge=document.getElementById('cartBadge');
    if(badge){const n=this.count();badge.textContent=n;badge.style.display=n>0?'flex':'none';}
    this.renderPanel();
  },
  bump(){const btn=document.getElementById('cartBtn');if(!btn)return;btn.classList.add('bump');setTimeout(()=>btn.classList.remove('bump'),400);},
  renderPanel(){
    const body=document.getElementById('cartBody');
    if(!body)return;
    if(this.items.length===0){
      body.innerHTML='<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p><small>Browse the menu and add your favourites</small></div>';
    }else{
      body.innerHTML=this.items.map(i=>`<div class="cart-row"><div class="cart-row-info"><strong>${i.name}</strong><span>R${i.price.toFixed(2)} each</span></div><div class="cart-row-ctrl"><button onclick="CART.qty('${i.name.replace(/'/g,"\\'")}', -1)">−</button><span>${i.qty}</span><button onclick="CART.qty('${i.name.replace(/'/g,"\\'")}', 1)">+</button></div><span class="cart-row-sub">R${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
    }
    const tot=document.getElementById('cartTotal');
    if(tot)tot.textContent='R'+this.total();
  },
  open(){document.getElementById('cartPanel')?.classList.add('open');document.getElementById('cartOverlay')?.classList.add('open');this.renderPanel();},
  close(){document.getElementById('cartPanel')?.classList.remove('open');document.getElementById('cartOverlay')?.classList.remove('open');}
};

// ── ORDER FLOW (fake but convincing) ──────────────────────────
(function(){
  document.getElementById('cartBtn')?.addEventListener('click',()=>CART.open());
  document.getElementById('cartClose')?.addEventListener('click',()=>CART.close());
  document.getElementById('cartOverlay')?.addEventListener('click',()=>CART.close());

  // Step 1: Cart → Order Modal
  document.getElementById('placeOrderBtn')?.addEventListener('click',()=>{
    if(CART.count()===0){alert('Please add items to your cart first!');return;}
    CART.close();
    const summary=document.getElementById('orderSummary');
    if(summary)summary.innerHTML=CART.items.map(i=>`<div class="order-item"><span>${i.qty}× ${i.name}</span><span>R${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
    document.getElementById('orderTotal').textContent='R'+CART.total();
    document.getElementById('orderModal')?.classList.add('open');
  });

  document.getElementById('modalClose')?.addEventListener('click',()=>document.getElementById('orderModal')?.classList.remove('open'));
  document.getElementById('orderModal')?.addEventListener('click',e=>{if(e.target===document.getElementById('orderModal'))document.getElementById('orderModal').classList.remove('open');});

  // Shared order confirm function
  function confirmOrder(method){
    document.getElementById('orderModal')?.classList.remove('open');
    const orderNum='MC'+Math.floor(10000+Math.random()*90000);
    const eta=method==='delivery'?'30–45 minutes':'10–15 minutes';
    const icon=method==='delivery'?'🛵':'🏃';
    const title=method==='delivery'?'Order Placed! On Its Way!':'Order Confirmed! Ready Soon!';
    const sub=method==='delivery'?'Your order is being prepared and will be on its way shortly.':'Your order is being prepared. We\'ll have it ready for you!';
    // Show processing screen
    const proc=document.getElementById('processingScreen');
    if(proc){
      proc.classList.add('open');
      proc.innerHTML=`<div class="proc-inner">
        <div class="proc-spinner"></div>
        <p>Processing your order...</p>
      </div>`;
      setTimeout(()=>{
        proc.innerHTML=`<div class="proc-inner success">
          <div class="proc-check">✓</div>
          <h2>${title}</h2>
          <div class="order-ref">Order #${orderNum}</div>
          <p>${sub}</p>
          <div class="eta-box"><span>${icon}</span><div><strong>Estimated Time</strong><span>${eta}</span></div></div>
          <div class="order-confirm-items">${CART.items.map(i=>`<div>${i.qty}× ${i.name}</div>`).join('')}</div>
          <div class="order-confirm-total">Total Charged: <strong>R${CART.total()}</strong></div>
          <p class="order-note">Need help? Call us on <a href="tel:+27115678901">+27 11 567 8901</a></p>
          <button class="btn btn-gold" style="margin-top:20px;width:100%" onclick="document.getElementById('processingScreen').classList.remove('open');CART.items=[];CART.update();">Done ✓</button>
        </div>`;
      },2200);
    }
  }

  document.getElementById('deliveryBtn')?.addEventListener('click',()=>confirmOrder('delivery'));
  document.getElementById('collectionBtn')?.addEventListener('click',()=>confirmOrder('collection'));
})();

// ══════════════════════════════════════════════════════════════
//  MORDA CAFÉ AI — Human-Like Conversation Engine v4.0
//  Rules: Natural · Short · No re-intro · Memory-aware
//  Powered by Maphake Automation
// ══════════════════════════════════════════════════════════════
(function(){
  const toggle=document.getElementById('chatToggle');
  const panel=document.getElementById('chatPanel');
  const closeBtn=document.getElementById('chatClose');
  const msgs=document.getElementById('chatMessages');
  const input=document.getElementById('chatInput');
  const sendBtn=document.getElementById('chatSend');
  if(!toggle||!panel)return;

  let open=false;
  let msgCount=0; // track conversation depth

  // ── PRICES (single source of truth) ─────────────────────────
  const P={
    'morda signature latte':'R48','classic cappuccino':'R42','americano':'R35',
    'flat white':'R44','caramel macchiato':'R55','iced coffee':'R45',
    'mocha bliss':'R58','cold brew':'R52','espresso shot':'R28','cortado':'R38',
    'oat milk latte':'R52','vanilla latte':'R50',
    'classic milk tea boba':'R55','taro boba':'R58','brown sugar boba latte':'R62',
    'matcha boba':'R60','strawberry boba':'R58','thai tea boba':'R55',
    'mango boba':'R57','honeydew boba':'R56','morda signature boba':'R65',
    'berry sunrise':'R62','tropical glow':'R60','green boost':'R58',
    'peanut butter power':'R65','strawberry cream':'R60','morda energy smoothie':'R68',
    'mango madness':'R62','pineapple bliss':'R58',
    'classic avo toast':'R78','smashed avo & egg toast':'R85','smashed avo and egg toast':'R85',
    'pb banana toast':'R55','feta & tomato toast':'R70','honey ricotta toast':'R68','salmon toast':'R95',
    'morda breakfast plate':'R95','breakfast croissant':'R82','french toast stack':'R88',
    'omelette deluxe':'R85','granola bowl':'R70','eggs benedict':'R92','pancake stack':'R80',
    'butter croissant':'R32','chocolate croissant':'R38','cinnamon roll':'R42',
    'blueberry muffin':'R35','almond danish':'R45','morda brownie':'R40','lemon drizzle cake':'R42',
    'chicken mayo toastie':'R72','caprese panini':'R75','beef bagel':'R90',
    'chicken wrap':'R88','café salad bowl':'R82','cafe salad bowl':'R82',
  };

  function getPrice(m){
    for(const[item,price]of Object.entries(P)){
      if(m.includes(item)||(item.split(' ').filter(w=>w.length>4).some(w=>m.includes(w))&&item.split(' ').filter(w=>w.length>4).length>0)){
        return{item,price};
      }
    }
    return null;
  }

  // ── CORE REPLY ENGINE ────────────────────────────────────────
  function reply(msg){
    const m=msg.toLowerCase().trim()
      .replace(/cofee|coffe|caffe/g,'coffee')
      .replace(/brekfast|brekfest/g,'breakfast')
      .replace(/smothie|smootie/g,'smoothie')
      .replace(/adress|adres/g,'address')
      .replace(/lokation|loction/g,'location')
      .replace(/bokking|boking/g,'booking')
      .replace(/delivry|deliveri/g,'delivery')
      .replace(/prise|prce/g,'price')
      .replace(/openning|opning/g,'opening')
      .replace(/menue/g,'menu');

    // ── GREETINGS (only full welcome on first message) ─────────
    if(/^(hi|hey|hello|yo|sup|howzit|hola|sawubona|good morning|good afternoon|good evening|morning|afternoon|evening)\b/.test(m)){
      if(msgCount===0){
        if(/good morning|morning/.test(m)) return`Good morning ☕️ Hope your day is starting well. How can I help?`;
        if(/good afternoon|afternoon/.test(m)) return`Good afternoon. How can I help you with Morda Café today?`;
        if(/good evening|evening/.test(m)) return`Good evening. I can help with our menu, opening hours, location, bookings, or general café questions.`;
        if(/yo|sup|howzit/.test(m)) return`Hey there ☕️ What can I help you with today?`;
        if(/hey/.test(m)) return`Hey, welcome to Morda Café. What can I help you with?`;
        return`Hi there ☕️ Welcome to Morda Café. How can I help you today?`;
      }
      return`Hey again! What else can I help you with?`;
    }

    // ── CLOSING / FAREWELL ─────────────────────────────────────
    if(/^(bye|goodbye|see you|later|cya|take care|see ya|cheers goodbye)\b/.test(m))
      return`Goodbye ☕️ Hope to see you at Morda Café soon.`;
    if(/^(no thanks|no thank you|nah|nope|no$|i'm good|im good|that's all|thats all|all good|i'm fine|im fine|nothing else)\b/.test(m))
      return`No problem. Have a lovely day.`;
    if(/^(thanks|thank you|okay thanks|ok thanks|cool thanks|appreciate it|cheers)\b/.test(m))
      return`You're welcome ☕️`;
    if(/^(okay|ok|cool|alright|got it|perfect|sounds good|nice)\b/.test(m))
      return`Great ☕️ Let me know if you need anything else.`;

    // ── WHAT CAN YOU DO ────────────────────────────────────────
    if(/(what can you|what can you help|what do you do|what is this|are you real|are you a bot|are you human|real person)/.test(m)){
      if(/real|human|person|bot/.test(m)) return`I'm the Morda Café assistant, here to help you quickly with café-related questions. For anything that needs the team directly, you can contact us on +27 11 567 8901.`;
      return`I can help with our menu, prices, opening hours, location, bookings, events, dietary questions, takeaway options, jobs, and business enquiries.`;
    }

    // ── PRICE CHECK (specific item) ────────────────────────────
    if(/(how much|price of|what does|cost of|how much is|what's the price|how much for)\s/.test(m)||/\bhow much\b/.test(m)){
      const found=getPrice(m);
      if(found) return`The ${found.item.replace(/\b\w/g,c=>c.toUpperCase())} is **${found.price}**.`;
      if(/coffee|latte|cappuccino/.test(m)) return`Our coffee prices start from **R35** for an Americano. The Morda Signature Latte is **R48**.`;
      if(/smoothie/.test(m)) return`Smoothies range from **R58 to R68**. The Berry Sunrise is R62, Tropical Glow is R60.`;
      if(/boba/.test(m)) return`Boba drinks range from **R55 to R65**. The Brown Sugar Boba Latte is R62.`;
      if(/breakfast/.test(m)) return`Breakfast options range from **R70 to R95**. The Breakfast Plate is R95, Granola Bowl is R70.`;
      if(/pastry|pastries|croissant/.test(m)) return`Pastries start from **R32** for a Butter Croissant.`;
      return`Which item would you like the price for?`;
    }

    // ── SINGLE WORD / SHORT INPUTS ──────────────────────────────
    if(/^price$/.test(m)) return`Which item would you like the price for?`;
    if(/^menu$/.test(m)) return`We serve coffees, breakfast, pastries, cakes, smoothies, and light meals. Are you looking for drinks, breakfast, pastries, or meals?`;
    if(/^(time|hours|open)$/.test(m)) return`We're open Mon–Fri 07:00–18:00, Saturday 08:00–17:00, and Sunday 08:00–15:00.`;
    if(/^location$/.test(m)) return`Shop 12, The MARC Lifestyle Centre, 129 Rivonia Road, Sandton, Johannesburg, 2196.`;
    if(/^booking$/.test(m)) return`For group bookings, please contact us on +27 11 567 8901 or email hello@mordacafe.co.za.`;
    if(/^[\p{Emoji}]+$/u.test(m)) return`Hi there ☕️ How can I help you with Morda Café today?`;

    // ── CASUAL / SLANG ─────────────────────────────────────────
    if(/what'?s?\s+good|what's nice|what'?s?\s+fire|what'?s?\s+hitting/.test(m))
      return`Some of the most popular items: Morda Signature Latte, Brown Sugar Boba Latte, Smashed Avo & Egg Toast, and French Toast Stack ☕️`;
    if(/what do you guys have|what do y'?all have|what y'?all got/.test(m))
      return`We serve coffees, breakfast meals, pastries, cakes, smoothies, and light meals.`;
    if(/any good food|got food|serve food/.test(m))
      return`Yes, definitely. Our Smashed Avo & Egg Toast, French Toast Stack, Omelette Deluxe, Chicken Wrap, and Chicken Mayo Toastie are all great options.`;
    if(/i'?m hungry|so hungry|starving/.test(m))
      return`For something filling: Morda Breakfast Plate, Omelette Deluxe, Chicken Wrap, or Beef Bagel would hit the spot.`;
    if(/i need coffee|need a coffee|want coffee$|want a coffee$/.test(m))
      return`You're in the right place ☕️ Try the Morda Signature Latte, Classic Cappuccino, Flat White, or Caramel Macchiato.`;
    if(/i want something sweet|something sweet/.test(m))
      return`You might love the French Toast Stack, Lemon Drizzle Cake, Cinnamon Roll, Chocolate Croissant, or Brown Sugar Boba Latte.`;
    if(/i want something fresh|something fresh|something fruity/.test(m))
      return`Try the Berry Sunrise Smoothie, Tropical Glow Smoothie, Green Boost Smoothie, or Café Salad Bowl.`;
    if(/i want something light|something light|not too heavy/.test(m))
      return`A Granola Bowl, Café Salad Bowl, Butter Croissant, or any of our smoothies would be a nice light option.`;
    if(/i want something (filling|heavy|big)|something filling/.test(m))
      return`The Morda Breakfast Plate, Omelette Deluxe, Beef Bagel, or Chicken Wrap would be more filling.`;
    if(/i want something cheap|something affordable|on a budget/.test(m))
      return`Some affordable options: Butter Croissant (R32), Americano (R35), Blueberry Muffin (R35), Chocolate Croissant (R38), Classic Cappuccino (R42).`;

    // ── PREFERENCE-BASED ───────────────────────────────────────
    if(/i like sweet|love sweet|sweet tooth/.test(m))
      return`You'll probably enjoy the Brown Sugar Boba Latte, Caramel Macchiato, Mocha Bliss, or Strawberry Cream Smoothie.`;
    if(/i like strong coffee|strong coffee|black coffee/.test(m))
      return`Try the Americano, Flat White, or Morda Signature Latte — all solid, strong choices.`;
    if(/don'?t like coffee|hate coffee|not a coffee person|no coffee/.test(m))
      return`No problem. Try one of our smoothies — Berry Sunrise, Tropical Glow, Green Boost, Peanut Butter Power, or Strawberry Cream.`;
    if(/i want something healthy|something healthy|healthy option/.test(m))
      return`Good picks: Green Boost Smoothie, Granola Bowl, Café Salad Bowl, or Smashed Avo & Egg Toast.`;

    // ── COMPARISONS ────────────────────────────────────────────
    if(/latte or cappuccino|cappuccino or latte/.test(m))
      return`A latte is smoother and creamier with more milk. A cappuccino has more foam and a stronger coffee feel.`;
    if(/smoothie or coffee/.test(m))
      return`Go for coffee if you want something warm or energising. Choose a smoothie if you want something cold and refreshing.`;
    if(/french toast or avo toast|avo toast or french toast/.test(m))
      return`French Toast Stack is sweeter and more indulgent. Smashed Avo & Egg Toast is savoury, fresh, and filling.`;
    if(/brown sugar boba.*signature latte|signature latte.*brown sugar boba/.test(m))
      return`Brown Sugar Boba is sweeter and more fun with chewy pearls. The Signature Latte is smoother and more classic — great for coffee lovers.`;

    // ── MENU OVERVIEW ──────────────────────────────────────────
    if(/(what do you sell|what do you serve|what do you have|what do you offer|what'?s on the menu|show me the menu|full menu)/.test(m))
      return`We serve coffees, breakfast meals, pastries, cakes, smoothies, and light meals. Popular items include the Morda Signature Latte, Brown Sugar Boba Latte, Smashed Avo & Egg Toast, French Toast Stack, Berry Sunrise Smoothie, and Almond Danish.`;

    // ── LIST REQUESTS ──────────────────────────────────────────
    if(/(list|all|every|show me all)\s*(your\s*)?(coffee|coffees|espresso drinks)/.test(m))
      return`Our coffees: Morda Signature Latte, Classic Cappuccino, Americano, Flat White, Caramel Macchiato, Iced Coffee, Mocha Bliss, Cold Brew, Espresso Shot, Cortado, Oat Milk Latte, Vanilla Latte.`;
    if(/(list|all|every|show me all)\s*(your\s*)?(breakfast|breakfasts)/.test(m))
      return`Breakfast options: Morda Breakfast Plate, Smashed Avo & Egg Toast, Breakfast Croissant, French Toast Stack, Omelette Deluxe, Granola Bowl, Eggs Benedict, Pancake Stack.`;
    if(/(list|all|every|show me all)\s*(your\s*)?(pastry|pastries|cakes|baked)/.test(m))
      return`Pastries & cakes: Butter Croissant, Chocolate Croissant, Cinnamon Roll, Blueberry Muffin, Almond Danish, Morda Brownie, Lemon Drizzle Cake.`;
    if(/(list|all|every|show me all)\s*(your\s*)?(smoothie|smoothies)/.test(m))
      return`Smoothies: Berry Sunrise, Tropical Glow, Green Boost, Peanut Butter Power, Strawberry Cream, Morda Energy Smoothie, Mango Madness, Pineapple Bliss.`;
    if(/(list|all|every|show me all)\s*(your\s*)?(light meal|meals|food)/.test(m))
      return`Light meals: Chicken Mayo Toastie, Caprese Panini, Beef Bagel, Chicken Wrap, Café Salad Bowl.`;
    if(/(list|all|every|show me all)\s*(your\s*)?(boba|bubble tea)/.test(m))
      return`Boba teas: Classic Milk Tea Boba, Taro Boba, Brown Sugar Boba Latte, Matcha Boba, Strawberry Boba, Thai Tea Boba, Mango Boba, Honeydew Boba, Morda Signature Boba.`;

    // ── SPECIFIC MENU QUESTIONS ────────────────────────────────
    if(/do you have coffee|you got coffee|sell coffee/.test(m))
      return`Yes ☕️ We serve Cappuccino, Americano, Flat White, Caramel Macchiato, Iced Coffee, Mocha Bliss, and our Morda Signature Latte.`;
    if(/do you have boba|sell boba|got boba/.test(m))
      return`Yes, we have a great boba selection! The Brown Sugar Boba Latte (R62) is our most popular. We also have Taro, Matcha, Mango, Strawberry, and more.`;
    if(/do you have smoothie|sell smoothie|got smoothie/.test(m))
      return`Yes, we have Berry Sunrise, Tropical Glow, Green Boost, Peanut Butter Power, Strawberry Cream, and Morda Energy Smoothie.`;
    if(/do you have breakfast|serve breakfast|got breakfast/.test(m))
      return`Yes, we serve breakfast from 07:00 — Morda Breakfast Plate, Smashed Avo & Egg Toast, Breakfast Croissant, French Toast Stack, Omelette Deluxe, and Granola Bowl.`;
    if(/do you have pastry|pastries|croissant|muffin|brownie/.test(m))
      return`Yes — Butter Croissants, Chocolate Croissants, Cinnamon Rolls, Blueberry Muffins, Almond Danish, Lemon Drizzle Cake, and Morda Brownies.`;
    if(/do you have light meal|light meals|toastie|panini|wrap/.test(m))
      return`Yes — Chicken Mayo Toastie, Caprese Panini, Beef Bagel, Chicken Wrap, and Café Salad Bowl.`;
    if(/do you have cake|sell cake/.test(m))
      return`Yes, we have Lemon Drizzle Cake and Morda Brownie. Both pair beautifully with a coffee ☕️`;

    // ── RECOMMENDATIONS ────────────────────────────────────────
    if(/(what do you recommend|recommend|suggest|what should i (get|try|order)|what'?s? good|what'?s? popular|best seller|must try|must have)/.test(m)){
      if(/coffee|latte|espresso/.test(m)) return`For coffee, I'd recommend the Morda Signature Latte (R48) — it's smooth, creamy, and our most popular. The Caramel Macchiato (R55) is also a great choice.`;
      if(/breakfast|morning|food|eat/.test(m)) return`For breakfast, the Smashed Avo & Egg Toast is a crowd favourite. If you want something more filling, the Morda Breakfast Plate or French Toast Stack are both excellent.`;
      if(/sweet|dessert/.test(m)) return`For something sweet, try the French Toast Stack, Brown Sugar Boba Latte, Lemon Drizzle Cake, or Cinnamon Roll.`;
      if(/smoothie|fresh|fruit/.test(m)) return`Berry Sunrise Smoothie is refreshing and delicious. Tropical Glow is also really popular. Both are blended fresh to order.`;
      if(/date/.test(m)) return`For a café date, I'd suggest the Morda Signature Latte, French Toast Stack, Berry Sunrise Smoothie, and Lemon Drizzle Cake — a really lovely combination.`;
      if(/study|work|laptop/.test(m)) return`A Flat White, Cappuccino, Iced Coffee, or Morda Signature Latte would be perfect for a work or study session.`;
      if(/kid|child/.test(m)) return`Smoothies, pastries, French Toast Stack, and light meals may be suitable. Please ask our team in-store for the best options for children.`;
      if(/first time|first visit|never been|first order/.test(m)) return`A great first order would be the Morda Signature Latte with either the Smashed Avo & Egg Toast or a Butter Croissant ☕️`;
      return`For coffee, the Morda Signature Latte. For breakfast, the Smashed Avo & Egg Toast is a great choice. For something sweet, try the French Toast Stack or Lemon Drizzle Cake.`;
    }

    // ── UNDER R50 ──────────────────────────────────────────────
    if(/under r?50|below r?50|less than r?50/.test(m))
      return`Under R50: Americano (R35), Classic Cappuccino (R42), Flat White (R44), Iced Coffee (R45), Morda Signature Latte (R48), Butter Croissant (R32), Blueberry Muffin (R35), Chocolate Croissant (R38), Cinnamon Roll (R42), Lemon Drizzle Cake (R42), Morda Brownie (R40).`;

    // ── CHEAPEST / MOST EXPENSIVE ──────────────────────────────
    if(/(cheapest|most affordable|lowest price|budget|cheap)/.test(m))
      return`Most affordable: Butter Croissant (R32), Americano (R35), Blueberry Muffin (R35), Cortado (R38), Chocolate Croissant (R38).`;
    if(/(most expensive|premium|highest price|top of the menu)/.test(m))
      return`Our premium items: Morda Breakfast Plate (R95), Salmon Toast (R95), Smashed Avo & Egg Toast (R85), Omelette Deluxe (R85), French Toast Stack (R88).`;

    // ── BEST FOR (specific use case) ───────────────────────────
    if(/best coffee|top coffee|favourite coffee|most popular coffee/.test(m))
      return`Our Morda Signature Latte is the one most customers keep coming back for. Smooth, creamy, and made with rich espresso ☕️`;
    if(/(most filling|filling breakfast|big breakfast)/.test(m))
      return`The Morda Breakfast Plate (R95) is the most filling — eggs, toast, beef sausage, grilled tomato, and mushrooms. The Omelette Deluxe (R85) is also very hearty.`;

    // ── SPECIALS ───────────────────────────────────────────────
    if(/(special|specials|discount|promotion|deal|student discount|loyalty)/.test(m))
      return`Specials may change from time to time. Please check in-store, follow @mordacafe, or contact us on +27 11 567 8901 for the latest offers.`;

    // ── QUALITY QUESTIONS ──────────────────────────────────────
    if(/is your coffee good|how'?s the coffee|coffee quality/.test(m))
      return`Yes, we focus on rich coffee, smooth flavour, and a premium café experience. Our Morda Signature Latte is a great place to start ☕️`;
    if(/are your pastries fresh|fresh pastries/.test(m))
      return`Our café is built around fresh, warm, quality café favourites. Please ask our team in-store about today's freshly available pastries.`;
    if(/is (your|the) food fresh|fresh food/.test(m))
      return`Yes, Morda Café focuses on fresh breakfasts, pastries, smoothies, and light meals made for everyday moments.`;

    // ── WAIT TIME ──────────────────────────────────────────────
    if(/(how long|wait time|how long does|preparation time|how long will)/.test(m))
      return`Preparation time depends on the order and how busy the café is. Please ask our team in-store for the most accurate wait time.`;
    if(/(is it busy|how busy|busy now|crowded)/.test(m))
      return`Busyness can vary throughout the day. Please contact us on +27 11 567 8901 if you'd like to check before visiting.`;

    // ── HOURS ──────────────────────────────────────────────────
    if(/(what time|opening hour|open hour|when do you open|when are you open|trading hour|business hour|open till|close at|when do you close|how late)/.test(m)){
      const day=new Date().toLocaleDateString('en-ZA',{weekday:'long'});
      if(/sunday/.test(m)) return`Yes, we are open on Sundays from 08:00 to 15:00.`;
      if(/saturday/.test(m)) return`Yes, we are open on Saturdays from 08:00 to 17:00.`;
      if(/public holiday/.test(m)) return`Public holiday trading may vary. Please contact us on +27 11 567 8901 to confirm.`;
      if(/open today|open now|still open/.test(m)) return`Our standard hours are Mon–Fri 07:00–18:00, Saturday 08:00–17:00, Sunday 08:00–15:00. Contact us on +27 11 567 8901 to confirm today's trading.`;
      if(/close|closing/.test(m)) return`We close at 18:00 Mon–Fri, 17:00 on Saturday, and 15:00 on Sunday.`;
      return`We open at 07:00 from Monday to Friday, and at 08:00 on Saturday and Sunday.`;
    }

    // ── LOCATION ───────────────────────────────────────────────
    if(/(where are you|where is morda|where'?s? morda|location|address|where can i find|how do i get|in sandton|send location|find you)/.test(m)){
      if(/park/.test(m)) return`Parking should be available at The MARC Lifestyle Centre. Please follow the centre's parking guidance when you arrive.`;
      if(/gautrain|train|walk/.test(m)) return`We're a short walk from Sandton Gautrain Station. Head down Rivonia Road and look for The MARC on your right. We're at Shop 12 on the ground floor.`;
      return`We're at Shop 12, The MARC Lifestyle Centre, 129 Rivonia Road, Sandton, Johannesburg, 2196.`;
    }

    // ── CONTACT ────────────────────────────────────────────────
    if(/(contact|call|phone number|your number|email|how do i reach|get in touch)/.test(m)){
      if(/email/.test(m)) return`Our email is hello@mordacafe.co.za.`;
      if(/number|phone|call/.test(m)) return`You can contact us on +27 11 567 8901.`;
      return`You can reach us on +27 11 567 8901 or email hello@mordacafe.co.za.`;
    }

    // ── BOOKINGS & EVENTS ──────────────────────────────────────
    if(/(book a table|book for|reservation|need a table|reserve|do i need to book)/.test(m))
      return`Walk-ins are welcome. For larger groups, it's best to contact us on +27 11 567 8901 or email hello@mordacafe.co.za.`;
    if(/(birthday|celebrate|special occasion|anniversary)/.test(m))
      return`We'd love to help make it special! Please contact us on +27 11 567 8901 or email hello@mordacafe.co.za to discuss arrangements.`;
    if(/(meeting|business meeting|corporate|work session)/.test(m))
      return`Yes, Morda Café is a great space for relaxed meetings and coffee catch-ups. For larger groups, please contact us directly to confirm availability.`;
    if(/(cater|catering)/.test(m))
      return`For catering requests, please email hello@mordacafe.co.za with your event details, date, number of guests, and what you need.`;
    if(/(private event|private hire|event space)/.test(m))
      return`Private event options may depend on availability. Please contact us on +27 11 567 8901 or email hello@mordacafe.co.za.`;

    // ── TAKEAWAY & DELIVERY ────────────────────────────────────
    if(/(takeaway|take away|take out|to go|grab and go)/.test(m))
      return`Yes, many of our drinks and food items can be prepared for takeaway.`;
    if(/(deliver|delivery|deliver to me|home delivery|door delivery)/.test(m))
      return`Delivery options may vary. Please contact the café directly on +27 11 567 8901 to confirm today's available options.`;
    if(/(uber eats|mr d|mr delivery|order online|online order|can i order)/.test(m))
      return`Delivery platform availability may vary. Please contact us on +27 11 567 8901 to confirm.`;
    if(/(collection|collect|pickup|pick up)/.test(m))
      return`Collection options may be available. Please contact us on +27 11 567 8901 to confirm and place your order.`;

    // ── PAYMENT ────────────────────────────────────────────────
    if(/(pay|payment|accept card|cash|tap|eft|snap|zapper|how do i pay)/.test(m)){
      if(/cash/.test(m)) return`Please confirm with our team in-store, as payment options may vary.`;
      return`Payment options may include common in-store methods, but please confirm with our team directly when ordering.`;
    }

    // ── DIETARY ────────────────────────────────────────────────
    if(/(vegan|plant.?based)/.test(m))
      return`Some items may be suitable or adjustable. Please ask our team directly before ordering so we can guide you properly.`;
    if(/(vegetarian|veggie)/.test(m))
      return`Items like Smashed Avo & Egg Toast, Granola Bowl, Caprese Panini, Café Salad Bowl, pastries, and smoothies may be suitable. Please ask our team in-store for guidance.`;
    if(/(gluten|celiac|wheat.?free)/.test(m))
      return`Some menu items may contain gluten. Please speak to our team before ordering so we can confirm safe options for you.`;
    if(/(halaal|halal)/.test(m))
      return`Please contact the café directly on +27 11 567 8901 or ask our team in-store to confirm our latest halaal status and ingredient details.`;
    if(/(dairy.?free|lactose|oat milk|alt milk|alternative milk)/.test(m))
      return`Milk alternatives may be available depending on stock. Please ask our team in-store or contact us on +27 11 567 8901 to confirm.`;
    if(/(nut|peanut|tree nut)/.test(m)&&/(allerg|free|contain|safe)/.test(m))
      return`Some items may contain nuts or be prepared near nuts. Please ask our team directly before ordering so we can guide you safely.`;
    if(/(allerg|intoleran|dietary requirement)/.test(m))
      return`Please speak to our team directly before ordering. Some items may contain allergens like dairy, eggs, gluten, nuts, or soy, and we want to guide you safely.`;

    // ── FACILITIES ─────────────────────────────────────────────
    if(/(wifi|wi.?fi|internet|wireless)/.test(m))
      return`Wi-Fi availability may vary. Please ask our team in-store when you arrive.`;
    if(/(work from|laptop|study|bring my laptop|co.?work)/.test(m))
      return`Yes, you're welcome to bring your laptop. Morda Café is a warm and comfortable space for coffee, light meals, and relaxed work sessions.`;
    if(/(charging|plug|power point|outlet)/.test(m))
      return`Charging plug availability may vary by seating area. Please ask our team when you arrive.`;
    if(/(wheelchair|accessible|disability)/.test(m))
      return`Please contact us directly or check with The MARC Lifestyle Centre for accessibility details before visiting.`;
    if(/(pet|dog|animal|bring my pet)/.test(m))
      return`Pet policies may depend on the centre rules. Please contact us directly or check with The MARC Lifestyle Centre before bringing a pet.`;
    if(/(baby|child|kid|family|stroller|pram)/.test(m))
      return`Families are welcome. Please ask our team in-store if you need assistance with seating.`;

    // ── CUSTOMER SERVICE ───────────────────────────────────────
    if(/(bad experience|unhappy|complaint|wrong order|disappointed|food was cold|not happy)/.test(m))
      return`We're really sorry to hear that. Please email hello@mordacafe.co.za or contact us on +27 11 567 8901 with the details so our team can assist you properly.`;
    if(/(refund)/.test(m))
      return`Refund requests are handled by the team directly. Please contact us on +27 11 567 8901 or email hello@mordacafe.co.za with your order details.`;
    if(/(left something|lost|forgot|find my|left my)/.test(m))
      return`Please contact us on +27 11 567 8901 as soon as possible with a description of the item, and our team will check for you.`;
    if(/(speak to (a |the )?manager|speak to someone|speak to a person|human help|real person)/.test(m))
      return`Of course. Please contact the Morda Café team directly on +27 11 567 8901 or email hello@mordacafe.co.za.`;
    if(/(feedback|suggestion|leave a review|google review)/.test(m))
      return`We'd love to hear from you! Please send feedback to hello@mordacafe.co.za or contact us on +27 11 567 8901. You can also tag us @mordacafe on Instagram.`;

    // ── RUDE CUSTOMERS ─────────────────────────────────────────
    if(/(useless|stupid|idiot|terrible|rubbish|trash|awful|this is bad|waste of time)/.test(m))
      return`I'm sorry I couldn't help the way you expected. For direct support, please contact the Morda Café team on +27 11 567 8901.`;

    // ── SOCIAL MEDIA ───────────────────────────────────────────
    if(/(instagram|facebook|tiktok|social media|follow you|your socials)/.test(m))
      return`You can follow us at **@mordacafe** on Instagram, Facebook, and TikTok ☕️`;
    if(/(tag you|tag us|repost|feature me|feature my)/.test(m))
      return`Absolutely. Tag us at @mordacafe. We love seeing our customers enjoy the Morda Café experience.`;
    if(/(influencer|collab|collaboration|creator|content)/.test(m))
      return`For collaborations, please email hello@mordacafe.co.za with your profile, audience details, and proposal.`;

    // ── JOBS & BUSINESS ────────────────────────────────────────
    if(/(hiring|job|work for you|employment|career|apply|vacancy|join the team|barista job)/.test(m))
      return`For job opportunities, please email your CV or enquiry to hello@mordacafe.co.za. If there are available positions, our team will get back to you.`;
    if(/(partner|partnership|business enquiry|supply|supplier|vendor)/.test(m)){
      if(/(supply|supplier|vendor|provide product)/.test(m)) return`Supplier enquiries can be sent to hello@mordacafe.co.za. Please include your company details, product list, and contact information.`;
      return`Please email hello@mordacafe.co.za with the details, and the Morda Café team will get back to you.`;
    }

    // ── FOUNDER / ABOUT ────────────────────────────────────────
    if(/(who own|who found|who start|who built|who is kabelo|owner|founder|about morda|what is morda)/.test(m)){
      if(/kabelo/.test(m)) return`Kabelo Maseko is the founder of Morda Café — a barista, entrepreneur, and visionary passionate about coffee, hospitality, and creating warm café experiences.`;
      if(/tell me about|about morda|what is morda/.test(m)) return`Morda Café is a premium modern café in Sandton, Johannesburg, serving rich coffee, fresh breakfasts, pastries, smoothies, and light meals in a warm and elegant space. Founded in 2023 by Kabelo Maseko.`;
      return`Morda Café was founded by Kabelo Maseko — a barista, entrepreneur, and visionary.`;
    }

    // ── MAPHAKE ────────────────────────────────────────────────
    if(/(maphake|who built this|who made you|who programmed|automation|ai system|chatbot)/.test(m))
      return`I'm powered by **Maphake Automation** ⚡ — an AI automation agency based in Johannesburg. Visit maphakeautomation.co.za to learn more!`;

    // ── JOKE ──────────────────────────────────────────────────
    if(/(joke|tell me a joke|make me laugh|be funny)/.test(m))
      return`I'm mostly here for Morda Café questions, but here's a café one: Why did the coffee file a police report? It got mugged ☕️`;

    // ── RATINGS ────────────────────────────────────────────────
    if(/(rating|review|star|rated|reputation|what do people say)/.test(m))
      return`We're proud of our 4.8⭐ rating from 247+ reviews. Coffee is rated 4.9/5 and service 4.9/5. Visit our Ratings page to read what customers are saying!`;

    // ── OFF-TOPIC ──────────────────────────────────────────────
    if(/(homework|school|politics|relationship|news|weather|sport|soccer|football|crypto|stock|invest)/.test(m))
      return`I'm here to help with Morda Café questions — menu, prices, location, hours, bookings, events, and customer support.`;

    // ── DEFAULT ────────────────────────────────────────────────
    return`I'm not quite sure about that one. You can contact our team directly on +27 11 567 8901 or email hello@mordacafe.co.za and they'll be happy to help ☕️`;
  }

  // ── CHAT UI ──────────────────────────────────────────────────
  function toggleChat(){open=!open;panel.classList.toggle('open',open);if(open)input.focus();}
  toggle.addEventListener('click',toggleChat);
  closeBtn?.addEventListener('click',toggleChat);

  function fmt(t){return t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');}
  function addMsg(txt,role){
    const d=document.createElement('div');d.className='chat-msg '+role;
    d.innerHTML=role==='bot'?'<div class="msg-icon">☕</div><p>'+fmt(txt)+'</p>':'<p>'+txt+'</p>';
    msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;
  }
  function addTyping(){
    const d=document.createElement('div');d.className='chat-msg bot typing';
    d.innerHTML='<div class="msg-icon">☕</div><p><span class="dot"></span><span class="dot"></span><span class="dot"></span></p>';
    msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d;
  }
  async function send(){
    const text=input.value.trim();if(!text)return;
    input.value='';addMsg(text,'user');msgCount++;
    const dot=addTyping();
    // Natural response delay — faster for short messages
    const delay=text.length<20?400:600+Math.random()*300;
    setTimeout(()=>{dot.remove();addMsg(reply(text),'bot');},delay);
  }
  sendBtn.addEventListener('click',send);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
})();
