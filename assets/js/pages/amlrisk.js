/* AMLRISK · RISKTECH S.A.S. · animaciones e interacciones propias de la página */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('on')}); t.classList.add('on');
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
    document.getElementById(t.dataset.t).classList.add('on','in');
  });});

  /* hero search simulation (fictitious names) */
  var qEl=document.getElementById('q'), res=document.getElementById('results'), qid=document.getElementById('qid'), qt=document.getElementById('qtime');
  var scenarios=[
    {q:'Comercializadora Del Norte S.A.S.', r:[['Sin coincidencias','OFAC · ONU · Unión Europea · PEPs','—','LIMPIO','ok']]},
    {q:'Carlos Andrés Rivera Montoya', r:[['Carlos Andrés Rivera Montoya','Lista OFAC · SDN','98%','COINCIDE','al'],['Carlos Rivera M.','Lista ONU · Consejo de Seguridad','91%','REVISAR','rw'],['Carlos Andrés Rivera Mora','Homónimo descartado','64%','HOMÓNIMO','ok hom']]},
    {q:'Laura Marcela Gómez Pardo', r:[['Laura Marcela Gómez Pardo','PEP nacional · Cargo público','100%','PEP','rw'],['Noticias relacionadas','News Online · sin hallazgos LA/FT','—','INFO','ok']]},
    {q:'900.482.117-3', r:[['Sin coincidencias','+3.000 fuentes consultadas','—','LIMPIO','ok']]}
  ];
  var si=0, idn=184320;
  function renderRes(list){
    res.innerHTML='';
    list.forEach(function(x,i){
      var d=document.createElement('div'); var cls=x[4];
      d.className='res'+(cls==='al'?' hit':'')+(cls.indexOf('hom')>-1?' hom':'');
      d.style.animationDelay=(i*0.12)+'s';
      var col=cls==='al'?'var(--coral-2)':(cls==='rw'?'#F5C66B':'#6EE7B7');
      d.innerHTML='<div class="nm"><b>'+x[0]+'</b><small>'+x[1]+'</small></div><div class="pc" style="color:'+col+'">'+x[2]+'</div><span class="tag '+cls.split(' ')[0]+'">'+x[3]+'</span>';
      res.appendChild(d);
    });
  }
  function run(){
    var s=scenarios[si%scenarios.length]; si++; idn+=Math.floor(Math.random()*20)+3;
    qEl.textContent=''; qt.textContent='Buscando…';
    res.innerHTML='<div class="res-empty"><span class="typing"><i></i><i></i><i></i></span></div>';
    var i=0;(function t(){ qEl.textContent=s.q.slice(0,++i); if(i<s.q.length) setTimeout(t,45); else setTimeout(function(){
      qid.textContent='A-2026-'+idn; qt.textContent=(14+Math.floor(Math.random()*9))+' ms';
      renderRes(s.r); setTimeout(run,4200);
    },450); })();
  }
  if(reduce){ qEl.textContent=scenarios[1].q; renderRes(scenarios[1].r); qt.textContent='18 ms'; } else { run(); }
})();
