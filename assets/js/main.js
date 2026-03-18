// Navigation scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile hamburger toggle
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
});

// Smooth scrolling for same-page anchor links
document.querySelectorAll('a[href]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        let hash = null;

        // Pure anchor like #about
        if (href.startsWith('#')) {
            hash = href;
        }
        // Link like /#about on the homepage
        else if (href.match(/^\/?#/) && window.location.pathname === '/') {
            hash = href.replace(/^\/?/, '');
        }

        if (hash) {
            const target = document.querySelector(hash);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
});

// Copy as Markdown button handler
document.addEventListener('DOMContentLoaded', function() {
    const copyBtn = document.querySelector('.copy-markdown-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const title = this.dataset.articleTitle;
            const date = this.dataset.articleDate;
            const url = this.dataset.articleUrl;
            const articleContent = document.querySelector('.article-content');

            var turndownService = new TurndownService({
                headingStyle: 'atx',
                codeBlockStyle: 'fenced'
            });

            var markdown = turndownService.turndown(articleContent.innerHTML);

            var header = '# ' + title + '\n\n'
                + '**Patrick McFadin** | **' + date + '** | **[Source](' + url + ')**\n\n---\n\n';

            var fullMarkdown = header + markdown;

            navigator.clipboard.writeText(fullMarkdown).then(function() {
                var icon = copyBtn.querySelector('i');
                var originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyBtn.classList.add('copied');
                setTimeout(function() {
                    copyBtn.innerHTML = originalHTML;
                    copyBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
