class SelectRoleAnimation {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startAnimation());
        } else {
            this.startAnimation();
        }
    }

    startAnimation() {
        this.hideContent();
        this.revealContent();
    }

    hideContent() {
        const elements = document.body.children;
        Array.from(elements).forEach(child => {
            child.style.opacity = '0';
            child.style.transition = 'none';
        });

        const textElements = document.querySelectorAll('h1, h2');
        textElements.forEach(text => {
            text.style.transform = 'translateY(-30px)';
        });

        const otherElements = document.querySelectorAll('.div-button');
        otherElements.forEach(elem => {
            elem.style.transform = 'translateY(30px)';
        });

        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.style.transform = 'translateY(30px)';
        }
    }

    revealContent() {
        const mainElements = [
            { selector: '.back-button', direction: 'up' },
            { selector: 'h1', direction: 'down' },
            { selector: 'h2', direction: 'down' },
            { selector: '.div-button', direction: 'up' }
        ];

        mainElements.forEach((item, index) => {
            const element = document.querySelector(item.selector);
            if (element) {
                setTimeout(() => {
                    element.style.transition = 'all 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });

        setTimeout(() => {
            const images = document.querySelectorAll('.div-button img');
            images.forEach((img, index) => {
                setTimeout(() => {
                    img.style.transition = 'all 0.5s ease-out';
                    img.style.opacity = '1';
                    img.style.transform = 'translateY(0) scale(1)';
                }, index * 150);
            });
        }, 800);

        setTimeout(() => {
            const allElements = document.body.children;
            Array.from(allElements).forEach((child, index) => {
                if (child.style.opacity === '0') {
                    setTimeout(() => {
                        child.style.transition = 'all 0.5s ease-out';
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 80);
                }
            });
        }, 1200);

        this.setupHoverEffects();
    }

    setupHoverEffects() {
        const images = document.querySelectorAll('.div-button img');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.transform = 'scale(1.05)';
                img.style.transition = 'transform 0.3s ease-out';
            });
            
            img.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.transition = 'transform 0.3s ease-out';
            });
        });

        const backButton = document.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('mouseenter', () => {
                backButton.style.transform = 'translateY(-5px) scale(1.02)';
                backButton.style.transition = 'transform 0.3s ease-out';
            });
            
            backButton.addEventListener('mouseleave', () => {
                backButton.style.transform = 'translateY(0) scale(1)';
                backButton.style.transition = 'transform 0.3s ease-out';
            });
        }
    }
}

const selectRoleAnimation = new SelectRoleAnimation();