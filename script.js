let connected = false;
const entries = [];
const today = new Intl.DateTimeFormat('ar-SA', { weekday:'long', year:'numeric', month:'long', day:'numeric' }).format(new Date());
document.getElementById('today').textContent = today;
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('active', b.dataset.page === id));
  window.scrollTo({top:0, behavior:'smooth'});
}
function toggleConnect() {
  connected = !connected;
  document.getElementById('connectionText').textContent = connected ? 'الرقعة متصلة (محاكاة)' : 'الرقعة غير متصلة';
  document.getElementById('connectionDot').style.background = connected ? '#16845F' : '#D19A3C';
  document.getElementById('connectBtn').textContent = connected ? 'قطع الاتصال' : 'اتصال بالرقعة';
  document.getElementById('deviceState').textContent = connected ? 'متصل (محاكاة)' : 'غير متصل';
}
function updateHealthStatus() {
  const review = document.getElementById('healthDemoState').value === 'review';
  const box = document.getElementById('healthMessage');
  box.classList.toggle('review', review);
  box.innerHTML = review
    ? '<strong>يوجد مؤشر يحتاج إلى مراجعة.</strong><br>لاحظنا في هذا السيناريو التجريبي قراءة أو نمطًا يستحق الانتباه. راجع مختصًا صحيًا لتقييمه، ولا تعتمد على التطبيق للتشخيص.'
    : '<strong>الحمد لله، الأمور مستقرة.</strong><br>المؤشرات التجريبية المعروضة لا تُظهر تنبيهًا في هذا النموذج. استمر في متابعة حالتك وتسجيل أي أعراض.';
}
document.getElementById('symptomForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const item = {
    symptom: document.getElementById('symptom').value,
    severity: document.getElementById('severity').value,
    duration: document.getElementById('duration').value || 'غير محددة',
    time: document.getElementById('startTime').value || 'غير محدد',
    notes: document.getElementById('notes').value || 'لا توجد ملاحظات',
    date: new Intl.DateTimeFormat('ar-SA', {day:'numeric',month:'short'}).format(new Date())
  };
  entries.unshift(item);
  renderEntries();
  this.reset();
});
function renderEntries() {
  const list = document.getElementById('diaryList');
  const recent = document.getElementById('recentActivity');
  document.getElementById('entryCount').textContent = entries.length + ' تسجيلات';
  if (!entries.length) { list.className='empty'; list.textContent='لم تتم إضافة تسجيلات بعد.'; recent.innerHTML='<div class="log-row"><div><b>لا توجد إدخالات بعد</b><div class="log-meta">يمكنك تسجيل أعراضك من سجل المتابعة</div></div><span>＋</span></div>'; return; }
  list.className='';
  list.innerHTML = entries.map(x => `<div class="log-row"><div><b>${escapeHTML(x.symptom)} · ${escapeHTML(x.severity)}</b><div class="log-meta">${escapeHTML(x.date)} · المدة: ${escapeHTML(x.duration)} · الوقت: ${escapeHTML(x.time)}<br>${escapeHTML(x.notes)}</div></div><span>✓</span></div>`).join('');
  const x = entries[0];
  recent.innerHTML = `<div class="log-row"><div><b>${escapeHTML(x.symptom)} · ${escapeHTML(x.severity)}</b><div class="log-meta">${escapeHTML(x.date)} · ${escapeHTML(x.duration)}</div></div><span>✓</span></div>`;
}
// حفظ بيانات الملف الصحي محليًا على هذا الجهاز في النموذج التجريبي
const patientFields = ['patientAge','patientGender','patientMeds','patientConditions'];
try { const savedPatient = JSON.parse(localStorage.getItem('nabdhPatientInfo') || '{}'); patientFields.forEach(id => { if(savedPatient[id] != null) document.getElementById(id).value = savedPatient[id]; }); } catch(e) {}
document.getElementById('patientInfoForm').addEventListener('submit', function(e){
  e.preventDefault(); const data = {}; patientFields.forEach(id => data[id] = document.getElementById(id).value.trim());
  try { localStorage.setItem('nabdhPatientInfo', JSON.stringify(data)); document.getElementById('patientSaveMsg').textContent='تم حفظ البيانات على هذا الجهاز.'; }
  catch(e){ document.getElementById('patientSaveMsg').textContent='تعذر الحفظ على هذا الجهاز.'; }
});
document.getElementById('patientInfoForm').addEventListener('reset', function(){ setTimeout(()=>{ try{localStorage.removeItem('nabdhPatientInfo');}catch(e){} document.getElementById('patientSaveMsg').textContent='تم مسح البيانات المحفوظة.'; },0); });
function escapeHTML(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
