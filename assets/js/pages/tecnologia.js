/* Tecnología · pestañas accesibles (clic, flechas, Inicio y Fin) */
(function(){
  var tabs=[].slice.call(document.querySelectorAll('[role="tab"]'));if(!tabs.length)return;
  function abrir(t,foco){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});
    if(foco)t.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){abrir(t)});
    t.addEventListener('keydown',function(e){
      var n={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1}[e.key];
      if(n===undefined)return;e.preventDefault();abrir(tabs[(n+tabs.length)%tabs.length],true);
    });
  });
})();
