/* Podcast · ondas animadas y reproductor oficial de Spotify.
   El iframe de Spotify NO se carga solo: Spotify puede poner sus propias cookies,
   así que se carga únicamente cuando la persona pulsa el botón. */
(function(){
  var wv=document.getElementById('wave');
  if(wv){for(var w=0;w<38;w++){var b=document.createElement('i');b.style.animationDelay=(Math.random()*1.2)+'s';b.style.animationDuration=(0.8+Math.random()*.8)+'s';wv.appendChild(b);}}
  var btn=document.getElementById('player-load'),box=document.getElementById('player');
  if(!btn)return;
  btn.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.src='https://open.spotify.com/embed/show/4oYY2y0hEFBMAgx8d2q9yr?utm_source=generator&theme=0';
    f.title='Reproductor de Spotify: podcast A Prueba de Fraude';
    f.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    f.loading='lazy';
    box.innerHTML='';box.appendChild(f);f.focus();
  });
})();
