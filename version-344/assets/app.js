document.addEventListener('DOMContentLoaded',()=>{
const menuButton=document.querySelector('[data-menu-button]');
const mobilePanel=document.querySelector('[data-mobile-panel]');
if(menuButton&&mobilePanel){menuButton.addEventListener('click',()=>mobilePanel.classList.toggle('is-open'))}
const slides=[...document.querySelectorAll('.hero-slide')];
const dots=[...document.querySelectorAll('.hero-dots button')];
let current=0;
function showSlide(i){if(!slides.length)return;current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('is-active',n===current));dots.forEach((d,n)=>d.classList.toggle('is-active',n===current))}
if(slides.length){document.querySelector('[data-hero-prev]')?.addEventListener('click',()=>showSlide(current-1));document.querySelector('[data-hero-next]')?.addEventListener('click',()=>showSlide(current+1));dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));setInterval(()=>showSlide(current+1),6200)}
const input=document.querySelector('[data-search-input]');
const buttons=[...document.querySelectorAll('[data-filter-button]')];
const cards=[...document.querySelectorAll('.movie-card,.rank-item')];
const empty=document.querySelector('[data-empty]');
let active='all';
function apply(){const q=(input?.value||'').trim().toLowerCase();let shown=0;cards.forEach(card=>{const text=(card.getAttribute('data-search')||'').toLowerCase();const type=card.getAttribute('data-type')||'';const okText=!q||text.includes(q);const okType=active==='all'||type.includes(active);const visible=okText&&okType;card.hidden=!visible;if(visible)shown++});if(empty)empty.style.display=shown?'none':'block'}
if(input){input.addEventListener('input',apply)}
buttons.forEach(btn=>btn.addEventListener('click',()=>{active=btn.getAttribute('data-filter-button')||'all';buttons.forEach(b=>b.classList.toggle('is-active',b===btn));apply()}));
});