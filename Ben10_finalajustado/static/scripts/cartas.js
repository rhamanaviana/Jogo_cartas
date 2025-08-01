document.addEventListener('DOMContentLoaded', function () {
    const carrossel = document.querySelector('.carrossel');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const cartas = document.querySelectorAll('.carta-container');
    const container = document.querySelector('.carrossel-container');
 
    const gap = 70; // Espaçamento entre cartas (deve bater com o CSS)
    const cartaWidth = cartas[0].offsetWidth + gap;
 
    let currentIndex = 0;
    let isDragging = false;
    let startPosX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let isAnimating = false;
 
    function getVisibleCards() {
        return Math.floor(container.offsetWidth / cartaWidth);
    }
 
    function moveToIndex(index) {
        if (isAnimating) return;
 
        const maxIndex = cartas.length - getVisibleCards();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const targetPosition = -currentIndex * cartaWidth;
 
        isAnimating = true;
        carrossel.style.transition = 'transform 0.5s ease';
        carrossel.style.transform = `translateX(${targetPosition}px)`;
 
        setTimeout(() => {
            isAnimating = false;
            carrossel.style.transition = '';
        }, 500);
 
        updateButtons();
    }
 
    function updateButtons() {
        const visible = getVisibleCards();
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentIndex >= cartas.length - visible ? 'none' : 'flex';
    }
 
    function dragStart(e) {
        if (isAnimating) return;
 
        isDragging = true;
        startPosX = getPositionX(e);
        prevTranslate = -currentIndex * cartaWidth;
        currentTranslate = prevTranslate;
 
        carrossel.style.transition = 'none';
        cancelAnimationFrame(animationID);
    }
 
    function drag(e) {
        if (!isDragging) return;
 
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPosX;
 
        const maxTranslate = 0;
        const minTranslate = -(cartas.length - getVisibleCards()) * cartaWidth;
 
        currentTranslate = Math.max(minTranslate, Math.min(maxTranslate, currentTranslate));
 
        animationID = requestAnimationFrame(() => {
            carrossel.style.transform = `translateX(${currentTranslate}px)`;
        });
    }
 
    function dragEnd() {
        if (!isDragging) return;
 
        isDragging = false;
        cancelAnimationFrame(animationID);
 
        const movedBy = currentTranslate - prevTranslate;
 
        if (movedBy < -100) {
            moveToIndex(currentIndex + getVisibleCards());
        } else if (movedBy > 100) {
            moveToIndex(currentIndex - getVisibleCards());
        } else {
            moveToIndex(currentIndex);
        }
    }
 
    function getPositionX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }
 
    function setupEventListeners() {
        prevBtn.addEventListener('click', () => moveToIndex(currentIndex - getVisibleCards()));
        nextBtn.addEventListener('click', () => moveToIndex(currentIndex + getVisibleCards()));
 
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') moveToIndex(currentIndex - getVisibleCards());
            if (e.key === 'ArrowRight') moveToIndex(currentIndex + getVisibleCards());
        });
 
        // Suporte ao mouse e touch
        carrossel.addEventListener('mousedown', dragStart);
        carrossel.addEventListener('touchstart', dragStart, { passive: false });
 
        carrossel.addEventListener('mousemove', drag);
        carrossel.addEventListener('touchmove', drag, { passive: false });
 
        carrossel.addEventListener('mouseup', dragEnd);
        carrossel.addEventListener('mouseleave', dragEnd);
        carrossel.addEventListener('touchend', dragEnd);
        carrossel.addEventListener('touchcancel', dragEnd);
    }
 
    function initCarrossel() {
        setupEventListeners();
        updateButtons();
    }
 
    // Recalcula quando a tela for redimensionada
    window.addEventListener('resize', () => {
        moveToIndex(currentIndex);
        updateButtons();
    });
 
    initCarrossel();
});