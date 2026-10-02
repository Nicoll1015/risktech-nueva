/* FRAML MS AntiFraude · RISKTECH S.A.S. · animaciones e interacciones propias de la página */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* tabs */
  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    tabs.forEach(function(x){x.classList.remove('on')}); t.classList.add('on');
    document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('on')});
    var p=document.getElementById(t.dataset.t); p.classList.add('on','in');
  });});

  /* live feed */
  var feed=document.getElementById('feed');
  var chans=[['mobile','App móvil'],['monitor','Portal web'],['card','POS'],['bank','Cajero ATM'],['send','Transferencia'],['link','PSE']];
  var ev=48210, al=37, bl=12, n=0;
  function money(v){return '$'+v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.')}
  function addRow(){
    n++;
    var c=chans[Math.floor(Math.random()*chans.length)];
    var s=Math.random(); var score = (n%5===0)? 86+Math.floor(Math.random()*13) : (s<.2? 55+Math.floor(Math.random()*20) : 5+Math.floor(Math.random()*40));
    var amt = score>80 ? (2+Math.floor(Math.random()*8))*1000000+Math.floor(Math.random()*900)*1000 : (5+Math.floor(Math.random()*900))*1000;
    var d=new Date(), hh=('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
    var cls = score>80?'al':(score>55?'rw':'ok'), lab = score>80?'ALERTA':(score>55?'REVISIÓN':'APROBADA');
    var col = score>80?'var(--coral)':(score>55?'#F5B841':'var(--green)');
    var r=document.createElement('div'); r.className='row'+(score>80?' al':'');
    r.innerHTML='<span style="color:#8FA3BB;font-size:11px">'+hh.slice(0,5)+'</span><span class="ch"><svg aria-hidden="true" class="i"><use href="#'+c[0]+'"/></svg>'+c[1]+'</span><span class="sc"><span class="bar"><i style="width:'+score+'%;background:'+col+'"></i></span></span><span class="tag '+cls+'">'+lab+'</span>';
    r.title=money(amt);
    feed.insertBefore(r,feed.firstChild);
    while(feed.children.length>7) feed.removeChild(feed.lastChild);
    ev+=Math.floor(Math.random()*40)+8; document.getElementById('k-ev').textContent=ev.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.');
    if(score>80){ al++; document.getElementById('k-al').textContent=al; if(Math.random()>.35){bl++;document.getElementById('k-bl').textContent=bl;} }
  }
  for(var i=0;i<6;i++) addRow();
  if(!reduce) setInterval(addRow,1500);

  /* cerebrito chat */
  var chat=document.getElementById('chat'), typ=document.getElementById('chat-typing');
  var convo=[
    ['¿Cuántas alertas se generaron esta semana?','Esta semana se generaron <b>742 alertas</b>, 18% menos que la anterior. El 61% provino de App móvil y la regla con mayor efectividad fue <b>“Cambio de dispositivo + transferencia”</b>.'],
    ['¿Qué dispositivos tienen mayor riesgo en red?','Identifiqué <b>3 dispositivos</b> operando más de 5 identidades distintas en 48 horas. Uno está conectado a 7 cuentas destino externas. Recomiendo <b>aislar la red</b> y revisar el clúster.'],
    ['¿Qué regla debería ajustar?','La regla <b>“Primer IP x encargo”</b> es muy restrictiva: 173 alertas con baja confirmación. Sugiero elevar el umbral y simularla en SandBox antes de desplegar.']
  ];
  var ci=0;
  function say(cls,html){ var m=document.createElement('div'); m.className='msg '+cls; m.innerHTML=html; chat.appendChild(m); while(chat.children.length>6) chat.removeChild(chat.firstChild); return m; }
  function typeInto(text,cb){ var i=0; typ.style.color='#fff'; (function t(){ typ.textContent=text.slice(0,++i); if(i<text.length) setTimeout(t,32); else setTimeout(cb,350); })(); }
  function runChat(){
    var q=convo[ci%convo.length]; ci++;
    typeInto(q[0],function(){
      typ.textContent='Pregúntale algo a Cerebrito…'; typ.style.color='';
      say('u',q[0]);
      var t=say('b','<span class="typing"><i></i><i></i><i></i></span>');
      setTimeout(function(){ t.innerHTML=q[1]; setTimeout(runChat,4200); },1400);
    });
  }
  if(reduce){ convo.forEach(function(q){say('u',q[0]);say('b',q[1]);}); }
  else { var cio=new IntersectionObserver(function(es){ if(es[0].isIntersecting){ runChat(); cio.disconnect(); } },{threshold:.3}); cio.observe(chat); }

  /* network graph */
  var svg=document.getElementById('net'), NS='http://www.w3.org/2000/svg';
  var nodes=[
    {id:'D',x:230,y:170,r:20,t:'dev',l:'Dispositivo X-01'},
    {id:'a1',x:120,y:80,r:11,t:'acc'},{id:'a2',x:95,y:180,r:11,t:'acc'},{id:'a3',x:130,y:270,r:11,t:'acc'},{id:'a4',x:230,y:50,r:11,t:'acc'},{id:'a5',x:230,y:295,r:11,t:'acc'},
    {id:'ip',x:340,y:95,r:13,t:'ip',l:'IP · VPN'},
    {id:'e1',x:380,y:200,r:12,t:'ext'},{id:'e2',x:345,y:285,r:12,t:'ext'},{id:'e3',x:420,y:130,r:10,t:'ext'},
    {id:'n1',x:40,y:60,r:8,t:'ok'},{id:'n2',x:35,y:250,r:8,t:'ok'},{id:'n3',x:420,y:300,r:8,t:'ok'},{id:'n4',x:300,y:20,r:8,t:'ok'}
  ];
  var edges=[['D','a1',1],['D','a2',1],['D','a3',1],['D','a4',1],['D','a5',1],['D','ip',1],['ip','e3',0],['a1','e1',1],['a3','e2',1],['a4','ip',0],['a5','e2',1],['a2','e1',1],['a1','n1',0],['a3','n2',0],['e2','n3',0],['a4','n4',0]];
  var byId={}; nodes.forEach(function(n){byId[n.id]=n});
  function el(tag,attrs){var e=document.createElementNS(NS,tag); for(var k in attrs)e.setAttribute(k,attrs[k]); return e;}
  edges.forEach(function(e){ var a=byId[e[0]],b=byId[e[1]]; svg.appendChild(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,'class':'edge'+(e[2]?' hot':'')})); });
  var colors={dev:'#FF6554',acc:'#8F88FF',ip:'#F5B841',ext:'#FF8577',ok:'#2FBF85'};
  nodes.forEach(function(n,i){
    var g=el('g',{});
    if(n.t==='dev'||n.t==='ext'){ g.appendChild(el('circle',{cx:n.x,cy:n.y,r:n.r,'class':'pulse',style:'animation-delay:'+(i*0.3)+'s'})); }
    g.appendChild(el('circle',{cx:n.x,cy:n.y,r:n.r,fill:colors[n.t],stroke:'#001629','stroke-width':3}));
    if(n.l){ var tx=el('text',{x:n.x,y:n.y+n.r+16,'text-anchor':'middle',fill:'#DCE6F2','font-size':11,'font-weight':600,'font-family':'Poppins,sans-serif'}); tx.textContent=n.l; g.appendChild(tx); }
    svg.appendChild(g);
  });
  var leg=[['#FF6554','Nodo crítico'],['#8F88FF','Cuentas'],['#F5B841','IP'],['#2FBF85','Normal']];
  leg.forEach(function(l,i){ svg.appendChild(el('circle',{cx:14+i*105,cy:330,r:5,fill:l[0]})); var t=el('text',{x:24+i*105,y:334,fill:'#8FA3BB','font-size':11,'font-family':'Poppins,sans-serif'}); t.textContent=l[1]; svg.appendChild(t); });

})();
