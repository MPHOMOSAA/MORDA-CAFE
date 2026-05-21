/* ============================================================
   Morda Café – app.js v5.0
   Human-Like AI · Multi-Step Order Flow · Swirl · Nav
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

// ── SWIRL ─────────────────────────────────────────────────────
(function(){
  const canvas=document.getElementById('swirlCanvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H,pts=[],t=0,raf;
  const COLS=[[194,138,69,.22],[107,63,42,.16],[247,233,210,.11],[43,11,8,.30],[194,138,69,.09],[232,211,176,.10],[150,90,50,.14]];
  const resize=()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight;};
  const flow=(x,y,t)=>Math.sin(x*.0024+t*.33+Math.cos(y*.0019+t*.17))*Math.cos(y*.002-t*.21+Math.sin(x*.0028+t*.11))*Math.PI*2+Math.sin((x+y)*.0014+t*.14)*Math.PI;
  const spawn=()=>{const c=COLS[~~(Math.random()*COLS.length)];const l=.3+Math.random()*.7;return{x:Math.random()*W,y:Math.random()*H,px:0,py:0,spd:.5+Math.random()*2,r:c[0],g:c[1],b:c[2],a:c[3],sz:.4+Math.random()*1.8,life:l,ml:l};};
  function init(){resize();ctx.fillStyle='#1F0404';ctx.fillRect(0,0,W,H);pts=[];for(let i=0;i<300;i++){const p=spawn();p.px=p.x;p.py=p.y;pts.push(p);}}
  function draw(){
    t+=.006;ctx.fillStyle='rgba(31,4,4,0.022)';ctx.fillRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];p.px=p.x;p.py=p.y;const a=flow(p.x,p.y,t);
      p.x+=Math.cos(a)*p.spd;p.y+=Math.sin(a)*p.spd;p.life-=.0013;
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
  const obs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible');});},{threshold:.06});
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

// ══════════════════════════════════════════════════════════════
//  CART + MULTI-STEP ORDER FLOW
// ══════════════════════════════════════════════════════════════
window.CART={
  items:[],
  add(name,price){
    const pr=parseFloat(String(price).replace('R',''));
    const ex=this.items.find(i=>i.name===name);
    if(ex){ex.qty++;}else{this.items.push({name,price:pr,qty:1});}
    this.update();this.bump();
    // Visual feedback on button
    const btns=document.querySelectorAll('.add-btn');
    btns.forEach(b=>{if(b.getAttribute('onclick')&&b.getAttribute('onclick').includes(name.replace(/'/g,"\\'"))){
      b.textContent='✓';b.style.background='#22c55e';
      setTimeout(()=>{b.textContent='+';b.style.background='';},1200);
    }});
  },
  remove(name){this.items=this.items.filter(i=>i.name!==name);this.update();},
  setQty(name,delta){
    const i=this.items.find(x=>x.name===name);
    if(i){i.qty+=delta;if(i.qty<=0)this.remove(name);else this.update();}
  },
  total(){return this.items.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);},
  count(){return this.items.reduce((s,i)=>s+i.qty,0);},
  update(){
    const badge=document.getElementById('cartBadge');
    if(badge){const n=this.count();badge.textContent=n;badge.style.display=n>0?'flex':'none';}
    this.render();
  },
  bump(){
    const btn=document.getElementById('cartBtn');
    if(!btn)return;btn.classList.add('bump');setTimeout(()=>btn.classList.remove('bump'),400);
  },
  render(){
    const body=document.getElementById('cartBody');
    if(!body)return;
    if(!this.items.length){
      body.innerHTML='<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p><small>Browse the menu above and tap + to add items</small></div>';
    }else{
      body.innerHTML=this.items.map(i=>`
        <div class="cart-row">
          <div class="cart-row-info"><strong>${i.name}</strong><span>R${i.price.toFixed(2)} each</span></div>
          <div class="cart-row-ctrl">
            <button onclick="CART.setQty('${i.name.replace(/'/g,"\\'")}', -1)">−</button>
            <span>${i.qty}</span>
            <button onclick="CART.setQty('${i.name.replace(/'/g,"\\'")}', 1)">+</button>
          </div>
          <span class="cart-row-sub">R${(i.price*i.qty).toFixed(2)}</span>
        </div>`).join('');
    }
    document.getElementById('cartTotal').textContent='R'+this.total();
  },
  summaryHTML(){
    return this.items.map(i=>`<div class="preview-row"><span>${i.qty}× ${i.name}</span><span>R${(i.price*i.qty).toFixed(2)}</span></div>`).join('');
  },
  open(){document.getElementById('cartPanel')?.classList.add('open');document.getElementById('cartOverlay')?.classList.add('open');this.render();},
  close(){document.getElementById('cartPanel')?.classList.remove('open');document.getElementById('cartOverlay')?.classList.remove('open');}
};

// ── ORDER FLOW ─────────────────────────────────────────────────
(function(){
  const $ = id=>document.getElementById(id);

  // Cart open/close
  $('cartBtn')?.addEventListener('click',()=>CART.open());
  $('cartClose')?.addEventListener('click',()=>CART.close());
  $('cartOverlay')?.addEventListener('click',()=>CART.close());

  const overlay=$('orderFlowOverlay');
  const box=$('orderFlowBox');
  if(!overlay)return;

  let orderMethod='delivery';

  function showStep(id){
    document.querySelectorAll('.flow-step').forEach(s=>{s.style.display='none';});
    const el=document.getElementById(id);
    if(el){el.style.display='block';el.style.animation='flowStepIn .35s ease';}
  }

  function openFlow(){
    if(CART.count()===0){
      alert('Please add at least one item to your order first!');return;
    }
    CART.close();
    // Populate step 1 preview
    const p=$('step1Preview');
    if(p)p.innerHTML='<div class="preview-label">Your order:</div>'+CART.summaryHTML()+`<div class="preview-total">Total: <strong>R${CART.total()}</strong></div>`;
    showStep('step1');
    overlay.classList.add('open');
    overlay.style.display='flex';
  }

  function closeFlow(){
    overlay.classList.remove('open');
    setTimeout(()=>{overlay.style.display='none';},300);
  }

  $('placeOrderBtn')?.addEventListener('click',openFlow);
  $('flowClose')?.addEventListener('click',closeFlow);
  overlay?.addEventListener('click',e=>{if(e.target===overlay)closeFlow();});

  // Step 1 → Step 2
  $('chooseDelivery')?.addEventListener('click',()=>{
    orderMethod='delivery';
    const p=$('step2dPreview');
    if(p)p.innerHTML='<div class="preview-label">Your order:</div>'+CART.summaryHTML()+`<div class="preview-total">Total: <strong>R${CART.total()}</strong></div>`;
    showStep('step2delivery');
  });
  $('chooseCollection')?.addEventListener('click',()=>{
    orderMethod='collection';
    const p=$('step2cPreview');
    if(p)p.innerHTML='<div class="preview-label">Your order:</div>'+CART.summaryHTML()+`<div class="preview-total">Total: <strong>R${CART.total()}</strong></div>`;
    showStep('step2collection');
  });

  // Back buttons
  $('backFromDelivery')?.addEventListener('click',()=>showStep('step1'));
  $('backFromCollection')?.addEventListener('click',()=>showStep('step1'));

  // Confirm delivery
  $('confirmDelivery')?.addEventListener('click',()=>{
    const name=$('dName')?.value.trim();
    const phone=$('dPhone')?.value.trim();
    const address=$('dAddress')?.value.trim();
    if(!name||!phone||!address){alert('Please fill in your name, phone number, and delivery address.');return;}
    processOrder('delivery',name,phone,address,$('dNotes')?.value.trim()||'');
  });

  // Confirm collection
  $('confirmCollection')?.addEventListener('click',()=>{
    const name=$('cName')?.value.trim();
    const phone=$('cPhone')?.value.trim();
    if(!name||!phone){alert('Please fill in your name and phone number.');return;}
    processOrder('collection',name,phone,'Shop 12, The MARC, Sandton',$('cNotes')?.value.trim()||'');
  });

  function processOrder(method,name,phone,address,notes){
    showStep('step3processing');
    const orderNum='MC-'+Math.floor(10000+Math.random()*90000);
    const eta=method==='delivery'?'30–45 minutes':'10–15 minutes';
    const etaIcon=method==='delivery'?'🛵':'🏃';
    const etaLabel=method==='delivery'?'Estimated delivery time':'Ready for collection in';

    setTimeout(()=>{
      // Fill confirmation
      $('confirmTitle').textContent=method==='delivery'?'Order Placed! On Its Way! 🛵':'Order Confirmed! Ready Soon! 🏃';
      $('confirmRef').textContent='Order '+orderNum;
      $('confirmMsg').textContent=method==='delivery'
        ?`We're preparing your order now, ${name}. Your delivery is heading to ${address}.`
        :`Thanks ${name}! Your order will be ready at Shop 12, The MARC, Sandton. We'll call you on ${phone} when it's ready.`;
      $('confirmEta').innerHTML=`<span>${etaIcon}</span><div><strong>${etaLabel}</strong><span>${eta}</span></div>`;
      $('confirmItems').innerHTML=CART.summaryHTML();
      $('confirmTotal').textContent=`Total: R${CART.total()}`;
      showStep('step4confirm');
    },2500);
  }

  $('doneBtn')?.addEventListener('click',()=>{
    closeFlow();
    CART.items=[];CART.update();
    // Clear form fields
    ['dName','dPhone','dAddress','dNotes','cName','cPhone','cNotes'].forEach(id=>{const el=$(id);if(el)el.value='';});
  });
})();

// ══════════════════════════════════════════════════════════════
//  MORDA CAFÉ AI — FULL INTELLIGENCE ENGINE v5.0
//  Natural · Human-Like · Knows everything about the business
//  No re-introduction · Context-aware · Short answers
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

  let open=false,msgCount=0;

  // ── FULL BUSINESS KNOWLEDGE BASE ────────────────────────────
  const PRICES={
    'morda signature latte':'R48','signature latte':'R48',
    'classic cappuccino':'R42','cappuccino':'R42',
    'americano':'R35','flat white':'R44',
    'caramel macchiato':'R55','macchiato':'R55',
    'iced coffee':'R45','mocha bliss':'R58','mocha':'R58',
    'cold brew':'R52','espresso shot':'R28','espresso':'R28',
    'cortado':'R38','oat milk latte':'R52','vanilla latte':'R50',
    'classic milk tea boba':'R55','milk tea boba':'R55',
    'taro boba':'R58','taro':'R58',
    'brown sugar boba latte':'R62','brown sugar boba':'R62','boba latte':'R62',
    'matcha boba':'R60','matcha':'R60',
    'strawberry boba':'R58','thai tea boba':'R55','thai tea':'R55',
    'mango boba':'R57','honeydew boba':'R56','honeydew':'R56',
    'morda signature boba':'R65',
    'berry sunrise':'R62','berry sunrise smoothie':'R62',
    'tropical glow':'R60','tropical glow smoothie':'R60',
    'green boost':'R58','green boost smoothie':'R58',
    'peanut butter power':'R65','pb power':'R65',
    'strawberry cream':'R60','strawberry cream smoothie':'R60',
    'morda energy smoothie':'R68','energy smoothie':'R68',
    'mango madness':'R62','pineapple bliss':'R58',
    'classic avo toast':'R78','avo toast':'R78',
    'smashed avo and egg toast':'R85','smashed avo egg toast':'R85','avo egg toast':'R85',
    'smashed avo':'R85','avo and egg':'R85',
    'pb banana toast':'R55','peanut butter banana toast':'R55',
    'feta and tomato toast':'R70','feta toast':'R70',
    'honey ricotta toast':'R68','ricotta toast':'R68',
    'salmon toast':'R95','smoked salmon toast':'R95',
    'morda breakfast plate':'R95','breakfast plate':'R95','full breakfast':'R95',
    'breakfast croissant':'R82','french toast stack':'R88','french toast':'R88',
    'omelette deluxe':'R85','omelette':'R85',
    'granola bowl':'R70','eggs benedict':'R92','benedict':'R92',
    'pancake stack':'R80','pancakes':'R80',
    'butter croissant':'R32','croissant':'R32',
    'chocolate croissant':'R38','pain au chocolat':'R38',
    'cinnamon roll':'R42','blueberry muffin':'R35','muffin':'R35',
    'almond danish':'R45','danish':'R45',
    'morda brownie':'R40','brownie':'R40',
    'lemon drizzle cake':'R42','lemon cake':'R42','lemon drizzle':'R42',
    'chicken mayo toastie':'R72','toastie':'R72','chicken toastie':'R72',
    'caprese panini':'R75','panini':'R75',
    'beef bagel':'R90','bagel':'R90',
    'chicken wrap':'R88','wrap':'R88',
    'cafe salad bowl':'R82','salad bowl':'R82','salad':'R82',
  };

  function priceCheck(m){
    // direct match
    for(const[item,price]of Object.entries(PRICES)){
      if(m.includes(item))return`The **${item.replace(/\b\w/g,c=>c.toUpperCase())}** is **${price}**.`;
    }
    return null;
  }

  function normalise(m){
    return m.toLowerCase()
      .replace(/coffe{1,2}|café/g,'coffee').replace(/brekfast|brekfest/g,'breakfast')
      .replace(/smoth(ie)?|smootie/g,'smoothie').replace(/adress|adres/g,'address')
      .replace(/lokation|loction/g,'location').replace(/boking|bokking/g,'booking')
      .replace(/delivr[yi]|deliveri/g,'delivery').replace(/prise|prce/g,'price')
      .replace(/openning|opning/g,'opening').replace(/menue/g,'menu')
      .replace(/cappucino|capucino/g,'cappuccino').replace(/latte$/,'latte')
      .replace(/croisant|croissant/g,'croissant').replace(/avocado/g,'avo')
      .replace(/&amp;/g,'and').replace(/&/g,'and');
  }

  function today(){
    const d=new Date().toLocaleDateString('en-ZA',{weekday:'long'});
    if(d==='Saturday')return{day:'Saturday',hrs:'08:00–17:00',open:true};
    if(d==='Sunday')return{day:'Sunday',hrs:'08:00–15:00',open:true};
    return{day:d,hrs:'07:00–18:00',open:true};
  }

  // ── MAIN REPLY FUNCTION ──────────────────────────────────────
  function reply(raw){
    const m=normalise(raw);
    const isShort=raw.trim().length<20;

    // ── GREETINGS ──────────────────────────────────────────────
    if(/^(hi|hey|hello|yo|sup|howzit|hola|sawubona|molo|heita)\b/.test(m)){
      if(msgCount>0)return`Hey! What else can I help you with?`;
      if(/good morning|morning/.test(m))return`Good morning ☕️ Hope your day is starting well. How can I help?`;
      if(/good afternoon|afternoon/.test(m))return`Good afternoon. How can I help you with Morda Café today?`;
      if(/good evening|evening/.test(m))return`Good evening. I can help with our menu, hours, location, bookings, and more.`;
      if(/yo|sup|howzit|heita/.test(m))return`Hey there ☕️ What can I help you with today?`;
      if(/hey/.test(m))return`Hey, welcome to Morda Café. What can I help you with?`;
      return`Hi there ☕️ Welcome to Morda Café. How can I help you today?`;
    }

    // ── FAREWELLS & SHORT CLOSERS ──────────────────────────────
    if(/^(bye|goodbye|see you|later|cya|take care|see ya)\b/.test(m)) return`Goodbye ☕️ Hope to see you at Morda Café soon!`;
    if(/^(no thanks|no thank you|nah|nope|no$|i'?m good|that'?s all|all good|i'?m fine|nothing else|not really|never mind|nevermind)\b/.test(m)) return`No problem. Have a lovely day!`;
    if(/^(thanks|thank you|thx|ty|okay thanks|cheers|appreciate it|perfect|sounds good)\b/.test(m)) return`You're welcome ☕️`;
    if(/^(okay|ok|cool|alright|got it|nice|great|awesome)\b/.test(m)) return`Great ☕️ Let me know if there's anything else.`;

    // ── WHAT CAN YOU DO / ARE YOU REAL ────────────────────────
    if(/(what can you|what can you help|what do you do|are you a bot|are you human|are you real|real person|ai assistant)\b/.test(m)){
      if(/real|human|person|bot/.test(m))return`I'm the Morda Café AI assistant — here to help you quickly. For anything needing the team directly, call +27 11 567 8901.`;
      return`I can help with:\n• Menu & prices\n• Opening hours & location\n• Bookings & events\n• Dietary questions\n• Takeaway & delivery\n• Jobs & partnerships\n\nJust ask!`;
    }

    // ── PRICE SPECIFIC LOOKUP ──────────────────────────────────
    const pc=priceCheck(m);
    if(pc)return pc;

    if(/(how much|price of|what does|cost of|how much is|price for|how much for|what'?s the price)\b/.test(m)){
      if(/coffee/.test(m))return`Coffee starts from **R35** (Americano). Our Signature Latte is **R48**.`;
      if(/smoothie/.test(m))return`Smoothies range from **R58–R68**. Berry Sunrise is R62, Tropical Glow R60.`;
      if(/boba/.test(m))return`Boba drinks range from **R55–R65**. The Brown Sugar Boba Latte is our most popular at R62.`;
      if(/breakfast/.test(m))return`Breakfast ranges from **R70–R95**. Granola Bowl R70, Breakfast Plate R95.`;
      if(/pastry|pastries|cake/.test(m))return`Pastries start from **R32** (Butter Croissant) up to R45 (Almond Danish).`;
      if(/toast/.test(m))return`Toast options range from **R55–R95**. PB Banana Toast is R55, Salmon Toast R95.`;
      return`Which item would you like the price for? I can tell you exactly.`;
    }

    // ── SHORT SINGLE-WORD INPUTS ───────────────────────────────
    if(/^price\??$/.test(m)) return`Which item would you like the price for?`;
    if(/^menu\??$/.test(m)) return`We serve coffees, breakfast, pastries, smoothies, boba, and light meals. Looking for anything specific?`;
    if(/^(time|hours?|open)\??$/.test(m)){const d=today();return`We're open today (${d.day}) **${d.hrs}**.\nFull hours: Mon–Fri 07:00–18:00 · Sat 08:00–17:00 · Sun 08:00–15:00.`;}
    if(/^location\??$/.test(m)) return`Shop 12, The MARC Lifestyle Centre, 129 Rivonia Road, Sandton, Joburg 2196.`;
    if(/^booking\??$/.test(m)) return`For group bookings contact us on +27 11 567 8901 or email hello@mordacafe.co.za.`;
    if(/^[\p{Emoji}]+$/u.test(m)) return`Hi there ☕️ How can I help you with Morda Café today?`;

    // ── CASUAL / SLANG ─────────────────────────────────────────
    if(/(what'?s good|what'?s nice|what'?s fire|what'?s hitting|what'?s popular|what'?s the move)/.test(m))
      return`Top picks right now:\n• ☕ Morda Signature Latte (R48)\n• 🧋 Brown Sugar Boba Latte (R62)\n• 🍞 Smashed Avo & Egg Toast (R85)\n• 🥐 French Toast Stack (R88)`;
    if(/(what do you guys have|what do y'?all have|what y'?all got|what'?s on)/.test(m))
      return`We've got coffees, boba teas, smoothies, toast, breakfast plates, pastries, cakes, and light meals. What are you in the mood for?`;
    if(/(any good food|got food|food menu)/.test(m))
      return`Great food options: Smashed Avo & Egg Toast, French Toast Stack, Omelette Deluxe, Chicken Wrap, and Chicken Mayo Toastie are all big hits.`;
    if(/(i'?m hungry|starving|so hungry|haven'?t eaten)/.test(m))
      return`Something filling for you: Morda Breakfast Plate (R95), Omelette Deluxe (R85), Chicken Wrap (R88), or Beef Bagel (R90). All prepared fresh!`;
    if(/(i need coffee|need a coffee|want a coffee now|craving coffee)/.test(m))
      return`You're in the right place ☕️ Our Signature Latte (R48), Caramel Macchiato (R55), or Cold Brew (R52) — any of those calling your name?`;
    if(/(something sweet|want something sweet|sweet tooth|sugar craving)/.test(m))
      return`Try the French Toast Stack (R88), Brown Sugar Boba Latte (R62), Lemon Drizzle Cake (R42), or Cinnamon Roll (R42). All dangerously good.`;
    if(/(something fresh|something fruity|something cold|refreshing)/.test(m))
      return`Berry Sunrise Smoothie (R62), Tropical Glow (R60), or our Matcha Boba (R60) — all cold, fresh, and blended to order.`;
    if(/(something light|not too heavy|light meal)/.test(m))
      return`Granola Bowl (R70), Café Salad Bowl (R82), Butter Croissant (R32), or any of our smoothies — all lighter options that still hit the spot.`;
    if(/(something filling|heavy meal|big meal|so hungry)/.test(m))
      return`Morda Breakfast Plate (R95), Omelette Deluxe (R85), Beef Bagel (R90), or French Toast Stack (R88) — all seriously satisfying.`;
    if(/(something cheap|on a budget|affordable|cheap option)/.test(m))
      return`Budget-friendly picks: Butter Croissant (R32), Americano (R35), Blueberry Muffin (R35), Chocolate Croissant (R38), or Espresso Shot (R28).`;

    // ── PREFERENCE-BASED ───────────────────────────────────────
    if(/(i like sweet|love sweet|sweet drinks|sweet tooth)/.test(m))
      return`You'll love the Brown Sugar Boba Latte (R62), Caramel Macchiato (R55), Mocha Bliss (R58), or Strawberry Cream Smoothie (R60).`;
    if(/(strong coffee|black coffee|no milk|black|strong)/.test(m)&&/coffee/.test(m))
      return`For a strong cup: Americano (R35), Flat White (R44), Cold Brew (R52), or an Espresso Shot (R28). Bold and no-nonsense.`;
    if(/(don'?t like coffee|hate coffee|not a coffee person|no coffee)/.test(m))
      return`No problem! Try our Berry Sunrise Smoothie (R62), Tropical Glow (R60), Taro Boba (R58), or Matcha Boba (R60) — all amazing without coffee.`;
    if(/(healthy|clean eating|nutritious|gym|workout|post workout|pre workout)/.test(m))
      return`Healthy picks: Green Boost Smoothie (R58), Granola Bowl (R70), Smashed Avo & Egg Toast (R85), Café Salad Bowl (R82), or Peanut Butter Power smoothie (R65).`;
    if(/(i like fruit|fruity|love fruit)/.test(m))
      return`You'll enjoy Berry Sunrise (R62), Tropical Glow (R60), Mango Madness (R62), or Pineapple Bliss (R58) — all packed with real fruit.`;
    if(/(vibe|cosy|chill|relax|catch up|with friends|with family)/.test(m))
      return`Morda Café is perfect for that. Come in, grab a Signature Latte or boba, find a comfortable spot, and enjoy the atmosphere. ☕️`;

    // ── COMPARISONS ────────────────────────────────────────────
    if(/(latte or cappuccino|cappuccino or latte)/.test(m))
      return`Latte is smoother and creamier with more milk. Cappuccino has more foam and a stronger espresso punch. Both are great — depends on your mood!`;
    if(/(smoothie or coffee|coffee or smoothie)/.test(m))
      return`Coffee if you want energy and warmth. Smoothie if you want something cold, fresh, and fruity. Both are great starting points here.`;
    if(/(french toast or avo|avo.*french toast|french toast.*avo)/.test(m))
      return`French Toast Stack is sweet, indulgent, and stacked with berries. Smashed Avo & Egg Toast is savoury, fresh, and filling. Both are customer favourites!`;
    if(/(brown sugar boba.*signature|signature.*brown sugar boba)/.test(m))
      return`Brown Sugar Boba is sweeter with chewy pearls — more of an experience. Signature Latte is smooth, classic, and coffee-forward. First timer? Try the Latte. Adventurous? Go Boba.`;
    if(/(hot or cold|cold or hot)/.test(m)&&/coffee|drink/.test(m))
      return`For hot: Signature Latte, Cappuccino, Flat White. For cold: Iced Coffee (R45) or Cold Brew (R52). Both are excellent.`;

    // ── MENU OVERVIEW ──────────────────────────────────────────
    if(/(what do you sell|what do you serve|what do you have|what'?s on the menu|show me the menu|full menu|everything you have|what'?s available)/.test(m))
      return`We serve:\n• ☕ Coffees (R28–R58)\n• 🧋 Boba Tea (R55–R65)\n• 🥤 Smoothies (R58–R68)\n• 🍞 Toast & Open Sandwiches (R55–R95)\n• 🍳 Breakfast (R70–R95)\n• 🥐 Pastries & Cakes (R32–R48)\n• 🥗 Light Meals (R72–R90)\n\nWant me to go into detail on any category?`;

    // ── UNDER R50 ──────────────────────────────────────────────
    if(/under r?50|below r?50|less than r?50|r50 or less/.test(m))
      return`Under R50: Espresso Shot R28, Butter Croissant R32, Americano R35, Blueberry Muffin R35, Cortado R38, Chocolate Croissant R38, Morda Brownie R40, Cinnamon Roll R42, Lemon Drizzle Cake R42, Flat White R44, Iced Coffee R45.`;

    // ── CHEAPEST / MOST EXPENSIVE ──────────────────────────────
    if(/(cheapest|most affordable|lowest price|budget|what'?s cheap)/.test(m))
      return`Most affordable: Espresso Shot R28, Butter Croissant R32, Americano R35, Blueberry Muffin R35, Cortado R38.`;
    if(/(most expensive|premium|highest price|top of the range)/.test(m))
      return`Top-end items: Morda Breakfast Plate R95, Salmon Toast R95, French Toast Stack R88, Chicken Wrap R88, Omelette Deluxe R85.`;

    // ── LIST REQUESTS ──────────────────────────────────────────
    if(/(list|all|every|show me all)\s*(your\s*)?(coffee|coffees)/.test(m))
      return`All coffees:\nMorda Signature Latte R48 · Classic Cappuccino R42 · Americano R35 · Flat White R44 · Caramel Macchiato R55 · Iced Coffee R45 · Mocha Bliss R58 · Cold Brew R52 · Espresso Shot R28 · Cortado R38 · Oat Milk Latte R52 · Vanilla Latte R50`;
    if(/(list|all|every|show me all)\s*(your\s*)?(boba|bubble tea)/.test(m))
      return`All boba teas:\nClassic Milk Tea R55 · Taro Boba R58 · Brown Sugar Boba Latte R62 · Matcha Boba R60 · Strawberry Boba R58 · Thai Tea Boba R55 · Mango Boba R57 · Honeydew Boba R56 · Morda Signature Boba R65`;
    if(/(list|all|every|show me all)\s*(your\s*)?(smoothie|smoothies)/.test(m))
      return`All smoothies:\nBerry Sunrise R62 · Tropical Glow R60 · Green Boost R58 · Peanut Butter Power R65 · Strawberry Cream R60 · Morda Energy Smoothie R68 · Mango Madness R62 · Pineapple Bliss R58`;
    if(/(list|all|every|show me all)\s*(your\s*)?(breakfast|breakfasts)/.test(m))
      return`All breakfast:\nMorda Breakfast Plate R95 · Breakfast Croissant R82 · French Toast Stack R88 · Omelette Deluxe R85 · Granola Bowl R70 · Eggs Benedict R92 · Pancake Stack R80`;
    if(/(list|all|every|show me all)\s*(your\s*)?(pastry|pastries|cakes|baked)/.test(m))
      return`All pastries & cakes:\nButter Croissant R32 · Chocolate Croissant R38 · Cinnamon Roll R42 · Blueberry Muffin R35 · Almond Danish R45 · Morda Brownie R40 · Lemon Drizzle Cake R42`;
    if(/(list|all|every|show me all)\s*(your\s*)?(light meal|meals|food options)/.test(m))
      return`All light meals:\nChicken Mayo Toastie R72 · Caprese Panini R75 · Beef Bagel R90 · Chicken Wrap R88 · Café Salad Bowl R82`;
    if(/(list|all|every|show me all)\s*(your\s*)?(toast)/.test(m))
      return`All toast options:\nClassic Avo Toast R78 · Smashed Avo & Egg Toast R85 · PB Banana Toast R55 · Feta & Tomato Toast R70 · Honey Ricotta Toast R68 · Salmon Toast R95`;

    // ── SPECIFIC MENU CATEGORIES ───────────────────────────────
    if(/do you (have|sell|serve) coffee|you got coffee/.test(m))
      return`Yes ☕️ We have 12 coffees — from a simple Espresso Shot (R28) to our Morda Signature Latte (R48) and Caramel Macchiato (R55).`;
    if(/do you (have|sell|serve) boba|you got boba/.test(m))
      return`Yes! We have 9 boba teas including the Brown Sugar Boba Latte (R62), Taro Boba (R58), and Matcha Boba (R60). All made with real tapioca pearls.`;
    if(/do you (have|sell|serve) smoothie|you got smoothie/.test(m))
      return`Yes — 8 smoothies, all blended fresh to order. Berry Sunrise (R62), Tropical Glow (R60), and Morda Energy Smoothie (R68) are the favourites.`;
    if(/do you (have|sell|serve) breakfast|you got breakfast/.test(m))
      return`Yes, breakfast from 07:00! Morda Breakfast Plate (R95), Smashed Avo & Egg Toast (R85), French Toast Stack (R88), Omelette Deluxe (R85), and more.`;
    if(/do you (have|sell|serve) pastry|pastries|cake|croissant/.test(m))
      return`Yes — freshly baked daily: Butter Croissants (R32), Chocolate Croissants (R38), Lemon Drizzle Cake (R42), Morda Brownie (R40), and more.`;
    if(/do you (have|sell|serve) (light meal|toastie|panini|wrap|salad)/.test(m))
      return`Yes — Chicken Mayo Toastie (R72), Caprese Panini (R75), Beef Bagel (R90), Chicken Wrap (R88), and Café Salad Bowl (R82).`;
    if(/do you (have|sell|serve) cake|you got cake/.test(m))
      return`Yes! Lemon Drizzle Cake (R42) and Morda Brownie (R40) — both amazing with a coffee ☕️`;

    // ── BEST COFFEE ────────────────────────────────────────────
    if(/(best coffee|top coffee|favourite coffee|most popular coffee|famous coffee)/.test(m))
      return`Our Morda Signature Latte (R48) is the one people keep coming back for — smooth espresso, steamed milk, and a touch of caramel. Iconic ☕️`;
    if(/(best seller|bestseller|most popular|most ordered|top selling)/.test(m))
      return`Our top sellers:\n• ☕ Morda Signature Latte (R48)\n• 🧋 Brown Sugar Boba Latte (R62)\n• 🍞 Smashed Avo & Egg Toast (R85)\n• 🥐 French Toast Stack (R88)\n• 🥤 Berry Sunrise Smoothie (R62)`;

    // ── RECOMMENDATIONS ────────────────────────────────────────
    if(/(recommend|suggest|what should i (get|try|order)|what'?s good|what to order|first time|never been|first visit)/.test(m)){
      if(/coffee|latte|espresso/.test(m))return`Try our Morda Signature Latte (R48) — smooth, creamy, and our most iconic. Or the Caramel Macchiato (R55) if you like it a bit sweeter.`;
      if(/breakfast|morning|early|eat/.test(m))return`For breakfast: Smashed Avo & Egg Toast (R85) is our most ordered. If you want something bigger, go for the Morda Breakfast Plate (R95) or French Toast Stack (R88).`;
      if(/smoothie|fresh|fruit/.test(m))return`Berry Sunrise (R62) is a crowd favourite. If you want something tropical, go for Tropical Glow (R60). Both blended fresh to order.`;
      if(/sweet|dessert|cake/.test(m))return`French Toast Stack (R88) is indulgent and stunning. For something smaller, the Lemon Drizzle Cake (R42) or Morda Brownie (R40) are perfect.`;
      if(/date|romantic|special|anniversary/.test(m))return`For a café date: Morda Signature Latte, French Toast Stack, Berry Sunrise Smoothie, and Lemon Drizzle Cake — a beautiful combination.`;
      if(/study|work|laptop|focus/.test(m))return`Flat White (R44) or Cappuccino (R42) for focus. Or Iced Coffee (R45) if you prefer cold while working. Morda Café has great ambience for it.`;
      if(/kid|child|family/.test(m))return`Smoothies, pastries, French Toast Stack, and light meals are usually popular with kids. Ask our team in-store for the best options for little ones.`;
      return`For coffee: Morda Signature Latte. For breakfast: Smashed Avo & Egg Toast. For something sweet: French Toast Stack or Lemon Drizzle Cake. You really can't go wrong here.`;
    }

    // ── OPENING HOURS ──────────────────────────────────────────
    if(/(what time|opening hour|open hour|when (do you open|are you open)|trading hour|business hour|open till|close at|when (do you close|is closing)|how late|still open|open now|open today|are you open)/.test(m)){
      const d=today();
      if(/sunday/.test(m))return`Yes, we're open Sundays from **08:00 to 15:00**.`;
      if(/saturday/.test(m))return`Yes, we're open Saturdays from **08:00 to 17:00**.`;
      if(/public holiday|ph/.test(m))return`Public holiday trading may vary. Please call +27 11 567 8901 to confirm before visiting.`;
      if(/open today|open now|still open|are you open/.test(m))return`Today is ${d.day} — we're open **${d.hrs}**. Mon–Fri: 07:00–18:00 · Sat: 08:00–17:00 · Sun: 08:00–15:00.\nCall us to confirm: +27 11 567 8901.`;
      if(/close|closing/.test(m))return`We close at **18:00** Mon–Fri, **17:00** Saturday, and **15:00** Sunday.`;
      if(/open|opening|open from/.test(m))return`We open at **07:00** Mon–Fri and **08:00** on weekends.`;
      return`Our hours:\n• **Mon–Fri:** 07:00–18:00\n• **Saturday:** 08:00–17:00\n• **Sunday:** 08:00–15:00\n\nToday (${d.day}) we're open ${d.hrs}.`;
    }

    // ── LOCATION ───────────────────────────────────────────────
    if(/(where are you|where is morda|location|address|where can i find|how do i get|in sandton|send location|find you|directions|how to get there|where exactly)/.test(m)){
      if(/parking|park/.test(m))return`Parking is available at The MARC Lifestyle Centre. Follow the centre's parking signage — there's plenty of space.`;
      if(/gautrain|train|walk/.test(m))return`We're a short walk from Sandton Gautrain Station. Head down Rivonia Road toward The MARC — we're on the ground floor at Shop 12.`;
      if(/which floor|ground floor|level/.test(m))return`We're on the ground floor — Shop 12 inside The MARC Lifestyle Centre, 129 Rivonia Road, Sandton.`;
      return`📍 Shop 12, The MARC Lifestyle Centre\n129 Rivonia Road, Sandton, Johannesburg 2196.\n\nGround floor — easy to find! Parking available at the centre.`;
    }

    // ── CONTACT ────────────────────────────────────────────────
    if(/(contact|call|phone number|your number|email|how do i reach|get in touch|reach you|speak to)/.test(m)){
      if(/email/.test(m))return`Our email is **hello@mordacafe.co.za**.`;
      if(/number|phone|call/.test(m))return`Call us on **+27 11 567 8901**.`;
      if(/whatsapp|wa|wp/.test(m))return`You can reach us on WhatsApp at **+27 11 567 8901**.`;
      return`📞 **+27 11 567 8901**\n📧 **hello@mordacafe.co.za**\n📸 **@mordacafe** on Instagram, Facebook & TikTok`;
    }

    // ── BOOKINGS & EVENTS ──────────────────────────────────────
    if(/(book a table|book for|reservation|reserve|do i need (to book|a reservation)|group booking|large group|table for)/.test(m))
      return`Walk-ins are always welcome! For group bookings, contact us on **+27 11 567 8901** or email **hello@mordacafe.co.za** so we can sort out the space.`;
    if(/(birthday|celebrate|celebration|special occasion|anniversary)/.test(m))
      return`We'd love to make it special! Contact us on +27 11 567 8901 or email hello@mordacafe.co.za to discuss birthday breakfast arrangements or group visits.`;
    if(/(meeting|business meeting|corporate|work session|team meeting)/.test(m))
      return`Morda Café is great for relaxed meetings and coffee catch-ups ☕️ For larger groups, contact us directly to confirm availability and space.`;
    if(/(cater|catering|event food|food for event)/.test(m))
      return`For catering, email **hello@mordacafe.co.za** with your event date, number of guests, and requirements. Our team will get back to you.`;
    if(/(private event|private hire|hire the space|event venue)/.test(m))
      return`Private event options may depend on availability. Contact us on +27 11 567 8901 or email hello@mordacafe.co.za to discuss.`;

    // ── TAKEAWAY & DELIVERY ────────────────────────────────────
    if(/(takeaway|take away|take out|to go|grab and go|take home)/.test(m))
      return`Yes! Everything on our menu can be prepared for takeaway ☕️ Just let us know when you order.`;
    if(/(deliver|delivery|deliver to|door delivery|home delivery)/.test(m))
      return`Delivery options may vary. Contact us on +27 11 567 8901 to confirm what's available today, or use our online ordering on the Menu page.`;
    if(/(uber eats|mr d|mr delivery|order online|online order|order from here)/.test(m))
      return`Online ordering is available on our Menu page — add items to your cart and choose delivery or collection at checkout. You can also call +27 11 567 8901 to place an order.`;
    if(/(collection|collect|pickup|pick up)/.test(m))
      return`Yes, collection is available! Order online on our Menu page, choose "Collection", and we'll have it ready at Shop 12, The MARC, Sandton.`;

    // ── PAYMENT ────────────────────────────────────────────────
    if(/(pay|payment|accept card|accept cash|tap|eft|snap|zapper|how (do i|can i) pay|payment method)/.test(m)){
      if(/cash/.test(m))return`Please confirm with our team in-store as payment options may vary.`;
      return`Payment options may include standard in-store methods. Please confirm with our team directly when ordering: +27 11 567 8901.`;
    }

    // ── DIETARY ────────────────────────────────────────────────
    if(/(vegan|plant.?based|no animal)/.test(m))
      return`Some items may be suitable or adjustable for vegan guests. Please speak to our team before ordering so we can guide you properly on ingredients.`;
    if(/(vegetarian|veggie|no meat)/.test(m))
      return`Vegetarian-friendly options include: Smashed Avo & Egg Toast, Granola Bowl, Caprese Panini, Café Salad Bowl, all pastries, and all smoothies. Ask our team for more guidance in-store.`;
    if(/(gluten|celiac|coeliac|wheat.?free)/.test(m))
      return`Some items may contain gluten. Please speak to our team before ordering so we can confirm safe options for you. Your safety matters to us.`;
    if(/(halaal|halal)/.test(m))
      return`For the most up-to-date halaal status and ingredient details, please contact us directly on +27 11 567 8901 or ask our team in-store.`;
    if(/(dairy.?free|lactose|oat milk|alternative milk|plant milk|soy milk)/.test(m))
      return`Oat milk and other milk alternatives may be available depending on stock. Ask our team in-store or call +27 11 567 8901 to confirm before visiting.`;
    if(/(nut|peanut|tree nut|nut (allergy|free))/.test(m)&&/(allerg|free|safe|contain)/.test(m))
      return`Some items may contain nuts or be prepared near nuts. Please tell our team about your allergy before ordering — we take this seriously.`;
    if(/(allerg|intoleran|dietary restriction|special diet|can i eat)/.test(m))
      return`Please speak to our team directly before ordering. Some items may contain allergens like dairy, gluten, eggs, or nuts, and we want to guide you safely.`;
    if(/(sugar.?free|low sugar|diabetic)/.test(m))
      return`For sugar-free or low-sugar options, please speak to our team in-store. They can advise on the best options for your dietary needs.`;
    if(/(keto|paleo|low carb)/.test(m))
      return`For specific diet plans like keto or low-carb, speak to our team in-store. Items like Smashed Avo & Egg Toast, Omelette Deluxe, or Café Salad Bowl might work — but always check with the team.`;

    // ── FACILITIES ─────────────────────────────────────────────
    if(/(wifi|wi.?fi|internet|wireless connection)/.test(m))
      return`Wi-Fi availability may vary. Ask our team in-store when you arrive and they'll be happy to help.`;
    if(/(work from|laptop|study|remote work|co.?work|office away|study session)/.test(m))
      return`Yes, you're welcome to bring your laptop. Morda Café is warm, comfortable, and great for coffee-fuelled work or study sessions ☕️`;
    if(/(charging|power point|plug point|outlet|plug)/.test(m))
      return`Charging point availability varies by seating area. Ask our team when you arrive and they'll find you a good spot.`;
    if(/(wheelchair|accessible|disability|disabled|access)/.test(m))
      return`For accessibility details, please contact us or check with The MARC Lifestyle Centre before visiting. We want every guest to have a comfortable experience.`;
    if(/(pet|dog|animal|bring my pet)/.test(m))
      return`Pet policies depend on The MARC Lifestyle Centre rules. Please check with us or the centre before bringing a pet.`;
    if(/(baby|pram|stroller|young child|toddler)/.test(m))
      return`Families are welcome at Morda Café! Ask our team in-store about seating arrangements for families with little ones.`;
    if(/(busy|how busy|crowded|peak time|quiet time)/.test(m))
      return`Weekday mornings before 10:00 are usually quieter. Peak times tend to be 11:00–14:00. For the most accurate info, call us on +27 11 567 8901.`;
    if(/(wait|how long|food take|preparation time)/.test(m))
      return`Preparation time depends on your order and how busy the café is. Ask our team in-store for the most accurate wait time.`;

    // ── CUSTOMER SERVICE ───────────────────────────────────────
    if(/(bad experience|complaint|wrong order|disappointed|issue|problem|not happy|unhappy)/.test(m))
      return`We're really sorry to hear that. Please contact us on **+27 11 567 8901** or email **hello@mordacafe.co.za** with the details so our team can assist you properly.`;
    if(/refund/.test(m))
      return`Refund requests are handled by our team directly. Please contact us on +27 11 567 8901 or email hello@mordacafe.co.za with your order details.`;
    if(/(left something|lost|forgot something|left my|find my)/.test(m))
      return`Please call us as soon as possible on **+27 11 567 8901** with a description of the item and when you visited. Our team will check immediately.`;
    if(/(speak to a manager|speak to someone|manager|supervisor|management)/.test(m))
      return`Of course. Please contact our team on **+27 11 567 8901** or email **hello@mordacafe.co.za** and the management team will assist you.`;
    if(/(feedback|suggestion|review|google review|leave a review)/.test(m))
      return`We love hearing from you! Send feedback to **hello@mordacafe.co.za** or call **+27 11 567 8901**. You can also tag us **@mordacafe** and leave a Google review — it means a lot to us.`;
    if(/(rude|bad service|staff|attitude)/.test(m))
      return`We're sorry if our service fell short. Please share the details with us at **hello@mordacafe.co.za** or call **+27 11 567 8901** so our team can address it properly.`;

    // ── RUDE CUSTOMERS ─────────────────────────────────────────
    if(/(useless|stupid|idiot|terrible|rubbish|trash|awful|waste of time|you suck)/.test(m))
      return`I'm sorry I couldn't help the way you expected. For direct support, please contact the Morda Café team on +27 11 567 8901 or hello@mordacafe.co.za.`;

    // ── SPECIALS ───────────────────────────────────────────────
    if(/(special|specials|promotion|deal|discount|offer|sale|loyalty|loyalty card)/.test(m))
      return`Specials and promotions change from time to time. Check in-store, follow **@mordacafe** on Instagram, or call +27 11 567 8901 for the latest.`;
    if(/(student discount|student deal)/.test(m))
      return`Student discounts may vary. Please ask our team in-store or contact us to confirm any current student offers.`;

    // ── QUALITY ────────────────────────────────────────────────
    if(/(is your coffee good|coffee quality|how'?s the coffee|taste like|is it good)/.test(m))
      return`Our coffee is genuinely excellent — we focus on quality beans, precise espresso, and a premium café experience. The Morda Signature Latte is the perfect place to start ☕️`;
    if(/(fresh|freshly made|freshly baked|made fresh)/.test(m))
      return`Everything at Morda Café is made fresh — pastries baked daily, smoothies blended to order, and breakfast plates prepared fresh for each guest.`;

    // ── SOCIAL MEDIA ───────────────────────────────────────────
    if(/(instagram|facebook|tiktok|social media|follow|socials|ig|fb)/.test(m))
      return`Follow us **@mordacafe** on Instagram, Facebook, and TikTok. We post daily specials, café vibes, and behind-the-scenes content ☕️`;
    if(/(tag|tag you|tag us|feature|repost)/.test(m))
      return`Please do! Tag us **@mordacafe** on Instagram, TikTok, or Facebook when you visit. We love sharing our customers' posts ❤️`;
    if(/(influencer|collab|collaboration|content creator|ugc)/.test(m))
      return`For influencer collaborations, email **hello@mordacafe.co.za** with your profile, audience details, and proposal. Our team will review and get back to you.`;

    // ── JOBS & BUSINESS ────────────────────────────────────────
    if(/(hiring|job|work for|employment|career|apply|vacancy|join the team|barista job|chef|waitron)/.test(m))
      return`Interested in joining Morda Café? Email your CV to **hello@mordacafe.co.za**. If positions are available, our team will be in touch.`;
    if(/(partner|partnership|business deal|collaborate)/.test(m)&&!/influencer/.test(m))
      return`For business partnerships and enquiries, email **hello@mordacafe.co.za** with your proposal and details. We'll get back to you.`;
    if(/(supply|supplier|vendor|provide products|wholesale|stock us)/.test(m))
      return`Supplier enquiries welcome! Email **hello@mordacafe.co.za** with your company details, product list, and contact info.`;

    // ── FOUNDER / ABOUT ────────────────────────────────────────
    if(/(who own|who found|who started|who built|who is kabelo|owner|founder|behind morda)/.test(m)){
      if(/kabelo/.test(m))return`Kabelo Maseko is the founder of Morda Café — a barista, entrepreneur, and visionary who opened Morda in 2023 with a passion for craft coffee and warm hospitality.`;
      return`Morda Café was founded by **Kabelo Maseko** in 2023 — a barista, entrepreneur, and visionary from Johannesburg.`;
    }
    if(/(about morda|what is morda|tell me about morda|history of morda|morda café story)/.test(m))
      return`Morda Café is a premium modern café in Sandton, Johannesburg, founded in 2023 by Kabelo Maseko. We serve craft coffee, handcrafted boba, fresh smoothies, breakfast, pastries, and light meals — all in a warm, elegant space at The MARC on Rivonia Road.`;

    // ── MAPHAKE ────────────────────────────────────────────────
    if(/(maphake|who built this|who made this ai|who programmed|automation|chatbot built|who made you)/.test(m))
      return`I'm powered by **Maphake Automation** ⚡ — an AI automation agency based in Johannesburg. Visit **maphakeautomation.co.za** to learn more!`;

    // ── JOKES ─────────────────────────────────────────────────
    if(/(tell me a joke|joke|funny|make me laugh|make me smile)/.test(m))
      return`Here's a café one: Why did the coffee file a police report? It got mugged ☕️`;

    // ── RATINGS ────────────────────────────────────────────────
    if(/(rating|review|star|rated|google review|what do people say|reputation)/.test(m))
      return`We're rated **4.8⭐ out of 5** from 247+ verified reviews. Coffee quality: 4.9/5 · Service: 4.9/5 · Atmosphere: 4.8/5. Check our Ratings page to read what customers say!`;

    // ── OFF-TOPIC ──────────────────────────────────────────────
    if(/(homework|school|politics|relationship|news|weather|sport|soccer|football|crypto|stock|invest|coding|programming)/.test(m))
      return`I'm here specifically for Morda Café questions — menu, prices, hours, location, bookings, and customer support. For that, I'm your person ☕️`;

    // ── DEFAULT ────────────────────────────────────────────────
    return`Not sure I got that one — but our team definitely will!\n📞 **+27 11 567 8901**\n📧 **hello@mordacafe.co.za**\n\nIs there anything else I can help you with about Morda Café? ☕️`;
  }

  // ── CHAT UI ──────────────────────────────────────────────────
  toggle.addEventListener('click',()=>{open=!open;panel.classList.toggle('open',open);if(open)input.focus();});
  closeBtn?.addEventListener('click',()=>{open=false;panel.classList.remove('open');});
  const fmt=t=>t.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
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
    const delay=text.length<15?380:550+Math.random()*250;
    setTimeout(()=>{dot.remove();addMsg(reply(text),'bot');},delay);
  }
  sendBtn.addEventListener('click',send);
  input.addEventListener('keydown',e=>{if(e.key==='Enter')send();});
})();
