/* RiskTech · Prevención de fraude y AML con IA · animaciones e interacciones propias de la página */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* marquee duplicate */
  

  /* rotating text */
  var rot=document.getElementById('rot'),phr=['detecta fraude en milisegundos','previene el lavado de activos','valida contrapartes en +3.000 listas','contacta al cliente por WhatsApp y voz','descubre redes de cuentas mula'],pi=0;
  function typeP(){var t=phr[pi%phr.length],i=0;pi++;(function w(){rot.textContent=t.slice(0,++i);if(i<t.length)setTimeout(w,38);else setTimeout(erase,2300);})();}
  function erase(){var t=rot.textContent;(function e(){t=t.slice(0,-1);rot.textContent=t;if(t.length)setTimeout(e,18);else setTimeout(typeP,250);})();}
  if(!reduce){rot.textContent='';typeP();}

  /* hero network canvas */
  var cv=document.getElementById('net'),cx=cv.getContext('2d'),W,H,DPR=Math.min(devicePixelRatio||1,2),pts=[],mouse={x:-999,y:-999};
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0);var n=Math.min(90,Math.floor(W*H/16000));pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.8+1,a:0});}
  size();addEventListener('resize',size);
  cv.parentElement.addEventListener('mousemove',function(e){var r=cv.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  cv.parentElement.addEventListener('mouseleave',function(){mouse.x=mouse.y=-999});
  var alerts=[];
  setInterval(function(){if(pts.length){var p=pts[Math.floor(Math.random()*pts.length)];p.a=1;alerts.push({x:p.x,y:p.y,t:0,p:p});}},1400);
  function frame(){
    cx.clearRect(0,0,W,H);
    for(var i=0;i<pts.length;i++){var p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      var dx=mouse.x-p.x,dy=mouse.y-p.y,dm=Math.sqrt(dx*dx+dy*dy);if(dm<160){p.x-=dx*.004;p.y-=dy*.004;}
      for(var j=i+1;j<pts.length;j++){var q=pts[j],ex=p.x-q.x,ey=p.y-q.y,d=Math.sqrt(ex*ex+ey*ey);if(d<130){var hot=p.a>.2&&q.a>.2;cx.strokeStyle=hot?'rgba(255,101,84,'+(1-d/130)*.8+')':'rgba(143,136,255,'+(1-d/130)*.28+')';cx.lineWidth=hot?1.4:1;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke();if(p.a>.5&&q.a<.3&&Math.random()<.004)q.a=.9;}}
      if(dm<160){cx.strokeStyle='rgba(255,255,255,'+(1-dm/160)*.35+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(mouse.x,mouse.y);cx.stroke();}
      cx.fillStyle=p.a>.2?'rgba(255,101,84,'+(.5+p.a*.5)+')':'rgba(220,230,242,.75)';cx.beginPath();cx.arc(p.x,p.y,p.r+(p.a*2),0,6.28);cx.fill();p.a=Math.max(0,p.a-.004);}
    for(var k=alerts.length-1;k>=0;k--){var a=alerts[k];a.t+=1;var rr=a.t*.9,al=1-a.t/70;if(al<=0){alerts.splice(k,1);continue;}cx.strokeStyle='rgba(255,101,84,'+al+')';cx.lineWidth=2;cx.beginPath();cx.arc(a.p.x,a.p.y,rr,0,6.28);cx.stroke();}
    if(!reduce)requestAnimationFrame(frame);
  }
  frame();

  /* journey */
  var J=[
    {t:'Validación de contrapartes',tag:'AMLRISK',tc:'rgba(0,194,184,.2)',tt:'#5FE3D9',link:'amlrisk/',
     d:'Antes de vincular, AMLRISK valida a la persona o empresa en más de 3.000 listas restrictivas, vinculantes y de PEPs, y descarta homónimos automáticamente.',
     l:['Consultas directas, masivas o por API','Respuesta en milisegundos','Trazabilidad con número único de consulta'],
     v:[['Consulta N.º A-2026-184320','Laura M. Gómez P. · CC ****4821','—','v'],['Listas OFAC · ONU · UE','Sin coincidencias','LIMPIO','g'],['PEPs nacionales','Sin coincidencias','LIMPIO','g'],['Homonimia','1 registro similar descartado','OK','g'],['Resultado','Cliente apto para vinculación','APROBADO','g']]},
    {t:'Monitoreo transaccional en tiempo real',tag:'FRAML MS ANTIFRAUD',tc:'rgba(108,99,255,.3)',tt:'#C7C4FF',link:'framl-ms-antifraude/',
     d:'Cada operación en app, web, ATM o POS se evalúa contra reglas dinámicas, el perfil habitual del cliente y modelos de IA, antes de autorizarse.',
     l:['Reglas dinámicas y SandBox','Perfil y hábitos de cada cliente','Modelos de IA con tus datos'],
     v:[['Transferencia · App móvil','$4.750.000 · 10:42 p. m.','',''],['Dispositivo','Nuevo, nunca visto para este cliente','RIESGO','y'],['Monto vs. perfil','8× su promedio habitual','RIESGO','y'],['Beneficiario','Cuenta abierta hace 3 días','RIESGO','y'],['Score de riesgo','94 / 100 · 18 ms','ALERTA','c']]},
    {t:'Validación con el cliente',tag:'FRAML ALERT DEFENSE',tc:'rgba(255,101,84,.25)',tt:'#FF8577',link:'alert-framl-defense/',
     d:'Alert Defense contacta al cliente por WhatsApp; si no responde, Gaby, nuestra agente de voz, lo llama. La respuesta vuelve al motor para bloquear o liberar.',
     l:['Chat Defense por WhatsApp oficial','Voice Defense con agente de voz IA','Audio y transcripción auditables'],
     v:[['WhatsApp enviado','¿Reconoce esta transferencia?','10:42','v'],['Sin respuesta','Escalando a Voice Defense','10:45','y'],['Llamada de Gaby · 0:41','"No, yo no hice esa transferencia"','10:47','v'],['Decisión','Transacción rechazada · tarjeta bloqueada','BLOQUEO','c']]},
    {t:'Del patrón LA/FT al reporte',tag:'FRAML MS AML',tc:'rgba(99,174,255,.25)',tt:'#9CCBFF',link:'framl-ms-aml/',
     d:'Cuando aparece una señal de lavado de activos, FRAML MS AML la documenta con el perfil 360°, la matriz de riesgo y los grafos, y la lleva hasta el ROS.',
     l:['Matriz SARLAFT inherente y residual','PEPs, listas y segmentación con IA','ROS y reportes de ley para la UIAF'],
     v:[['Señal LA/FT','Paso de fondos en menos de 24 h','ALTA','c'],['Perfil 360°','Incoherente con la actividad declarada','REVISAR','y'],['Escalamiento','Analista → Oficial de Cumplimiento','APROBADO','g'],['ROS','Radicado · certificado UIAF archivado','CERRADO','g']]},
    {t:'IA que aprende y conecta',tag:'CEREBRITO',tc:'rgba(108,99,255,.3)',tt:'#C7C4FF',link:'',
     d:'Cerebrito analiza todo el universo transaccional: responde en lenguaje natural, sugiere cómo calibrar reglas y revela redes de fraude y cuentas mula.',
     l:['Chat IA en lenguaje natural','Monitor forense de reglas','Grafos de riesgo en red'],
     v:[['Pregunta','¿Qué red está detrás de esta alerta?','',''],['Red identificada','7 cuentas · 2 dispositivos compartidos','MULAS','c'],['Regla sugerida','Ajustar umbral de "primer beneficiario"','IA','v'],['Aprendizaje','Nuevo patrón agregado al modelo','OK','g']]}
  ];
  var steps=[].slice.call(document.querySelectorAll('.js')),cur=0,timer=null,paused=false,t0=0,DUR=7000;
  var jt=document.getElementById('jt'),jtag=document.getElementById('jtag'),jd=document.getElementById('jd'),jl=document.getElementById('jl'),jv=document.getElementById('jv'),jlink=document.getElementById('jlink');
  function show(i){cur=(i+J.length)%J.length;var s=J[cur];
    steps.forEach(function(b,k){b.classList.toggle('on',k===cur);b.querySelector('.bar i').style.width='0'});
    jt.textContent=s.t;jtag.textContent=s.tag;jtag.style.background=s.tc;jtag.style.color=s.tt;jd.textContent=s.d;
    jl.innerHTML=s.l.map(function(x){return '<li><svg aria-hidden="true" class="i"><use href="#check"/></svg>'+x+'</li>'}).join('');
    jv.innerHTML=s.v.map(function(r,k){return '<div class="vrow" style="animation-delay:'+(k*.35)+'s"><span><b>'+r[0]+'</b><small>'+r[1]+'</small></span>'+(r[2]?'<span class="chip '+r[3]+'">'+r[2]+'</span>':'')+'</div>'}).join('');
    if(s.link){jlink.href=s.link;jlink.removeAttribute('target');jlink.innerHTML='Conocer la solución <svg aria-hidden="true" class="i"><use href="#arrow"/></svg>';}else{jlink.href='agenda-tu-demo/';jlink.removeAttribute('target');jlink.innerHTML='Agenda tu demo <svg aria-hidden="true" class="i"><use href="#arrow"/></svg>';}
    t0=performance.now();}
  function tick(now){if(!paused&&!reduce&&!journey.classList.contains('stacked')){var p=(now-t0)/DUR;var b=steps[cur].querySelector('.bar i');b.style.width=Math.min(p*100,100)+'%';if(p>=1)show(cur+1);}requestAnimationFrame(tick);}
  steps.forEach(function(b,k){b.addEventListener('click',function(){show(k)})});
  document.getElementById('jnext').onclick=function(){show(cur+1)};document.getElementById('jprev').onclick=function(){show(cur-1)};
  var pb=document.getElementById('jpause');pb.onclick=function(){paused=!paused;pb.innerHTML=paused?'<svg aria-hidden="true" class="i"><use href="#play"/></svg>':'<svg aria-hidden="true" class="i"><use href="#pause"/></svg>';if(!paused)t0=performance.now();};
  show(0);requestAnimationFrame(tick);
  /* en el celular: cada paso muestra su contenido justo debajo, uno tras otro */
  var journey=document.getElementById('jsteps').parentNode,clones=[],mqJ=window.matchMedia('(max-width:720px)');
  function stageHTML(s){
    var link=s.link?'<a href="'+s.link+'">Conocer la solución <svg aria-hidden="true" class="i"><use href="#arrow"/></svg></a>':'<a href="agenda-tu-demo/">Agenda tu demo <svg aria-hidden="true" class="i"><use href="#arrow"/></svg></a>';
    return '<div class="jhead"><h3>'+s.t+'</h3><span class="tag" style="background:'+s.tc+';color:'+s.tt+'">'+s.tag+'</span></div>'+
      '<div class="jbody"><div><p>'+s.d+'</p><ul>'+s.l.map(function(x){return '<li><svg aria-hidden="true" class="i"><use href="#check"/></svg>'+x+'</li>'}).join('')+'</ul></div>'+
      '<div class="jviz">'+s.v.map(function(r,k){return '<div class="vrow" style="animation-delay:'+(k*.35)+'s"><span><b>'+r[0]+'</b><small>'+r[1]+'</small></span>'+(r[2]?'<span class="chip '+r[3]+'">'+r[2]+'</span>':'')+'</div>'}).join('')+'</div></div>'+
      '<div class="jfoot">'+link+'</div>';
  }
  function apilar(){
    clones.forEach(function(c){c.parentNode.removeChild(c)});clones=[];
    journey.classList.toggle('stacked',mqJ.matches);
    if(mqJ.matches)steps.forEach(function(b,k){var d=document.createElement('div');d.className='jstage jstage-m';d.innerHTML=stageHTML(J[k]);b.parentNode.insertBefore(d,b.nextSibling);clones.push(d);});
    else t0=performance.now();
  }
  apilar();if(mqJ.addEventListener)mqJ.addEventListener('change',apilar);else mqJ.addListener(apilar);

  /* product card spotlight */
  document.querySelectorAll('.pc').forEach(function(c){c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});});

  /* bento chat */
  var bchat=document.getElementById('bchat'),conv=[['¿Qué regla genera más falsos positivos?','<b>“Primer IP x encargo”</b>: 173 alertas con baja confirmación. Sugiero elevar el umbral y probarla en SandBox.'],['¿Cuántas alertas hubo esta semana?','<b>742 alertas</b>, 18% menos que la semana anterior. El 61% vino de la app móvil.'],['¿Hay dispositivos de alto riesgo?','<b>3 dispositivos</b> operan más de 5 identidades en 48 h. Recomiendo aislar la red.']],ci=0;
  function chatLoop(){var c=conv[ci%conv.length];ci++;while(bchat.children.length>2)bchat.removeChild(bchat.firstChild);var u=document.createElement('div');u.className='msg u';u.textContent=c[0];bchat.appendChild(u);
    setTimeout(function(){var b=document.createElement('div');b.className='msg b';b.innerHTML=c[1];bchat.appendChild(b);},900);setTimeout(chatLoop,5200);}
  var cio=new IntersectionObserver(function(es){if(es[0].isIntersecting){chatLoop();cio.disconnect();}},{threshold:.2});cio.observe(bchat);
  /* sandbox bars */
  var sio=new IntersectionObserver(function(es){if(es[0].isIntersecting){document.querySelectorAll('#sandbox i').forEach(function(i){i.style.width=i.dataset.w+'%'});sio.disconnect();}},{threshold:.4});sio.observe(document.getElementById('sandbox'));
  /* mini graph */
  var g=document.getElementById('gmini'),NS='http://www.w3.org/2000/svg';function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e;}
  var N=[[20,55],[90,20],[90,90],[170,55],[250,25],[250,85],[330,55],[410,20],[410,90],[500,55]],E=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6],[6,7],[6,8],[7,9],[8,9]];
  E.forEach(function(e,k){g.appendChild(el('line',{x1:N[e[0]][0],y1:N[e[0]][1],x2:N[e[1]][0],y2:N[e[1]][1],stroke:k>3&&k<8?'#FF6554':'rgba(245,184,65,.5)','stroke-width':k>3&&k<8?2:1.4,'stroke-dasharray':k>3&&k<8?'5 5':'0'}))});
  N.forEach(function(n,k){g.appendChild(el('circle',{cx:n[0],cy:n[1],r:k===3||k===6?9:6,fill:k===3||k===6?'#FF6554':'#F5B841',stroke:'#00223F','stroke-width':3}))});
  /* podcast wave */
  var wv=document.getElementById('wave');if(wv)for(var w=0;w<42;w++){var bar=document.createElement('i');bar.style.animationDelay=(Math.random()*1.2)+'s';bar.style.animationDuration=(0.8+Math.random()*.8)+'s';wv.appendChild(bar);}

  /* sectors */
  var sts=document.querySelectorAll('.st');sts.forEach(function(b){b.addEventListener('click',function(){sts.forEach(function(x){x.classList.remove('on')});b.classList.add('on');document.querySelectorAll('.spanel').forEach(function(p){p.classList.remove('on')});document.getElementById(b.dataset.s).classList.add('on');});});

})();
