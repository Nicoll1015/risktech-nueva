/* FRAML Alert Defense · animación de la cascada WhatsApp → voz (misma del bloque de FRAML MS AntiFraud) */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* alert defense cascade */
  var steps=[].slice.call(document.querySelectorAll('#cascade .cs'));
  var bubs=[].slice.call(document.querySelectorAll('#wa [data-s]'));
  var stepMap=[0,1,1,2,2,2,3,3]; /* frame -> cascade step */
  var frame=0;
  function adTick(){
    var s=frame%9;
    if(s===0){ bubs.forEach(function(b){b.classList.remove('show')}); }
    steps.forEach(function(x,i){ x.classList.remove('on','done'); var cur=stepMap[Math.min(s,7)]; if(i<cur)x.classList.add('done'); if(i===cur)x.classList.add('on'); });
    // bubbles: frame1->b0, 2->sys1, 3->b2, 4->b3, 5->sys4, 6->b5
    var show={1:0,2:1,3:2,4:3,6:4,7:5}; if(show[s]!==undefined) bubs[show[s]].classList.add('show');
    frame++;
  }
  if(reduce){ bubs.forEach(function(b){b.classList.add('show')}); steps.forEach(function(x){x.classList.add('done')}); }
  else {
    /* arranca de una con el primer mensaje, avanza rápido y deja el resultado final más tiempo en pantalla */
    /* recorre los pasos una sola vez, un poco más rápido, y al final queda todo encendido */
    var fin=function(){ bubs.forEach(function(b){b.classList.add('show')}); steps.forEach(function(x){x.classList.remove('on');x.classList.add('done')}); };
    var loop=function(){ adTick(); var s=(frame-1)%9; if(s>=7){ setTimeout(fin,900); return; } setTimeout(loop,700); };
    var started=false; var aio=new IntersectionObserver(function(es){ if(es.some(function(e){return e.isIntersecting}) && !started){ started=true; frame=0; adTick(); setTimeout(loop,150);} },{threshold:.1}); aio.observe(document.getElementById('wa'));var cz=document.getElementById('cascade');if(cz)aio.observe(cz);
  }
})();

