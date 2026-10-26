/* Identity Defense · animación de la verificación en el celular y de los cinco pasos (como la cascada de FRAML Alert Defense) */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var phone=document.getElementById('idv');
  if(!phone) return;
  var items=[].slice.call(phone.querySelectorAll('[data-s]'));
  var steps=[].slice.call(document.querySelectorAll('#cascade .cs'));
  /* paso del celular -> paso de la cascada: documento 2, vida y rostro 3, listas y red 4, resultado 5 */
  var stepMap=[1,2,2,3,3,4];

  function fin(){
    items.forEach(function(x){ x.classList.remove('on'); x.classList.add('show'); });
    steps.forEach(function(x){ x.classList.remove('on'); x.classList.add('done'); });
  }
  if(reduce){ fin(); return; }

  /* recorre la verificación una sola vez y deja todo encendido al final */
  var i=0;
  function tick(){
    if(i>0) { items[i-1].classList.remove('on'); items[i-1].classList.add('show'); }
    if(i>=items.length){ setTimeout(fin,600); return; }
    items[i].classList.add('on');
    var cur=stepMap[i];
    steps.forEach(function(x,k){ x.classList.remove('on','done'); if(k<cur)x.classList.add('done'); if(k===cur)x.classList.add('on'); });
    i++;
    setTimeout(tick,i===2?1300:850);
  }
  var started=false;
  var io=new IntersectionObserver(function(es){
    if(started || !es.some(function(e){return e.isIntersecting})) return;
    started=true; setTimeout(tick,300);
  },{threshold:.1});
  io.observe(phone);
})();
