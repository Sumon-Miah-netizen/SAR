// ============================================================
//  SAR — script.js
// ============================================================


// ============================================================
//  PROGRESS BAR
//  Handles the loading bar for each <model-viewer>.
//  — This targets only the first model-viewer (original behaviour).
//  — The inline <script> in index.html handles all other cards.
//  — Do not remove: required for the first card to load correctly.
// ============================================================
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


// ============================================================
//  TAP-TO-INTERACT  (scroll fix for mobile)
// ============================================================
//  WHAT IT DOES:
//    — On page load, camera-controls on every model-viewer is
//      disabled so the page scrolls freely on mobile.
//    — When the student taps "Tap to Interact", camera-controls
//      is re-enabled for ONLY that card and the overlay hides.
//    — A small "✕ Lock" button appears so they can disable it
//      again and scroll away.
//    — The AR "View in your space" button is NEVER affected.
//
//  HOW TO CHANGE BUTTON LABELS:
//    — "Tap to Interact" text → change in index.html inside
//      <button class="interact-btn">...</button>
//    — "✕ Lock" text          → change LOCK_LABEL below
//
//  HOW TO CHANGE BEHAVIOUR:
//    — Auto-lock after scrolling away: set AUTO_LOCK = true/false
//    — Auto-lock delay in ms:          set AUTO_LOCK_DELAY
// ============================================================

const LOCK_LABEL      = '✕ Lock'; // ← change lock button text here
const AUTO_LOCK       = true;      // ← true = auto-lock when card leaves viewport
const AUTO_LOCK_DELAY = 300;       // ← ms delay before auto-lock triggers

function initTapToInteract() {
  const cards = document.querySelectorAll('.ar-card');

  cards.forEach(card => {
    const mv      = card.querySelector('model-viewer');
    const overlay = card.querySelector('.interact-overlay');
    const btn     = card.querySelector('.interact-btn');

    if (!mv || !overlay || !btn) return;

    // ── Step 1: disable camera-controls on load ──────────────
    // Removes the attribute so the canvas no longer captures
    // touch scroll events. camera-controls stays in the HTML —
    // it is just toggled on/off by the functions below.
    mv.removeAttribute('camera-controls');

    // ── Step 2: inject the lock button into the card ─────────
    // To move or restyle it, see .interact-lock-btn in styles.css
    const lockBtn = document.createElement('button');
    lockBtn.className   = 'interact-lock-btn';
    lockBtn.textContent = LOCK_LABEL;
    card.appendChild(lockBtn);

    // ── Step 3: Activate on "Tap to Interact" tap ────────────
    btn.addEventListener('click', () => {
      activateCard(card, mv);
    });

    // ── Step 4: Deactivate on lock button tap ─────────────────
    lockBtn.addEventListener('click', () => {
      deactivateCard(card, mv);
    });
  });

  // ── Step 5: Auto-lock when card scrolls out of viewport ─────
  // Only runs if AUTO_LOCK = true (set above).
  // To disable this behaviour entirely, set AUTO_LOCK = false.
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

// Enables camera-controls and shows the lock button
function activateCard(card, mv) {
  mv.setAttribute('camera-controls', '');
  card.classList.add('active');
}

// Disables camera-controls and hides the lock button
function deactivateCard(card, mv) {
  mv.removeAttribute('camera-controls');
  card.classList.remove('active');
}

// Run once the full DOM is ready
document.addEventListener('DOMContentLoaded', initTapToInteract);
