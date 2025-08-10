// ============================
// JS: theme, search, interactions
// ============================

const body = document.body;
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('search');
const cardsGrid = document.getElementById('gamesGrid');
const games = Array.from(document.querySelectorAll('.card'));
const shownCount = document.getElementById('shownCount');
const totalCount = document.getElementById('totalCount');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalAction = document.getElementById('modalAction');

// Set year
document.getElementById('yr').textContent = new Date().getFullYear();

// Initialize theme from localStorage or system
const savedTheme = localStorage.getItem('apk_theme');
if(savedTheme === 'light') body.classList.add('light-theme');

function setToggleAria(){
    // themeToggle might not exist on all pages, so we check
    if(themeToggle) {
        themeToggle.setAttribute('aria-pressed', body.classList.contains('light-theme'));
    }
}
setToggleAria();

if(themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        localStorage.setItem('apk_theme', body.classList.contains('light-theme') ? 'light' : 'dark');
        setToggleAria();
    });
}

// Quick search (live) on the main page
if(searchInput && cardsGrid) {
    function updateFilter(){
        const q = (searchInput.value || '').trim().toLowerCase();
        let visible = 0;
        games.forEach(card => {
            const title = card.dataset.title?.toLowerCase() || '';
            const metaText = Array.from(card.querySelectorAll('.pill')).map(p => p.textContent.toLowerCase()).join(' ');
            const match = q === '' || title.includes(q) || metaText.includes(q);
            card.style.display = match ? '' : 'none';
            if(match) visible++;
        });
        shownCount.textContent = visible;
        totalCount.textContent = games.length;
    }
    searchInput.addEventListener('input', updateFilter);
    updateFilter();
}

// Keyboard shortcut: Cmd/Ctrl+K to focus search
window.addEventListener('keydown', (e) => {
    if(searchInput && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
    }
});

// Download buttons -> open modal (simulate CPA flow)
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        const game = btn.dataset.game || 'Game';
        modal.style.display = 'flex';
        modalAction.href = '#'; // тут можна підставити реальний лінк CPA
        modalAction.textContent = 'Виконати задачу для ' + game;
        modalAction.focus();
    });
});

if(modalClose) {
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Close modal when clicking outside inner
if(modal) {
    modal.addEventListener('click', (e) => {
        if(e.target === modal) modal.style.display = 'none';
    });
}

// Accessibility: focus trap when modal open (minimal)
document.addEventListener('keydown', (e) => {
    if(modal && e.key === 'Escape' && modal.style.display === 'flex') modal.style.display = 'none';
});

// ============================
// Slideshow for game page
// ============================

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("screenshot-slide");
  if (slides.length === 0) return;
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slides[slideIndex-1].style.display = "block";
}