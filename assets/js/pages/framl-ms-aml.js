/* FRAML-MS AML · RISKTECH S.A.S. · animaciones e interacciones propias de la página */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function dots(n){return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}

  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('on')}); t.classList.add('on');
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
    document.getElementById(t.dataset.t).classList.add('on','in');
  });});

  /* heat map */
  var heat=document.getElementById('heat');
  var hc=['#2FBF85','#F5B841','#FF8A3D','#FF6554'];
  var lvl=function(p,i){var s=p*i; return s>=15?3:s>=8?2:s>=4?1:0};
  var marks={'5-4':'R1','4-3':'R4','3-4':'R2','2-2':'R3','3-2':'R5','1-3':'R6'};
  for(var p=5;p>=1;p--){ var ax=document.createElement('div'); ax.className='ax'; ax.textContent=p; heat.appendChild(ax);
    for(var i=1;i<=5;i++){ var c=document.createElement('div'); c.className='cell'; c.style.background=hc[lvl(p,i)]; c.style.opacity=.85; var k=p+'-'+i; if(marks[k]){c.innerHTML='<b>'+marks[k]+'</b>';} heat.appendChild(c);} }
  heat.appendChild(document.createElement('div'));
  for(var j=1;j<=5;j++){ var a=document.createElement('div'); a.className='ax'; a.textContent=j; heat.appendChild(a); }

  /* segmentation scatter */
  var NS='http://www.w3.org/2000/svg';
  function el(tag,attrs){var e=document.createElementNS(NS,tag); for(var k in attrs)e.setAttribute(k,attrs[k]); return e;}
  var seg=document.getElementById('seg');
  var groups=[[90,80,'#63AEFF','Segmento A'],[250,70,'#2FBF85','Segmento B'],[170,180,'#F5B841','Segmento C'],[320,170,'#BFDDFF','Segmento D']];
  var seed=7; function rnd(){seed=(seed*9301+49297)%233280; return seed/233280;}
  groups.forEach(function(g){ seg.appendChild(el('circle',{cx:g[0],cy:g[1],r:48,fill:g[2],opacity:.08}));
    for(var k=0;k<22;k++){ var a=rnd()*6.28, r=rnd()*38; seg.appendChild(el('circle',{cx:g[0]+Math.cos(a)*r,cy:g[1]+Math.sin(a)*r*0.8,r:3.4,fill:g[2],opacity:.9})); }
    var t=el('text',{x:g[0],y:g[1]-52,'text-anchor':'middle',fill:'#9FB3CB','font-size':10,'font-family':'Poppins,sans-serif'}); t.textContent=g[3]; seg.appendChild(t); });
  [[180,40],[380,90],[40,200],[260,235]].forEach(function(o,i){ seg.appendChild(el('circle',{cx:o[0],cy:o[1],r:6,'class':'pulse',style:'fill:none;stroke:#FF6554;stroke-width:2;transform-origin:center;transform-box:fill-box;animation:rp 2s infinite;animation-delay:'+(i*.4)+'s'})); seg.appendChild(el('circle',{cx:o[0],cy:o[1],r:5,fill:'#FF6554'})); });

  /* live feed */
  var feed=document.getElementById('feed');
  var sigs=[['coins','Fraccionamiento efectivo',1],['repeat','Paso de fondos 24h',1],['users','Múltiples ordenantes',1],['flag','Operación cliente PEP',0],['globe','Jurisdicción de riesgo',1],['search','Coincidencia en listas',1],['card','Transferencia nacional',0],['bank','Consignación sucursal',0],['send','Giro internacional',0],['idcard','Actualización de datos',0]];
  var ev=312480, al=24, ros=3, n=0;
  function addRow(){
    n++;
    var pick = (n%3===0) ? sigs[Math.floor(Math.random()*6)] : sigs[6+Math.floor(Math.random()*4)];
    var score = pick[2] ? (n%3===0? 82+Math.floor(Math.random()*16): 60+Math.floor(Math.random()*18)) : (pick[0]==='flag'? 62+Math.floor(Math.random()*12) : 5+Math.floor(Math.random()*40));
    var d=new Date(), hh=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);
    var cls = score>80?'al':(score>55?'rw':'ok'), lab = score>80?'SEÑAL LA/FT':(score>55?'REVISIÓN':'NORMAL');
    var col = score>80?'var(--coral)':(score>55?'#F5B841':'var(--green)');
    var r=document.createElement('div'); r.className='row'+(score>80?' al':'');
    r.innerHTML='<span style="color:#8FA3BB;font-size:11px">'+hh+'</span><span class="ch"><svg aria-hidden="true" class="i"><use href="#'+pick[0]+'"/></svg>'+pick[1]+'</span><span class="sc"><span class="bar"><i style="width:'+score+'%;background:'+col+'"></i></span></span><span class="tag '+cls+'">'+lab+'</span>';
    feed.insertBefore(r,feed.firstChild);
    while(feed.children.length>7) feed.removeChild(feed.lastChild);
    ev+=Math.floor(Math.random()*9)+1; document.getElementById('k-ev').textContent=dots(ev);
    if(score>80){ al++; document.getElementById('k-al').textContent=al; if(Math.random()>.7){ros++;document.getElementById('k-bl').textContent=ros;} }
  }
  for(var i=0;i<6;i++) addRow();
  if(!reduce) setInterval(addRow,1600);

  /* chat */
  var chat=document.getElementById('chat'), typ=document.getElementById('chat-typing');
  var convo=[
    ['¿Qué cuentas presentan comportamiento de cuenta mula?','Prioricé <b>7 cuentas</b>: recibieron fondos de 23 ordenantes sin relación y los dispersaron en menos de 24 horas. Tres comparten dispositivo. Todas tienen menos de 90 días de apertura. Recomiendo <b>escalar el caso</b>.'],
    ['¿Qué clientes PEP tuvieron operaciones inusuales este mes?','<b>4 clientes PEP</b> superaron su perfil transaccional. El caso más relevante registra un incremento de <b>312%</b> frente a su promedio y giros a 2 jurisdicciones de riesgo.'],
    ['Resume el caso 2026-0147 para el comité','Red de dispersión con <b>$186 M</b> movilizados en 5 días a través de 7 cuentas y 5 identidades. Señales: paso de fondos, fraccionamiento y dispositivo compartido. Soportes listos para evaluar el <b>ROS</b>.'],
    ['¿Qué regla LA/FT debería calibrar?','La tipología <b>“Múltiples ordenantes”</b> genera muchas alertas con baja escalación a ROS. Sugiero segmentarla por actividad económica y validar el ajuste antes de producción.']
  ];
  var ci=0;
  function say(cls,html){ var m=document.createElement('div'); m.className='msg '+cls; m.innerHTML=html; chat.appendChild(m); while(chat.children.length>5) chat.removeChild(chat.firstChild); return m; }
  function typeInto(text,cb){ var i=0; typ.style.color='#fff'; (function t(){ typ.textContent=text.slice(0,++i); if(i<text.length) setTimeout(t,30); else setTimeout(cb,350); })(); }
  function runChat(){
    var q=convo[ci%convo.length]; ci++;
    typeInto(q[0],function(){
      typ.textContent='Pregúntale algo a Cerebrito…'; typ.style.color='';
      say('u',q[0]);
      var t=say('b','<span class="typing"><i></i><i></i><i></i></span>');
      setTimeout(function(){ t.innerHTML=q[1]; setTimeout(runChat,4800); },1400);
    });
  }
  if(reduce){ convo.slice(0,2).forEach(function(q){say('u',q[0]);say('b',q[1]);}); }
  else { var cio=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ runChat(); cio.disconnect(); } },{threshold:.3}); cio.observe(chat); }

  /* mule network: origins -> mules -> dispersion */
  var svg=document.getElementById('net');
  var nodes=[
    {id:'o1',x:30,y:40,t:'ord'},{id:'o2',x:22,y:100,t:'ord'},{id:'o3',x:30,y:165,t:'ord'},{id:'o4',x:22,y:230,t:'ord'},{id:'o5',x:34,y:290,t:'ord'},
    {id:'m1',x:150,y:80,t:'mule',l:'Cuenta mula'},{id:'m2',x:160,y:175,t:'mule'},{id:'m3',x:150,y:268,t:'mule'},
    {id:'dv',x:235,y:175,t:'dev',l:'Dispositivo compartido'},
    {id:'b1',x:320,y:70,t:'mule'},{id:'b2',x:330,y:280,t:'mule'},
    {id:'x1',x:430,y:45,t:'out',l:'Retiro efectivo'},{id:'x2',x:430,y:175,t:'out',l:'Giro exterior'},{id:'x3',x:425,y:300,t:'out',l:'Cripto / exchange'}
  ];
  var edges=[['o1','m1'],['o2','m1'],['o2','m2'],['o3','m2'],['o4','m3'],['o5','m3'],['o3','m1'],['m1','dv',2],['m2','dv',2],['m3','dv',2],['m1','b1',1],['m2','b1',1],['m2','b2',1],['m3','b2',1],['b1','x1',1],['b1','x2',1],['b2','x2',1],['b2','x3',1]];
  var byId={}; nodes.forEach(function(n){byId[n.id]=n});
  edges.forEach(function(e){ var a=byId[e[0]],b=byId[e[1]]; svg.appendChild(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,'class':'edge'+(e[2]===1?' hot':''),style:e[2]===2?'stroke:#F5B841;stroke-dasharray:3 4':''})); });
  var colors={ord:'#63AEFF',mule:'#FF6554',dev:'#F5B841',out:'#FF8577'}, rad={ord:8,mule:13,dev:15,out:11};
  nodes.forEach(function(n,i){
    var g=el('g',{});
    if(n.t==='mule'||n.t==='dev'){ g.appendChild(el('circle',{cx:n.x,cy:n.y,r:rad[n.t],'class':'pulse',style:'animation-delay:'+(i*0.25)+'s'})); }
    g.appendChild(el('circle',{cx:n.x,cy:n.y,r:rad[n.t],fill:colors[n.t],stroke:'#001629','stroke-width':3}));
    if(n.l){ var tx=el('text',{x:n.x,y:n.y+rad[n.t]+15,'text-anchor':n.t==='out'?'end':'middle',fill:'#DCE6F2','font-size':10.5,'font-weight':600,'font-family':'Poppins,sans-serif'}); if(n.t==='out'){tx.setAttribute('x',n.x+8);} tx.textContent=n.l; g.appendChild(tx); }
    svg.appendChild(g);
  });
  [['Ordenantes',0,'start'],['Cuentas puente',150,'middle'],['Dispersión',340,'middle']].forEach(function(h){ var t=el('text',{x:h[1],y:14,'text-anchor':h[2],fill:'#8FA3BB','font-size':10.5,'letter-spacing':'1','font-family':'Poppins,sans-serif'}); t.textContent=h[0].toUpperCase(); svg.appendChild(t); });

  /* case file cascade */
  var steps=[].slice.call(document.querySelectorAll('#cascade .cs'));
  var items=[].slice.call(document.querySelectorAll('#case .ci'));
  var stepFor=[0,1,1,1,2,3]; var frame=0;
  function tick(){
    var s=frame%8;
    if(s===0) items.forEach(function(x){x.classList.remove('show')});
    if(s<items.length) items[s].classList.add('show');
    var cur=stepFor[Math.min(s,items.length-1)];
    steps.forEach(function(x,i){ x.classList.remove('on','done'); if(i<cur)x.classList.add('done'); if(i===cur)x.classList.add('on'); });
    frame++;
  }
  if(reduce){ items.forEach(function(x){x.classList.add('show')}); steps.forEach(function(x){x.classList.add('done')}); }
  else { var started=false; var cio2=new IntersectionObserver(function(es){ if(es[0].isIntersecting && !started){ started=true; tick(); setInterval(tick,1600);} },{threshold:.3}); cio2.observe(document.getElementById('case')); }
})();
