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

    // Avaliações - integração com Supabase
    const ratingContainer = document.getElementById('rating-stars');
    const avaliacaoForm = document.getElementById('avaliacao-form');
    const avaliacaoList = document.getElementById('avaliacoes-list');
    const abrirAvaliacaoBtn = document.getElementById('abrir-avaliacao-btn');
    const avaliacaoFormContainer = document.getElementById('avaliacao-form-container');

 
    const SUPABASE_URL = 'https://txtomthoumjnademdprf.supabase.co'; 
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4dG9tdGhvdW1qbmFkZW1kcHJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzUzMjIsImV4cCI6MjA4OTAxMTMyMn0.76yCHILltc5J06QrDHhCFMeVC7QzGtefwy1PpZO_Sjg'; 

    const SUPABASE_AVALIACOES_TABLE = 'avaliacoes';

    async function carregarAvaliacoesSupabase() {
        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/${SUPABASE_AVALIACOES_TABLE}?select=*&order=created_at.desc`,
                {
                    headers: {
                        apikey: SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                console.error('Erro ao buscar avaliações no Supabase', await response.text());
                return [];
            }

            const data = await response.json();
            return Array.isArray(data)
                ? data.map(row => ({
                    nomePadaria: row.padaria || '',
                    descricao: row.descricao || '',
                    nota: Number(row.nota || 0),
                }))
                : [];
        } catch (e) {
            console.error('Erro ao carregar avaliações do Supabase', e);
            return [];
        }
    }

    async function salvarAvaliacaoSupabase({ nomePadaria, descricao, nota }) {
        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/${SUPABASE_AVALIACOES_TABLE}`,
                {
                    method: 'POST',
                    headers: {
                        apikey: SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        Prefer: 'return=representation',
                    },
                    body: JSON.stringify({
                        padaria: nomePadaria,
                        descricao,
                        nota,
                    }),
                }
            );

            if (!response.ok) {
                console.error('Erro ao salvar avaliação no Supabase', await response.text());
                alert('Não foi possível salvar sua avaliação. Tente novamente em alguns instantes.');
                return null;
            }

            const data = await response.json();
            const row = Array.isArray(data) && data[0] ? data[0] : null;
            if (!row) return { nomePadaria, descricao, nota };

            return {
                nomePadaria: row.padaria || nomePadaria,
                descricao: row.descricao || descricao,
                nota: Number(row.nota || nota),
            };
        } catch (e) {
            console.error('Erro ao salvar avaliação no Supabase', e);
            alert('Não foi possível salvar sua avaliação. Verifique sua conexão e tente novamente.');
            return null;
        }
    }

    function criarCardAvaliacao({ nomePadaria, descricao, nota }) {
        const card = document.createElement('div');
        card.className = 'p-8 rounded-[2rem] bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 shadow-lg';

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-4';

        const title = document.createElement('p');
        title.className = 'font-black text-lg';
        title.textContent = nomePadaria;

        const location = document.createElement('span');
        location.className = 'text-xs font-bold uppercase tracking-widest text-primary';
        location.textContent = 'Guaxupé - MG';

        header.appendChild(title);
        header.appendChild(location);

        const starsRow = document.createElement('div');
        starsRow.className = 'flex items-center gap-1 text-yellow-400 text-sm mb-4';
        for (let i = 1; i <= 5; i++) {
            const starIcon = document.createElement('i');
            starIcon.className = i <= nota ? 'fa-solid fa-star' : 'fa-regular fa-star';
            starsRow.appendChild(starIcon);
        }

        const text = document.createElement('p');
        text.className = 'text-gray-600 dark:text-gray-400 text-sm leading-relaxed';
        text.textContent = descricao;

        card.appendChild(header);
        card.appendChild(starsRow);
        card.appendChild(text);

        return card;
    }

    async function renderizarAvaliacoesIniciais() {
        if (!avaliacaoList) return;
        avaliacaoList.innerHTML = '';
        const lista = await carregarAvaliacoesSupabase();
        lista.forEach(av => {
            if (!av.nomePadaria || !av.descricao || !av.nota) return;
            const card = criarCardAvaliacao(av);
            avaliacaoList.appendChild(card);
        });
    }

    // Mostrar / esconder formulário de avaliação
    if (abrirAvaliacaoBtn && avaliacaoFormContainer) {
        abrirAvaliacaoBtn.addEventListener('click', () => {
            const isHidden = avaliacaoFormContainer.classList.contains('hidden');
            if (isHidden) {
                avaliacaoFormContainer.classList.remove('hidden');
                abrirAvaliacaoBtn.textContent = 'Fechar formulário';
                avaliacaoFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                avaliacaoFormContainer.classList.add('hidden');
                abrirAvaliacaoBtn.textContent = 'Deixar minha avaliação';
            }
        });
    }

    // Lógica de estrelas e criação de cards (somente se existir formulário)
    if (ratingContainer && avaliacaoForm && avaliacaoList) {
        const starButtons = ratingContainer.querySelectorAll('button[data-value]');
        const notaInput = document.getElementById('nota');

        function setRating(value) {
            if (!notaInput) return;
            notaInput.value = value;
            starButtons.forEach(btn => {
                const btnValue = Number(btn.dataset.value || 0);
                if (btnValue <= value) {
                    btn.classList.remove('text-gray-300');
                    btn.classList.add('text-yellow-400');
                } else {
                    btn.classList.add('text-gray-300');
                    btn.classList.remove('text-yellow-400');
                }
            });
        }

        starButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = Number(btn.dataset.value || 0);
                setRating(value);
            });
        });

        // Renderiza avaliações salvas ao carregar
        renderizarAvaliacoesIniciais();

        avaliacaoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const padariaInput = document.getElementById('padaria');
            const descInput = document.getElementById('descricao-avaliacao');

            const nomePadaria = padariaInput ? padariaInput.value.trim() : '';
            const descricao = descInput ? descInput.value.trim() : '';
            const nota = notaInput ? Number(notaInput.value || 0) : 0;

            if (!nomePadaria || !descricao || nota <= 0) {
                alert('Preencha o nome da padaria, a descrição e selecione a nota em estrelas.');
                return;
            }

            const novaAvaliacao = { nomePadaria, descricao, nota };

            // Salva no Supabase
            salvarAvaliacaoSupabase(novaAvaliacao).then(avSalva => {
                if (!avSalva) return;

                // Cria card de avaliação na tela
                const card = criarCardAvaliacao(avSalva);
                avaliacaoList.appendChild(card);

                // Limpa formulário apenas após salvar com sucesso
                if (padariaInput) padariaInput.value = '';
                if (descInput) descInput.value = '';
                setRating(0);
            });
        });
    }
});
