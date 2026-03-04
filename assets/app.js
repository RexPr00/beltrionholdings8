document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const lock = (on) => body.style.overflow = on ? 'hidden' : '';

  document.querySelectorAll('.lang-current').forEach(btn => {
    btn.addEventListener('click', () => btn.parentElement.classList.toggle('open'));
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-wrap').forEach(w => {
      if (!w.contains(e.target)) w.classList.remove('open');
    });
  });

  const drawer = document.querySelector('.drawer');
  const burger = document.querySelector('.burger');
  const closeDrawerBtn = document.querySelector('.drawer-close');
  const openDrawer = () => { drawer?.classList.add('open'); lock(true); trapFocus(drawer); };
  const closeDrawer = () => { drawer?.classList.remove('open'); lock(false); releaseFocus(); };
  burger?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelector('.drawer-backdrop')?.addEventListener('click', closeDrawer);

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      faqItems.forEach(i => i.classList.remove('open'));
      item.classList.add('open');
    });
  });

  const modal = document.querySelector('.modal');
  const openModal = document.querySelectorAll('[data-open-privacy]');
  const closeModalBtn = document.querySelectorAll('[data-close-privacy]');
  const showModal = () => { modal?.classList.add('open'); lock(true); trapFocus(modal); };
  const hideModal = () => { modal?.classList.remove('open'); lock(false); releaseFocus(); };
  openModal.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); showModal(); }));
  closeModalBtn.forEach(b => b.addEventListener('click', hideModal));
  modal?.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { hideModal(); closeDrawer(); }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  let trapRoot = null;
  let keyHandler = null;
  function trapFocus(root){
    releaseFocus();
    trapRoot = root;
    const f = root.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    first.focus();
    keyHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyHandler);
  }
  function releaseFocus(){
    if (keyHandler){ document.removeEventListener('keydown', keyHandler); keyHandler = null; }
    trapRoot = null;
  }
});
