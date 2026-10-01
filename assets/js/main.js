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

  /* línea del tiempo: la luz avanza (2002 → 2026) a medida que se baja por la página */
  var tl=document.getElementById('tl');
  if(tl&&tl.classList.contains('tl2')){
    var hitos=[].slice.call(tl.querySelectorAll('.tl2-it')),hz=tl.classList.contains('h');
    var tlTick=function(){
      var r=tl.getBoundingClientRect(),linea=innerHeight*(hz?.6:.55),p,ult=-1;
      hitos.forEach(function(h,i){
        var hr=h.getBoundingClientRect(),y=hz?(hr.top+(i*hr.height*.9)):(hr.top+24);
        var ok=reduce||y<=linea; h.classList.toggle('lit',ok); if(ok)ult=i;
      });
      if(reduce){p=1;}
      else if(hz){p=ult<0?0:ult/(hitos.length-1);}
      else{p=Math.max(0,Math.min(1,(linea-r.top-14)/(r.height-28)));}
      tl.style.setProperty('--p',p.toFixed(3));
    };
    addEventListener('scroll',tlTick,{passive:true});addEventListener('resize',tlTick);tlTick();
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
