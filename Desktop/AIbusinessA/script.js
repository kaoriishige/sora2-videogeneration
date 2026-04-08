document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lpForm');
    const formMessage = document.getElementById('formMessage');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Check validation
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Simple loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '決済ページへ移動中...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                shop: formData.get('shop'),
                email: formData.get('email'),
                tel: formData.get('tel'),
                industry: formData.get('industry_select'),
                website: formData.get('website')
            };

            try {
                // Call Netlify function (using the redirect defined in netlify.toml)
                const response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || '決済サーバーの起動に失敗しました。');
                }

                const result = await response.json();
                
                // Redirect to Stripe Checkout page
                if (result.url) {
                    window.location.href = result.url;
                } else {
                    throw new Error('決済URLの取得に失敗しました。');
                }

            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = 'エラーが発生しました: ' + error.message;
                formMessage.style.color = '#ef4444';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass, .ceo-card, .service-card').forEach(el => {
        observer.observe(el);
    });
});
