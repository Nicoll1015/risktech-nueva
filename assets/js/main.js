/* RiskTech · comportamiento compartido por todas las páginas
   - Menú fijo (se vuelve sólido al bajar), botón flotante
   - Desplegables del menú (hover en escritorio, clic/teclado en táctil)
   - Menú móvil
   - Animación de entrada (.rv) y contadores (.cnt) */
(function(){
  /* Abierto con doble clic (file://): el navegador no abre solo el index.html de una carpeta,
     así que a los enlaces internos que terminan en "/" se les agrega "index.html".
     En el servidor (http/https) no se toca nada y las URLs quedan limpias. */
  if(location.protocol==='file:'){
    document.querySelectorAll('a[href]').forEach(function(a){
      var h=a.getAttribute('href');
      if(/^([a-z]+:|#|\/\/)/i.test(h))return;
      var m=h.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);if(!m)return;
      var p=m[1];
      if(p===''||p==='.'||/\/$/.test(p))a.setAttribute('href',(p===''||p==='.'?'./':p)+'index.html'+(m[2]||'')+(m[3]||''));
    });
  }

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement;
  var nav=document.getElementById('nav'),waf=document.getElementById('waf');

  function onScroll(){
    var y=scrollY;
    if(nav)nav.classList.toggle('solid',y>30);
    if(waf)waf.classList.toggle('show',y>innerHeight*.9);
  }
  function onResize(){if(nav)root.style.setProperty('--nav-h',(nav.classList.contains('solid')?nav.offsetHeight:62)+'px');}
  addEventListener('scroll',function(){onScroll();onResize();},{passive:true});
  addEventListener('resize',onResize);
  onScroll();onResize();

  /* desplegables del menú */
  var drops=[].slice.call(document.querySelectorAll('.menu .has-drop'));
  function closeAll(except){drops.forEach(function(d){if(d!==except){d.classList.remove('open');d.querySelector('button').setAttribute('aria-expanded','false');}});}
  drops.forEach(function(d){
    var b=d.querySelector('button');
    b.addEventListener('click',function(e){e.stopPropagation();var o=!d.classList.contains('open');closeAll(d);d.classList.toggle('open',o);b.setAttribute('aria-expanded',o);});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){d.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus();}});
    d.addEventListener('focusout',function(e){if(!d.contains(e.relatedTarget)){d.classList.remove('open');b.setAttribute('aria-expanded','false');}});
  });
  document.addEventListener('click',function(){closeAll()});

  /* menú móvil */
  var mnav=document.getElementById('mnav'),burger=document.getElementById('burger');
  if(mnav&&burger){
    function setM(o){mnav.classList.toggle('open',o);burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':'';}
    burger.onclick=function(){setM(true)};
    document.getElementById('mclose').onclick=function(){setM(false)};
    mnav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setM(false)})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')setM(false)});
  }

  /* línea del tiempo: al aparecer en pantalla, la luz recorre los hitos uno por uno (2002 → 2026); se repite si se sale y se vuelve */
  var tl=document.getElementById('tl');
  if(tl&&tl.classList.contains('tl2')){
    var hitos=[].slice.call(tl.querySelectorAll('.tl2-it')),hz=tl.classList.contains('h'),PASO=750,tlTimers=[];
    var hastaHito=function(i){
      var r=tl.getBoundingClientRect(),d=hitos[i].querySelector('.tl2-dot').getBoundingClientRect();
      var p=hz?(d.left+d.width/2-r.left-14)/(r.width-28):(d.top+d.height/2-r.top-14)/(r.height-28);
      return Math.max(0,Math.min(1,i===hitos.length-1?1:p));
    };
    var jugando=false;
    var tlReset=function(){tlTimers.forEach(clearTimeout);tlTimers=[];hitos.forEach(function(h){h.classList.remove('lit')});tl.style.setProperty('--p',0);};
    var tlPlay=function(){
      tlReset();
      hitos.forEach(function(h,i){
        tlTimers.push(setTimeout(function(){tl.style.setProperty('--p',hastaHito(i).toFixed(3));},i*PASO));
        tlTimers.push(setTimeout(function(){h.classList.add('lit');},i*PASO+(i?PASO*.75:150)));
      });
    };
    tl.style.setProperty('--tl-paso',PASO*.75+'ms');
    if(reduce||!('IntersectionObserver' in window)){hitos.forEach(function(h){h.classList.add('lit')});tl.style.setProperty('--p',1);}
    else{
      new IntersectionObserver(function(es){es.forEach(function(e){
        /* corre una sola vez y, al llegar al final, queda toda encendida */
        if(e.isIntersecting&&!jugando){jugando=true;tlPlay();}
      });},{rootMargin:'0px 0px -30% 0px'}).observe(tl);
    }
  }

  var celular=window.matchMedia?window.matchMedia('(max-width:720px)'):{matches:false,addEventListener:function(){}};
  var onMq=function(fn){if(celular.addEventListener)celular.addEventListener('change',fn);else if(celular.addListener)celular.addListener(fn);};

  /* pestañas → acordeón en el celular: cada contenido se muestra justo debajo de su pestaña */
  [].forEach.call(document.querySelectorAll('.tabs,.stabs'),function(box){
    var btns=[].filter.call(box.children,function(b){return b.tagName==='BUTTON'});
    var pares=btns.map(function(b){
      var id=b.getAttribute('data-t')||b.getAttribute('data-s')||b.getAttribute('aria-controls');
      var p=id&&document.getElementById(id);if(!p)return null;
      var marca=document.createComment('panel '+id);p.parentNode.insertBefore(marca,p);
      return {b:b,p:p,marca:marca};
    }).filter(Boolean);
    if(pares.length<2)return;
    var rol=box.getAttribute('role');
    function aplicar(){
      var on=celular.matches;box.classList.toggle('acc',on);
      if(on){if(rol)box.removeAttribute('role');pares.forEach(function(x){x.b.parentNode.insertBefore(x.p,x.b.nextSibling)});}
      else{if(rol)box.setAttribute('role',rol);pares.forEach(function(x){x.marca.parentNode.insertBefore(x.p,x.marca.nextSibling)});}
    }
    pares.forEach(function(x){x.b.addEventListener('click',function(){
      if(!box.classList.contains('acc'))return;
      setTimeout(function(){var t=x.b.getBoundingClientRect().top,h=(nav?nav.offsetHeight:62)+12;if(t<h||t>innerHeight*.6)scrollTo({top:scrollY+t-h,behavior:reduce?'auto':'smooth'});},30);
    })});
    aplicar();onMq(aplicar);
  });

  /* carrusel del equipo (Nosotros) en el celular: avanza solo; si la persona lo desliza, espera antes de seguir */
  var leads=document.querySelector('.leads');
  if(leads&&!reduce&&'IntersectionObserver' in window){
    var lVis=false,lPausa=0;
    ['touchstart','pointerdown','wheel'].forEach(function(ev){leads.addEventListener(ev,function(){lPausa=Date.now()+8000},{passive:true})});
    new IntersectionObserver(function(es){lVis=es[0].isIntersecting},{threshold:.5}).observe(leads);
    setInterval(function(){
      if(!celular.matches||!lVis||Date.now()<lPausa)return;
      var c=leads.querySelector('.leader');if(!c)return;
      var w=c.getBoundingClientRect().width+parseFloat(getComputedStyle(leads).columnGap||14);
      var fin=leads.scrollLeft+leads.clientWidth>=leads.scrollWidth-4;
      leads.scrollTo({left:fin?0:leads.scrollLeft+w,behavior:'smooth'});
    },3000);
  }

  /* contadores + animación de entrada */
  function fmt(n,dec,sep){var s=dec?n.toFixed(dec).replace('.',','):Math.round(n).toString();return sep?s.replace(/\B(?=(\d{3})+(?!\d))/g,'.'):s;}
  function count(el){var to=parseFloat(el.dataset.to),dec=+(el.dataset.dec||0),sep=el.dataset.sep,t0=null;
    if(reduce){el.textContent=fmt(to,dec,sep);return;}
    (function step(t){if(!t0)t0=t;var p=Math.min((t-t0)/1700,1);el.textContent=fmt(to*(1-Math.pow(1-p,3)),dec,sep);if(p<1)requestAnimationFrame(step);})(performance.now());}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
    // las cifras se animan cada vez que entran en pantalla (no solo la primera vez)
    var co=new IntersectionObserver(function(es){es.forEach(function(e){var c=e.target;
      if(e.isIntersecting){if(!c.running){c.running=1;count(c);}}else{c.running=0;if(!reduce)c.textContent=fmt(0,+(c.dataset.dec||0),c.dataset.sep);}
    })},{threshold:.6});
    document.querySelectorAll('.cnt').forEach(function(c){co.observe(c)});
  }else{
    document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')});
    document.querySelectorAll('.cnt').forEach(function(c){c.textContent=fmt(parseFloat(c.dataset.to),+(c.dataset.dec||0),c.dataset.sep)});
  }
})();

/* video de YouTube: el reproductor (sin cookies hasta que se usa) se carga solo al darle play */
(function(){
  [].forEach.call(document.querySelectorAll('.video[data-yt]'),function(v){
    var id=v.getAttribute('data-yt'), btn=v.querySelector('.video-play'); if(!id||!btn)return;
    btn.addEventListener('click',function(){
      /* abierto desde la carpeta (file://): YouTube no reproduce sin dirección web (error 153). Solo pasa en pruebas locales */
      if(location.protocol==='file:'){
        btn.outerHTML='<p class="video-local">Para ver el video aquí, abre el sitio con <b>«Abrir sitio»</b> (doble clic en la carpeta PAG NUEVA VERSIÓN RT). Publicado en risktech.com.co se reproduce sin problema.</p>';
        return;
      }
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0&playsinline=1&origin='+encodeURIComponent(location.origin);
      f.title=v.getAttribute('data-title')||'Video de RiskTech';
      f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
      f.referrerPolicy='strict-origin-when-cross-origin';
      f.allowFullscreen=true;
      v.innerHTML=''; v.appendChild(f); f.focus();
    });
  });
})();
