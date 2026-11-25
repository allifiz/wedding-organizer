
/* V5 — progressive enhancement: visual rhythm, gallery, accessible demo flow. */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const isEd=theme==='timeless-editorial', isRom=theme==='modern-romantic';
const motion=(el,keyframes,options={})=>{if(!el||reduced.matches||!el.animate)return;return el.animate(keyframes,{duration:650,easing:'cubic-bezier(.22,1,.36,1)',fill:'none',...options});};
const hero=$('.bot-hero,.ed-hero,.rom-hero'), heroCopy=$('.bot-copy,.ed-hero-copy,.rom-hero-grid>div'), portrait=$('.bot-arch,.rom-portrait');
if(heroCopy){Array.from(heroCopy.children).forEach((el,i)=>motion(el,isEd?[{opacity:0,transform:'translateX(-24px)'},{opacity:1,transform:'none'}]:[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:isEd?850:740,delay:i*75,fill:'backwards'}));}
if(portrait)motion(portrait,isRom?[{opacity:0,transform:'translateY(12px) scale(.985)'},{opacity:1,transform:'none'}]:[{opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'none'}],{duration:900});
if(isEd&&hero)hero.classList.add('v5-cinematic');
const critical=$('.bot-arch img,.rom-portrait img');if(critical){critical.loading='eager';critical.fetchPriority='high';}
const targets=$$('#about .wrap>*,.ed-manifesto>*,.ed-story>*,#packages .bot-card,#packages .rom-cards article,.ed-service,#portfolio .photo-tile,.bot-review,.rom-review-track article,.rom-perks,#contact .wrap>*,.ed-quote blockquote');
if(!reduced.matches&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);const el=entry.target;const siblings=Array.from(el.parentElement.children);const delay=Math.min(siblings.indexOf(el),3)*55;motion(el,isEd?[{opacity:0,transform:'translateX(-13px)'},{opacity:1,transform:'none'}]:isRom?[{opacity:0,transform:'translateY(13px) scale(.99)'},{opacity:1,transform:'none'}]:[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{delay,duration:isEd?780:650,fill:'backwards'});});},{threshold:.12});targets.forEach(el=>{if(el.getBoundingClientRect().top>innerHeight*.8)observer.observe(el);});}
const nav=$('header nav');const navLinks=$$('header nav a[href^="#"]');if('IntersectionObserver' in window){const sections=$$('#home,main section[id]');const navObserver=new IntersectionObserver(entries=>{for(const en of entries)if(en.isIntersecting){navLinks.forEach(link=>{if(link.hash==='#'+en.target.id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-12% 0px -65% 0px',threshold:0});sections.forEach(el=>navObserver.observe(el));}navLinks.find(l=>l.hash==='#home')?.setAttribute('aria-current','location');
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){$('.menu')?.click();$('.menu')?.focus();}});
let activeGallery=-1,lastTrigger=null,gesture=null,chosenPackage='';
const dialog=$('#modal'), body=$('#modal-content');
dialog.setAttribute('aria-label','Detail dan simulasi Odylop');
const galleryIndex=()=>{const next=$('.lightbox [data-action^="gallery-"]',body);if(!next)return -1;const idx=Number(next.dataset.action.slice(8));return Number.isFinite(idx)?(idx+1)%d.gallery.length:-1;};
function decorateGallery(){
 const lb=$('.lightbox',body);if(!lb||lb.querySelector('.v5-thumbs'))return;
 activeGallery=galleryIndex();if(activeGallery<0)return;
 const photo=$('img',lb);if(photo){photo.loading='eager';photo.fetchPriority='high';}
 const track=document.createElement('div');track.className='v5-thumbs';track.setAttribute('aria-label','Pilih foto inspirasi');
 d.gallery.forEach((g,i)=>{const b=document.createElement('button');b.type='button';b.dataset.action='gallery-'+i;b.setAttribute('aria-label','Foto '+(i+1));b.setAttribute('aria-pressed',String(i===activeGallery));const im=document.createElement('img');im.src=asset(g);im.alt='';im.loading='lazy';b.append(im);track.append(b);});
 lb.append(track);const hint=document.createElement('small');hint.className='v5-gallery-hint';hint.textContent='Gunakan panah keyboard atau geser foto untuk melihat inspirasi lain.';lb.append(hint);
 motion(photo,[{opacity:.55,transform:'scale(.994)'},{opacity:1,transform:'none'}],{duration:380});
}
const observer=new MutationObserver(()=>{decorateGallery();const form=$('#booking',body);if(form&&chosenPackage){const select=form.elements.service;if(select&&!select.value)select.value=chosenPackage;}});
observer.observe(body,{childList:true,subtree:true});
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-action]');if(!trigger)return;const action=trigger.dataset.action;
 if(!dialog.open)lastTrigger=trigger;
 if(action.startsWith('package-')){const index=Number(action.slice(8));chosenPackage=d.packages[index]?.[0]||'';}
 if(action==='booking'&&isRom){const form=$('#booking');if(form&&chosenPackage&&!form.elements.service.value)form.elements.service.value=chosenPackage;}
},{capture:true});
dialog.addEventListener('close',()=>{activeGallery=-1;gesture=null;if(lastTrigger&&lastTrigger.isConnected&&!isRom)lastTrigger.focus({preventScroll:true});lastTrigger=null;});
dialog.addEventListener('keydown',e=>{if(!$('.lightbox',body)||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();gallery((activeGallery+(e.key==='ArrowRight'?1:-1)+d.gallery.length)%d.gallery.length);});
dialog.addEventListener('touchstart',e=>{if(!e.target.closest('.lightbox>img'))return;const t=e.changedTouches[0];gesture={x:t.clientX,y:t.clientY};},{passive:true});
dialog.addEventListener('touchend',e=>{if(!gesture||!$('.lightbox',body))return;const t=e.changedTouches[0],dx=t.clientX-gesture.x,dy=t.clientY-gesture.y;gesture=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)gallery((activeGallery+(dx<0?1:-1)+d.gallery.length)%d.gallery.length);},{passive:true});
dialog.addEventListener('touchcancel',()=>{gesture=null;});
function addTrackControls(track,title){
 if(!track)return;
 const tiles=Array.from(track.children);if(tiles.length<2)return;
 const controls=document.createElement('div');controls.className='v5-track-controls';controls.setAttribute('aria-label',title);
 const prev=document.createElement('button'),next=document.createElement('button'),status=document.createElement('output');
 prev.type=next.type='button';prev.textContent='←';next.textContent='→';prev.setAttribute('aria-label','Sebelumnya');next.setAttribute('aria-label','Selanjutnya');status.setAttribute('aria-live','polite');
 controls.append(prev,status,next);track.after(controls);
 let index=0;
 const update=()=>{const scrollable=track.scrollWidth>track.clientWidth+4;controls.hidden=!scrollable;if(!scrollable)return;index=tiles.reduce((best,t,i)=>Math.abs(t.offsetLeft-tiles[0].offsetLeft-track.scrollLeft)<Math.abs(tiles[best].offsetLeft-tiles[0].offsetLeft-track.scrollLeft)?i:best,0);status.textContent=String(index+1).padStart(2,'0')+' / '+String(tiles.length).padStart(2,'0');prev.disabled=track.scrollLeft<=4;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-4;};
 function step(dir){const i=Math.max(0,Math.min(tiles.length-1,index+dir));track.scrollTo({left:tiles[i].offsetLeft-tiles[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});}
 prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});if('ResizeObserver' in window)new ResizeObserver(update).observe(track);requestAnimationFrame(update);
}
if(isRom){addTrackControls($('.rom-mosaic'),'Navigasi galeri');addTrackControls($('.rom-review-track'),'Navigasi testimoni');}
if(isEd){document.addEventListener('click',e=>{if(e.target.closest('[data-quote]'))motion($('#ed-quote-text'),[{opacity:.15,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:430});});}
const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
document.addEventListener('submit',e=>{const form=e.target;if(form.id!=='planner'||!form.checkValidity())return;const f=new FormData(form);const base=Number(f.get('kind')), guests=Number(f.get('guests')), venue=Number(f.get('venue')), guestCost=guests*150000,total=base+guestCost+venue, budget=Number(f.get('budget'));const result=$('#estimate');if(!result)return;
 result.replaceChildren();const title=document.createElement('h3');title.textContent='Ringkasan rencana pernikahan';result.append(title);
 const list=document.createElement('dl');list.className='v5-costs';for(const [key,val] of [['Konsep',String(f.get('concept'))],['Jumlah tamu',guests+' orang'],['Paket dasar (simulasi)',money(base)],['Estimasi kebutuhan tamu',money(guestCost)],['Estimasi venue',money(venue)],['Total ilustratif',money(total)],...(budget>0?[['Anggaran Anda',money(budget)],['Selisih terhadap anggaran',(budget>=total?'Sisa ':'Kekurangan ')+money(Math.abs(budget-total))]]:[])]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=key;dd.textContent=val;list.append(dt,dd);}result.append(list);const note=document.createElement('small');note.textContent='Angka simulasi, bukan rate card atau penawaran resmi Odylop.';result.append(note);const action=document.createElement('button');action.type='button';action.className='btn v5-plan-cta';action.dataset.action='booking';action.textContent='Lanjut simulasi konsultasi →';result.append(action);motion(result,[{opacity:.4},{opacity:1}],{duration:400});
});
document.addEventListener('submit',e=>{if(e.target.id==='booking'&&e.target.checkValidity()){const success=$('.success',e.target);if(success){success.classList.add('v5-success');motion(success,[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:450});}}});
})();
