document.addEventListener('DOMContentLoaded', () => {
    
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    
    mobileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = mainNav.classList.toggle('active');
        
        // Add history state to close the menu using the mobile back button
        if (isActive) {
            history.pushState({ menuOpen: true }, '');
        } else {
            if (history.state && history.state.menuOpen) {
                history.back();
            }
        }
    });

    // Close the menu when the device Back button is pressed
    window.addEventListener('popstate', (e) => {
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });

    // Close the menu when clicking anywhere outside of it
    document.addEventListener('click', (e) => {
        if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !mobileBtn.contains(e.target)) {
            mainNav.classList.remove('active');
            // Clear the virtual history state if closed by click
            if (history.state && history.state.menuOpen) {
                history.back();
            }
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (history.state && history.state.menuOpen) {
                    history.back();
                }
            }
        });
    });

    // Smooth scrolling for menu links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // AJAX form submission without redirection
    const form = document.getElementById('last-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '...';
            
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    const successMsg = form.getAttribute('data-success-msg') || 'Ευχαριστούμε! Το μήνυμά σας εστάλη.';
                    form.innerHTML = `
                        <div style="text-align: center; padding: 40px 10px;">
                            <svg style="width: 60px; height: 60px; color: var(--secondary-color); margin-bottom: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <h3 style="color: var(--primary-color); font-size: 1.3rem; line-height: 1.5;">${successMsg}</h3>
                        </div>
                    `;
                } else {
                    console.log(response);
                    btn.innerHTML = originalText;
                    alert('Σφάλμα / Error: ' + json.message);
                }
            })
            .catch(error => {
                console.log(error);
                btn.innerHTML = originalText;
                alert('Σφάλμα δικτύου / Network Error');
            });
        });
    }

        document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-selector')) {
            document.getElementById('lang-dropdown').classList.remove('show');
        }
    });
});

function toggleLangMenu() {
    document.getElementById('lang-dropdown').classList.toggle('show');
}