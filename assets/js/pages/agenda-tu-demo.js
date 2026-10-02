/* Agenda tu demo · validación y envío del formulario
   - ?producto=<valor> en la URL preselecciona la solución (los botones de cada producto lo envían).
   - El campo oculto "origen" guarda desde qué página llegó la persona.
   - Envío: POST JSON al CRM de Todosistemas (data-endpoint + data-key → cabecera x-api-key). Si no hay endpoint, NO se envía y se avisa.
     El CRM recibe: nombreContacto, correo, telefono, nombreEmpresa, producto y mensaje. Como no tiene campos propios
     para el rol, el consentimiento ni el origen, van dentro de "mensaje" (una línea por dato).
   - Al enviar con éxito se registra el evento "generate_lead" en dataLayer (solo cuenta si hay consentimiento). */
(function(){
  var form=document.getElementById('demo-form');if(!form)return;
  var msg=document.getElementById('form-msg'),done=document.getElementById('form-done'),btn=form.querySelector('.submit');
  var params=new URLSearchParams(location.search),prod=params.get('producto'),sel=document.getElementById('f-producto');
  if(prod&&sel.querySelector('option[value="'+prod+'"]'))sel.value=prod;
  var ref='';try{var r=new URL(document.referrer);if(r.host===location.host)ref=r.pathname;}catch(e){}
  document.getElementById('f-origen').value=(ref||'directo')+(prod?' · '+prod:'');

  function campo(el){return el.closest('.field')||el.closest('.check')}
  function valido(el){
    if(el.type==='checkbox')return !el.required||el.checked;
    if(!el.required&&!el.value)return true;
    if(el.type==='email')return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
    return el.value.trim()!=='';
  }
  function revisar(el){var ok=valido(el),c=campo(el);if(c)c.classList.toggle('bad',!ok);el.setAttribute('aria-invalid',!ok);return ok}
  [].forEach.call(form.elements,function(el){if(el.required){el.addEventListener('blur',function(){revisar(el)});el.addEventListener('change',function(){if(campo(el).classList.contains('bad'))revisar(el)});}});

  form.addEventListener('submit',function(e){
    e.preventDefault();msg.textContent='';msg.className='form-msg';
    var primero=null;
    [].forEach.call(form.elements,function(el){if(el.required&&!revisar(el)&&!primero)primero=el;});
    if(primero){primero.focus();return;}
    var f=function(n){return (form.elements[n].value||'').trim()};
    var fecha=new Date();
    var lead={
      nombreContacto:f('nombre'),
      correo:f('correo'),
      telefono:f('celular'),
      nombreEmpresa:f('empresa'),
      producto:sel.options[sel.selectedIndex].text,
      mensaje:[
        'Rol: '+f('rol'),
        'Autoriza tratamiento de datos: Sí ('+fecha.toLocaleString('es-CO',{timeZone:'America/Bogota'})+')',
        'Acepta recibir contenidos por correo: '+(form.acepta_marketing.checked?'Sí':'No'),
        'Origen: '+f('origen'),
        'Página: '+location.href
      ].join('\n')
    };

    var endpoint=form.dataset.endpoint;
    if(!endpoint){
      msg.className='form-msg error';
      msg.textContent='Formulario en pruebas: todavía no está conectado al CRM, así que esta solicitud no se envió.';
      if(window.console)console.info('[Agenda tu demo] datos que se enviarían al CRM:',lead);
      return;
    }
    btn.disabled=true;
    fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','x-api-key':form.dataset.key||''},body:JSON.stringify(lead)})
      .then(function(r){if(!r.ok)throw new Error(r.status);
        (window.dataLayer=window.dataLayer||[]).push({event:'generate_lead',producto:f('producto'),origen:f('origen')});
        form.hidden=true;done.hidden=false;done.querySelector('h2').setAttribute('tabindex','-1');done.querySelector('h2').focus();})
      .catch(function(){btn.disabled=false;msg.className='form-msg error';
        msg.innerHTML='No pudimos enviar tu solicitud. Intenta de nuevo o <a href="https://api.whatsapp.com/send/?phone=573167204409&amp;text=Hola%2C%20quiero%20agendar%20una%20demo%20de%20RiskTech." target="_blank" rel="noopener">escríbenos por WhatsApp</a>.';});
  });
})();
