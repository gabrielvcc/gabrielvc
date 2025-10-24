document.addEventListener('DOMContentLoaded', () => {
    (function() {
        const styleTag = document.createElement('style');
        styleTag.id = 'dynamic-app-styles';
        let cssRules = '';
        document.querySelectorAll('.app-item').forEach(appItem => {
            const appColor = appItem.dataset.appColor;
            if (!appColor) {
                return;
            }
            cssRules += `
                .app-item[data-app-color="${appColor}"]:hover {
                    border-color: ${appColor};
                    box-shadow: 0 0 15px ${appColor}80; /* 80 = ~50% de opacidade em hex */
                }
            `;
            cssRules += `
                .app-item[data-app-color="${appColor}"]:hover a {
                    color: ${appColor};
                }
            `;
        });
        styleTag.innerHTML = cssRules;
        document.head.appendChild(styleTag);
    })();
    /**
     * Verifica o status de um único aplicativo.
     * @param {HTMLElement} appItem
     */
    const checkStatus = async (appItem) => {
        const link = appItem.querySelector('a');
        const statusIndicator = appItem.querySelector('.status-indicator');
        const statusText = appItem.querySelector('.status-text');

        if (!link || !statusIndicator || !statusText) {
            return;
        }
        const url = link.href;
        statusIndicator.classList.remove('online', 'offline');
        statusText.textContent = 'Verificando...';
        statusText.style.color = '';

        try {
            await fetch(url, { mode: 'no-cors' });

            statusIndicator.classList.add('online');
            statusText.textContent = 'Online';
            statusText.style.color = 'var(--status-online)';

        } catch (error) {
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Offline';
            statusText.style.color = 'var(--status-offline)';
        }
    };

    document.querySelectorAll('.app-item').forEach(appItem => {
        checkStatus(appItem); 
        setInterval(() => checkStatus(appItem), 60000); 
    });


    const profilePic = document.getElementById('profilePic');
    const profileModalBackdrop = document.getElementById('profileModalBackdrop');
    const closeModalButton = document.getElementById('closeModal');

    profilePic.addEventListener('click', () => {
        profileModalBackdrop.classList.add('visible');
    });

    closeModalButton.addEventListener('click', () => {
        profileModalBackdrop.classList.remove('visible');
    });

    // Fecha o modal ao clicar fora do conteúdo
    profileModalBackdrop.addEventListener('click', (event) => {
        if (event.target === profileModalBackdrop) {
            profileModalBackdrop.classList.remove('visible');
        }
    });

    // Fecha o modal ao pressionar ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && profileModalBackdrop.classList.contains('visible')) {
            profileModalBackdrop.classList.remove('visible');
        }
    });

});

    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingCircle = document.getElementById('loadingCircle');
    const loadingLogo = document.getElementById('loadingLogo');
    const mainContent = document.querySelector('.main-content');

    const TEMPO_APARECER = 500; 
    const TEMPO_ESPERA = 1000; 
    const TEMPO_GIRAR = 1000;  
    const TEMPO_LIMPEZA = 500; 

    document.querySelectorAll('.app-item').forEach(appItem => {
        
        appItem.addEventListener('click', (event) => {
            event.preventDefault(); 
            event.stopPropagation();

            const link = appItem.querySelector('a');
            if (!link) return;

            const href = link.href;
            const target = link.target || '_self';
            const logoSrc = appItem.dataset.logoSrc;
            const appColor = appItem.dataset.appColor || '#FFFFFF';
            
            loadingLogo.src = logoSrc || ''; 
            loadingCircle.classList.remove('appear', 'rotate'); 
            loadingCircle.style.borderColor = appColor;
            loadingCircle.style.boxShadow = `0 0 20px ${appColor}b3`;
            
            mainContent.classList.add('content-blurred');
            loadingOverlay.classList.add('visible');

            setTimeout(() => {
                loadingCircle.classList.add('appear'); 
            }, 10);

            setTimeout(() => {
                loadingCircle.classList.add('rotate');
                setTimeout(() => {
                    window.open(href, target);
                    setTimeout(() => {
                        mainContent.classList.remove('content-blurred');
                        loadingOverlay.classList.remove('visible');
                        loadingLogo.src = "";
                    }, TEMPO_LIMPEZA);

                }, TEMPO_GIRAR);

            }, TEMPO_APARECER + TEMPO_ESPERA);
        });
    });
