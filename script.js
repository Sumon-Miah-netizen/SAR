
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  updatingBar.style.width = `${event.detail.totalProgress * 100}%`;
  if (event.detail.totalProgress === 1) {
    progressBar.classList.add('hide');
    event.target.removeEventListener('progress', onProgress);
  } else {
    progressBar.classList.remove('hide');
  }
};
const firstViewer = document.querySelector('model-viewer');
if (firstViewer) firstViewer.addEventListener('progress', onProgress);



const LOCK_LABEL      = '✕ Lock'; 
const AUTO_LOCK       = true;      
const AUTO_LOCK_DELAY = 300;      

function initTapToInteract() {
  const cards = document.querySelectorAll('.ar-card');

  cards.forEach(card => {
    const mv      = card.querySelector('model-viewer');
    const overlay = card.querySelector('.interact-overlay');
    const btn     = card.querySelector('.interact-btn');

    if (!mv || !overlay || !btn) return;

    mv.removeAttribute('camera-controls');

    const lockBtn = document.createElement('button');
    lockBtn.className   = 'interact-lock-btn';
    lockBtn.textContent = LOCK_LABEL;
    card.appendChild(lockBtn);

    btn.addEventListener('click', () => {
      activateCard(card, mv);
    });

    lockBtn.addEventListener('click', () => {
      deactivateCard(card, mv);
    });
  });

  if (AUTO_LOCK) {
    const lockObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          const card = entry.target;
          const mv   = card.querySelector('model-viewer');
          setTimeout(() => {
            if (!entry.isIntersecting) deactivateCard(card, mv);
          }, AUTO_LOCK_DELAY);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.ar-card').forEach(c => lockObserver.observe(c));
  }
}

function activateCard(card, mv) {
  mv.setAttribute('camera-controls', '');
  card.classList.add('active');
}

function deactivateCard(card, mv) {
  mv.removeAttribute('camera-controls');
  card.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', initTapToInteract);
  window.addEventListener('scroll', onScroll, { passive: true });
}
