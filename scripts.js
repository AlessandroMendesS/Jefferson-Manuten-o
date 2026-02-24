document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    const btnOrcamento = document.getElementById('btn-orcamento');
    const modalOverlay = document.getElementById('modal-overlay');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const waLink = document.getElementById('whatsapp-link');
    const chatBtn = document.getElementById('chat-btn');

    function toggleMenu() {
        const isHidden = mobileMenu.classList.contains('hidden-menu');
        if (isHidden) {
            mobileMenu.classList.remove('hidden-menu');
            mobileMenu.classList.add('visible-menu');
            menuOverlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('hidden-menu');
            mobileMenu.classList.remove('visible-menu');
            menuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    function openModal() {
        modalOverlay.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('translate-y-full');
        });
    }

    function closeModal() {
        modal.classList.add('translate-y-full');
        setTimeout(() => modalOverlay.classList.add('hidden'), 300);
    }

    if (btnOrcamento) btnOrcamento.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    if (waLink) {
        waLink.addEventListener('click', function (e) {
            const nomeInput = document.querySelector('#modal input[type="text"]');
            const telInput = document.querySelector('#modal input[type="tel"]');
            const descArea = document.querySelector('#modal textarea');

            const nome = nomeInput ? nomeInput.value.trim() : '';
            const tel = telInput ? telInput.value.trim() : '';
            const desc = descArea ? descArea.value.trim() : '';

            const msg = encodeURIComponent(
                `Olá Jefferson! Gostaria de solicitar um orçamento.\n\nNome: ${nome || 'Não informado'}\nTelefone: ${tel || 'Não informado'}\nProblema: ${desc || 'Não informado'}`
            );
            this.href = `https://wa.me/5519981375597?text=${msg}`;
        });
    }

    if (chatBtn) {
        chatBtn.addEventListener('click', () => {
            window.open('https://wa.me/5519981375597', '_blank');
        });
    }
});
