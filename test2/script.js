// Sample courses data (could be loaded from JSON)
const courses = [
  {id:1,name:'دورة Flutter متقدمة',desc:'8 أسابيع - مشاريع تطبيقية',duration:'8 أسابيع',price:'100$'},
  {id:2,name:'معالجة الصور و AI',desc:'6 أسابيع - أساسيات و مشاريع',duration:'6 أسابيع',price:'80$'},
  {id:3,name:'تصميم جرافيك',desc:'4 أسابيع - بناء معرض أعمال',duration:'4 أسابيع',price:'60$'},
  {id:4,name:'تدريب ميداني للجامعات',desc:'برنامج متخصص للطلبة',duration:'12 أسبوع',price:'مجاني/مدعوم'},
  {id:5,name:'Processing & Creative Coding',desc:'فن الكود والتصاميم التفاعلية',duration:'5 أسابيع',price:'50$'},
  {id:6,name:'ورشة العمل: Git & GitHub',desc:'أساسيات التحكم بالإصدارات',duration:'2 أسابيع',price:'20$'}
];

// Populate courses page and booking select
const coursesList = document.getElementById('coursesList');
const courseSelect = document.getElementById('courseSelect');
function renderCourses(){
  coursesList.innerHTML = '';
  courseSelect.innerHTML = '<option value="">اختر الدورة</option>';
  courses.forEach(c=>{
    const el = document.createElement('div'); el.className='course';
    el.innerHTML = `
      <h3>${c.name}</h3>
      <p style="color:var(--muted)">${c.desc}</p>
      <div class="meta">
        <span>المدة: ${c.duration}</span>
        <span>السعر: ${c.price}</span>
      </div>
      <div style='margin-top:10px;text-align:left'>
        <button class='btn' data-id='${c.id}'>احجز الآن</button>
      </div>`;
    coursesList.appendChild(el);

    const op = document.createElement('option');
    op.value=c.id; op.textContent = c.name;
    courseSelect.appendChild(op);
  })
}
renderCourses();

// Portfolio images
const portfolioImgs = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526378720552-5e7b38f4f1ae?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200&auto=format&fit=crop'
];
const portfolioGrid = document.getElementById('portfolioGrid');
portfolioImgs.forEach(src=>{
  const img = document.createElement('img');
  img.src = src;
  img.alt='عمل من شيفرة كود';
  img.addEventListener('click', ()=>openImg(src));
  portfolioGrid.appendChild(img);
})

// Modal image
const modalImg = document.getElementById('modal-img');
const modalImgEl = document.getElementById('modalImgEl');
function openImg(src){
  modalImg.classList.add('open');
  modalImgEl.src=src;
}
document.getElementById('closeImg').addEventListener('click', ()=>modalImg.classList.remove('open'));
modalImg.addEventListener('click',(e)=>{ if(e.target===modalImg) modalImg.classList.remove('open') })

// Booking modal behavior
const modal = document.getElementById('modal-book');
document.getElementById('open-book').addEventListener('click', ()=> modal.classList.add('open'));
document.getElementById('closeBook').addEventListener('click', ()=> modal.classList.remove('open'));
modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.classList.remove('open') })

// Book from course card
document.addEventListener('click', e=>{
  if(e.target.matches('.course .btn')){
    const id = e.target.dataset.id;
    courseSelect.value = id;
    modal.classList.add('open');
  }
})

// Booking form submit
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const courseId = +document.getElementById('courseSelect').value;

  if(!name||!phone||!email||!courseId){
    alert('الرجاء تعبئة جميع الحقول');
    return;
  }

  const course = courses.find(c=>c.id===courseId).name;
  const booking = {
    id:Date.now(),
    name,
    phone,
    email,
    course,
    created:new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem('shifra_bookings')||'[]');
  existing.push(booking);
  localStorage.setItem('shifra_bookings', JSON.stringify(existing));

  modal.classList.remove('open');
  bookingForm.reset();
  alert('تمّ إرسال الحجز بنجاح! سوف نتواصل معك قريباً.');
})

// Contact form
document.getElementById('contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  const data = {
    name:document.getElementById('cname').value,
    email:document.getElementById('cemail').value,
    msg:document.getElementById('cmsg').value
  };

  const msgs = JSON.parse(localStorage.getItem('shifra_messages')||'[]');
  msgs.push({...data,created:new Date().toISOString()});
  localStorage.setItem('shifra_messages', JSON.stringify(msgs));

  e.target.reset();
  alert('تم إرسال رسالتك — شكراً لتواصلك معنا!');
})

// Navigation
document.querySelectorAll('a[data-page], a.btn.ghost[data-page]').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const target = a.dataset.page;
    showPage(target);
  })
})
function showPage(p){
  ['home','courses','portfolio','contact'].forEach(k=>
    document.getElementById('page-'+k).style.display = (k===p? 'block': 'none')
  );
  document.querySelectorAll('nav a').forEach(a=>
    a.classList.toggle('active', a.dataset.page===p)
  );
}
showPage('home');

console.info('شيفرة كود — عدد الحجوزات المخزنة:', (JSON.parse(localStorage.getItem('shifra_bookings')||'[]')).length);
