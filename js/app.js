// CONFIGURAÇÃO: edite estes valores antes de receber solicitações.
const CONFIG = {
  whatsapp: 'SEU_NUMERO_COM_DDI', // Ex.: 55 + DDD + número, somente dígitos.
  instagram: 'https://www.instagram.com/residencialpordosol_pinheira/',
  address: 'Rua Sol e Mar · Praia da Pinheira · Palhoça/SC',
  // Intervalos inclusivos. Ex.: { from: '2026-12-24', to: '2026-12-31' }
  blockedDates: []
};
// Adaptador isolado: substituir por fetch de backend/iCal no futuro.
const availability = { async load() { return CONFIG.blockedDates; } };
const dayNumber = value => Math.floor(Date.parse(value + 'T00:00:00Z') / 86400000);
const localISO = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function validateStay(start, end, blocked, today = localISO(new Date())) {
  if (!start || !end) return {error:'Selecione as datas de chegada e saída.'};
  const a = dayNumber(start), b = dayNumber(end);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return {error:'Informe datas válidas.'};
  if (start < today) return {error:'A chegada não pode estar no passado.'};
  if (b <= a) return {error:'A saída deve ser posterior à chegada.'};
  if (blocked.some(r => start <= r.to && end >= r.from)) return {error:'O período inclui datas indisponíveis. Escolha outras datas.'};
  return {nights:b-a};
}
if (typeof module !== 'undefined') module.exports = {validateStay};
if (typeof document !== 'undefined') init();
async function init() {
  document.querySelector('#year').textContent = new Date().getFullYear();
  const menu = document.querySelector('.menu-toggle');
  menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded',open); document.querySelector('nav').classList.toggle('open',open);});
  document.querySelectorAll('nav a').forEach(a => a.addEventListener('click',() => {menu.setAttribute('aria-expanded','false');document.querySelector('nav').classList.remove('open');}));
  document.querySelectorAll('.instagram').forEach(a => a.href = CONFIG.instagram);
  const photos = [...document.querySelectorAll('.gallery-photo')], dialog = document.querySelector('#lightbox');
  let active = 0;
  function showPhoto(i) { active=(i+photos.length)%photos.length; const original=photos[active].querySelector('img');dialog.querySelector('img').src=original.src;dialog.querySelector('img').alt=original.alt;dialog.querySelector('figcaption').textContent=original.alt; }
  photos.forEach((button,i)=>button.addEventListener('click',()=>{showPhoto(i);dialog.showModal();}));
  dialog.querySelector('.close').onclick=()=>dialog.close();
  dialog.querySelector('.previous').onclick=()=>showPhoto(active-1);
  dialog.querySelector('.next').onclick=()=>showPhoto(active+1);
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')showPhoto(active+1);if(e.key==='ArrowLeft')showPhoto(active-1);});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  const form=document.querySelector('form'), start=document.querySelector('#checkin'), end=document.querySelector('#checkout'), nights=document.querySelector('#nights'), status=document.querySelector('#form-status');
  let blocked;
  try {blocked=await availability.load();}catch {status.textContent='Não foi possível consultar o calendário. Tente novamente mais tarde.';form.querySelector('button').disabled=true;return;}
  function update(){const result=validateStay(start.value,end.value,blocked);nights.textContent=result.error||`${result.nights} ${result.nights===1?'noite':'noites'} de descanso na Pinheira`;status.textContent='';}
  if(typeof flatpickr==='function') {
    const options={locale:'pt',dateFormat:'Y-m-d',altInput:true,altFormat:'d/m/Y',minDate:'today',disable:blocked,disableMobile:true,onChange:update};
    const checkout=flatpickr(end,options);
    flatpickr(start,{...options,onChange:([date])=>{if(date){const next=new Date(date);next.setDate(next.getDate()+1);checkout.set('minDate',next);if(end.value && end.value<=start.value)checkout.clear();}update();}});
  }else {start.type=end.type='date';start.min=end.min=localISO(new Date());start.onchange=end.onchange=update;}
  form.addEventListener('submit',e=>{
    e.preventDefault();const result=validateStay(start.value,end.value,blocked);
    if(result.error){status.textContent=result.error;return;}
    const data=new FormData(form), phone=String(data.get('phone')).replace(/\D/g,'');
    if(phone.length<10||phone.length>15){status.textContent='Informe seu WhatsApp com DDD.';return;}
    if(!/^\d{10,15}$/.test(CONFIG.whatsapp)){status.textContent='O WhatsApp de reservas ainda não foi configurado. Entre em contato pelo Instagram disponível nesta página.';return;}
    const format=v=>v.split('-').reverse().join('/');
    const message=`Olá! Gostaria de consultar uma estadia no Residencial Pôr do Sol.\n\nCheck-in: ${format(start.value)}\nCheck-out: ${format(end.value)}\nNoites: ${result.nights}\nHóspedes: ${data.get('guests')}\nNome: ${String(data.get('name')).trim()}\nWhatsApp: ${data.get('phone')}\nObservações: ${data.get('notes')||'Nenhuma'}\n\nAguardo disponibilidade e valores. Obrigado!`;
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');
    status.textContent='Solicitação preparada. Continue a conversa no WhatsApp para consultar sua reserva.';
  });
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal');observer.unobserve(entry.target);}}),{threshold:.12});document.querySelectorAll('.intro,.stay,.booking,.location').forEach(el=>observer.observe(el));}
}
