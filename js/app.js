class PortfolioViewer {
    constructor() {
        // Auto-generate image list from watermarked assets
        this.images = this.generateImageList();
        this.loadedImages = new Set();
        this.imageCache = new Map();
        this.currentImageIndex = 0;
        this.viewMode = 'grid';
        this.currentPage = 'portfolio';
        this.observer = null;

        this.init();
    }

    generateImageList() {
        const watermarkedFiles = [
            '2014 Charger (Grey Chevron)_watermarked.png',
            '2016 FPIU_watermarked.jpg',
            '2020 FPIU (1)_watermarked.jpg',
            '2020 FPIU (Ghosted)_watermarked.jpg',
            'AtlantaPD_watermarked.png',
            'AtlantaPDWorn_watermarked.png',
            'Corrections_watermarked.png',
            'DadeCity_watermarked.png',
            'DadeCounty_watermarked.png',
            'DadeCountyFlag_watermarked.png',
            'Fairfax1_watermarked.png',
            'FallsChurch1_watermarked.png',
            'FHP_watermarked.png',
            'Forensics_watermarked.jpg',
            'Houston PD 2016 FPIU_watermarked.jpg',
            'LakeCounty_watermarked.png',
            'LSPD1_watermarked.png',
            'LSPD2_watermarked.png',
            'LSPDPatch1_watermarked.png',
            'LSPDPatch2_watermarked.png',
            'LSPDPatch3_watermarked.png',
            'LSPDPatch4_watermarked.png',
            'LSPDPatch5_watermarked.png',
            'LSPDPatch6_watermarked.png',
            'LSPDPatch7_watermarked.png',
            'LSPDPatch8_watermarked.png',
            'Nevada_watermarked.png',
            'NewPortRichey1_watermarked.png',
            'NewPortRicheyNew_watermarked.webp',
            'NewPortRicheyOld_watermarked.png',
            'ParkRanger2_watermarked.png',
            'ParkRanger3_watermarked.png',
            'ParkRanger4_watermarked.png',
            'Pasco_watermarked.png',
            'Pasco2_watermarked.png',
            'PascoFire1_watermarked.png',
            'PascoFire2_watermarked.png',
            'PascoFire3_watermarked.png',
            'PascoFire4_watermarked.png',
            'PascoFire5_watermarked.png',
            'pascoFire6_watermarked.png',
            'PascoFire7_watermarked.png',
            'Photography_watermarked.png',
            'PortRichey_watermarked.png',
            'PortRichey2_watermarked.png',
            'PortRichey4_watermarked.png',
            'PortRicheyAgain_watermarked.png',
            'PrinceWIlliamCounty_watermarked.png',
            'Prisoner Transport_watermarked.jpg',
            'roundlake_watermarked.jpg',
            'Rump Sheriff_watermarked.jpg',
            'SaltLake2013_watermarked.png',
            'SaltLake2016_watermarked.png',
            'SaltLake2020_watermarked.png',
            'SaltLakePhoto_watermarked.png',
            'SantaBarbara1_watermarked.png',
            'SantaBarbara2_watermarked.png',
            'TEU_watermarked.jpg',
            'TravisCounty_watermarked.png',
            'VirginaParkRanger_watermarked.png',
            'WilmingtonFD_watermarked.png',
            'Wisconsin_watermarked.png'
        ];

        // Create image objects
        const imageList = watermarkedFiles.map((filename, index) => {
            const title = this.formatTitle(filename);
            return {
                id: index + 1,
                src: `assets/png/watermarked/${filename}`,
                title: title,
                description: ''
            };
        });

        // Randomize the order using Fisher-Yates shuffle
        return this.shuffleArray(imageList);
    }

    shuffleArray(array) {
        const shuffled = [...array]; // Create a copy to avoid mutating original
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    formatTitle(filename) {
        // Remove _watermarked and file extension, then format
        return filename
            .replace(/_watermarked\.(png|jpg|webp)$/i, '')
            .replace(/([A-Z])/g, ' $1')
            .replace(/^\s+/, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    init() {
        // Initialize portfolio as active page FIRST
        this.initializePage();
        this.setupIntersectionObserver();
        this.renderInitialGallery();
        this.bindEvents();
        this.preloadFirstImages();
    }

    initializePage() {
        const gallery = document.getElementById('gallery');
        const aboutPage = document.getElementById('about-page');
        
        // Set initial states immediately
        gallery.classList.add('active');
        aboutPage.classList.remove('active');
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });
    }

    renderInitialGallery() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '<div class="loading">Loading images...</div>';

        // Use requestAnimationFrame for smooth rendering
        requestAnimationFrame(() => {
            this.renderGalleryBatch(0);
        });
    }

    renderGalleryBatch(startIndex) {
        const gallery = document.getElementById('gallery');
        const batchSize = 10;
        const endIndex = Math.min(startIndex + batchSize, this.images.length);

        if (startIndex === 0) {
            gallery.innerHTML = '';
        }

        const fragment = document.createDocumentFragment();

        for (let i = startIndex; i < endIndex; i++) {
            const image = this.images[i];
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item loading-placeholder';
            imageItem.dataset.index = i;
            imageItem.dataset.src = image.src;

            imageItem.innerHTML = `
                <div class="image-placeholder">
                    <div class="placeholder-shimmer"></div>
                </div>
                <div class="image-overlay">
                    <div class="image-title">${image.title}</div>
                    <div class="image-description">${image.description}</div>
                </div>
            `;

            fragment.appendChild(imageItem);
            this.observer.observe(imageItem);
        }

        gallery.appendChild(fragment);

        // Continue rendering next batch
        if (endIndex < this.images.length) {
            setTimeout(() => {
                this.renderGalleryBatch(endIndex);
            }, 50);
        }
    }

    loadImage(imageItem) {
        if (imageItem.classList.contains('loaded')) return;

        const src = imageItem.dataset.src;
        const index = imageItem.dataset.index;

        // Check cache first
        if (this.imageCache.has(src)) {
            this.displayImage(imageItem, this.imageCache.get(src));
            return;
        }

        const img = new Image();
        img.onload = () => {
            this.imageCache.set(src, img.src);
            this.displayImage(imageItem, img.src);
            this.loadedImages.add(index);
        };

        img.onerror = () => {
            imageItem.innerHTML = `
                <div class="image-error">Failed to load</div>
                <div class="image-overlay">
                    <div class="image-title">${this.images[index].title}</div>
                    <div class="image-description">${this.images[index].description}</div>
                </div>
            `;
        };

        img.src = src;
    }

    displayImage(imageItem, src) {
        const img = document.createElement('img');
        img.src = src;
        img.alt = this.images[imageItem.dataset.index].title;
        img.loading = 'lazy';

        const placeholder = imageItem.querySelector('.image-placeholder');
        if (placeholder) {
            placeholder.replaceWith(img);
        }

        imageItem.classList.remove('loading-placeholder');
        imageItem.classList.add('loaded');
    }

    preloadFirstImages() {
        // Preload first 6 images for immediate display
        for (let i = 0; i < Math.min(6, this.images.length); i++) {
            const img = new Image();
            img.src = this.images[i].src;
            this.imageCache.set(this.images[i].src, img.src);
        }
    }

    bindEvents() {
        // Navigation between Portfolio and About
        document.getElementById('portfolio-nav').addEventListener('click', () => {
            this.showPage('portfolio');
        });

        document.getElementById('about-nav').addEventListener('click', () => {
            this.showPage('about');
        });

        // View mode toggle
        document.getElementById('grid-view').addEventListener('click', () => {
            this.setViewMode('grid');
        });

        document.getElementById('list-view').addEventListener('click', () => {
            this.setViewMode('list');
        });

        // Image click to open lightbox
        document.getElementById('gallery').addEventListener('click', (e) => {
            const imageItem = e.target.closest('.image-item');
            if (imageItem) {
                const index = parseInt(imageItem.dataset.index);
                this.openLightbox(index);
            }
        });

        // Lightbox controls
        document.getElementById('close-lightbox').addEventListener('click', () => {
            this.closeLightbox();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousImage();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextImage();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('lightbox').classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });

        // Close lightbox on background click
        document.getElementById('lightbox').addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') {
                this.closeLightbox();
            }
        });
    }

    setViewMode(mode) {
        this.viewMode = mode;
        const gallery = document.getElementById('gallery');
        const gridBtn = document.getElementById('grid-view');
        const listBtn = document.getElementById('list-view');

        if (mode === 'grid') {
            gallery.classList.remove('list-view');
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
        } else {
            gallery.classList.add('list-view');
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
        }
    }

    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.images[index];
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const imageTitle = document.getElementById('image-title');
        const imageDescription = document.getElementById('image-description');

        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
        imageTitle.textContent = image.title;
        imageDescription.textContent = image.description;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    updateLightboxImage() {
        const image = this.images[this.currentImageIndex];
        const lightboxImage = document.getElementById('lightbox-image');
        const imageTitle = document.getElementById('image-title');
        const imageDescription = document.getElementById('image-description');

        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
        imageTitle.textContent = image.title;
        imageDescription.textContent = image.description;
    }

    showPage(page) {
        const gallery = document.getElementById('gallery');
        const aboutPage = document.getElementById('about-page');
        const viewControls = document.querySelector('.view-controls');
        const portfolioBtn = document.getElementById('portfolio-nav');
        const aboutBtn = document.getElementById('about-nav');

        if (page === 'portfolio') {
            // Remove active from all pages first
            gallery.classList.remove('active');
            aboutPage.classList.remove('active');
            
            // Add active to portfolio after a brief delay for smooth transition
            setTimeout(() => {
                gallery.classList.add('active');
            }, 50);
            
            viewControls.style.opacity = '1';
            viewControls.style.pointerEvents = 'all';
            portfolioBtn.classList.add('active');
            aboutBtn.classList.remove('active');
            this.currentPage = 'portfolio';
        } else if (page === 'about') {
            // Remove active from all pages first
            gallery.classList.remove('active');
            aboutPage.classList.remove('active');
            
            // Add active to about after a brief delay for smooth transition
            setTimeout(() => {
                aboutPage.classList.add('active');
            }, 50);
            
            viewControls.style.opacity = '0';
            viewControls.style.pointerEvents = 'none';
            aboutBtn.classList.add('active');
            portfolioBtn.classList.remove('active');
            this.currentPage = 'about';
        }
    }
}

// Initialize the portfolio viewer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioViewer();
});