/* RiskTech · consentimiento de cookies (Ley 1581 de 2012 · Consent Mode v2 de Google)
   - Ninguna etiqueta de Google se carga hasta que la persona acepta.
   - La decisión se guarda en la cookie propia y necesaria "rt_consent" (6 meses).
   - En modo PRUEBAS (window.RT_CONFIG.gtm = null) el banner funciona, pero nunca carga etiquetas.
   - La primera vez, el aviso sale en el centro y bloquea la página hasta que la persona elija (salvo en las políticas).
   - La decisión dura 6 meses en ese navegador; después se vuelve a preguntar.
   - "Preferencias de cookies" (footer) vuelve a abrir el banner. */
(function(){
  var CFG=window.RT_CONFIG||{},KEY='rt_consent',MAX=60*60*24*182;
  var box=document.getElementById('consent');if(!box)return;
  var opts=document.getElementById('consent-opts'),ca=document.getElementById('c-analytics'),cm=document.getElementById('c-marketing');
  var bCfg=document.getElementById('c-config'),bSave=document.getElementById('c-save');

  // abierto con doble clic (file://) el navegador no guarda cookies: se usa el almacenamiento local
  var LOCAL=location.protocol==='file:';
  function leer(){try{
    if(LOCAL){var v=localStorage.getItem(KEY);return v?JSON.parse(v):null;}
    var m=document.cookie.match(/(?:^|; )rt_consent=([^;]*)/);return m?JSON.parse(decodeURIComponent(m[1])):null;
  }catch(e){return null}}
  function guardar(c){c.v=1;c.fecha=new Date().toISOString();
    if(LOCAL){try{localStorage.setItem(KEY,JSON.stringify(c))}catch(e){}return;}
    document.cookie=KEY+'='+encodeURIComponent(JSON.stringify(c))+';max-age='+MAX+';path=/;SameSite=Lax'+(location.protocol==='https:'?';Secure':'');}

  var gtmCargado=false;
  function aplicar(c){
    if(!CFG.gtm)return;                       // modo pruebas: nunca se cargan etiquetas
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments)}
    var estado={analytics_storage:c.analytics?'granted':'denied',ad_storage:c.marketing?'granted':'denied',
      ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied'};
    if(!gtmCargado){
      if(!c.analytics&&!c.marketing)return;   // sin consentimiento no se carga GTM
      gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted'});
      gtag('consent','update',estado);
      dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
      var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id='+CFG.gtm;document.head.appendChild(s);
      gtmCargado=true;
    }else{gtag('consent','update',estado);}
  }

  // Bloqueo: el aviso sale en el centro y la página no se puede usar hasta que la persona elija
  // (aceptar, rechazar o configurar). Las políticas no se bloquean, para poder leerlas antes de decidir.
  var LEGAL=/\/politica-de-(cookies|privacidad)\//.test(location.pathname);
  var html=document.documentElement,previo=null;
  function mostrar(){
    var bloquear=!LEGAL;
    box.classList.toggle('block',bloquear);box.setAttribute('aria-modal',bloquear?'true':'false');
    html.classList.toggle('consent-lock',bloquear);box.hidden=false;
    if(bloquear){previo=document.activeElement;document.getElementById('c-accept').focus();}
  }
  // con el bloqueo activo, el foco del teclado no sale del aviso
  box.addEventListener('keydown',function(e){
    if(e.key!=='Tab'||!box.classList.contains('block'))return;
    var f=[].filter.call(box.querySelectorAll('a,button,input:not([disabled])'),function(x){return x.offsetParent!==null});
    if(!f.length)return;var a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}
  });
  function abrir(){var c=leer()||{};ca.checked=!!c.analytics;cm.checked=!!c.marketing;mostrar();}
  function cerrar(c){guardar(c);aplicar(c);box.hidden=true;opts.hidden=true;bSave.hidden=true;bCfg.hidden=false;
    html.classList.remove('consent-lock');box.classList.remove('block');if(previo&&previo.focus)previo.focus();}

  document.getElementById('c-accept').onclick=function(){cerrar({analytics:true,marketing:true})};
  document.getElementById('c-reject').onclick=function(){cerrar({analytics:false,marketing:false})};
  bCfg.onclick=function(){opts.hidden=false;bCfg.hidden=true;bSave.hidden=false;ca.focus();};
  bSave.onclick=function(){cerrar({analytics:ca.checked,marketing:cm.checked})};
  document.querySelectorAll('[data-consent-open]').forEach(function(b){b.addEventListener('click',abrir)});

  // Para pruebas: abrir cualquier página con ?reset-cookies borra la decisión y vuelve a mostrar el aviso.
  if(/[?&]reset-cookies/.test(location.search)){
    try{localStorage.removeItem(KEY)}catch(e){}
    document.cookie=KEY+'=;max-age=0;path=/';
  }
  var c=leer();
  if(c)aplicar(c);else mostrar();
})();
