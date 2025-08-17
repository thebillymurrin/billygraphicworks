/* === PASTE THIS ENTIRE BLOCK INTO js/modules/gallery.js === */

import { state } from './state.js';
import { openLightbox } from './lightbox.js';

let observer;

const loadImage = (imageItem) => {
    const src = imageItem.dataset.src;
    if (!src) return;

    const img = new Image();
    img.onload = () => displayImage(imageItem, src);
    img.onerror = () => {
        const imageList = imageItem.dataset.galleryId === 'gallery' ? state.portfolioImages : state.photographyImages;
        const index = parseInt(imageItem.dataset.index, 10);
        imageItem.innerHTML = `
            <div class="image-error">Failed to load</div>
            <div class="image-overlay">
                <div class="image-title">${imageList[index].title}</div>
            </div>
        `;
    };
    img.src = src;
};

const displayImage = (imageItem, src) => {
    const imageList = imageItem.dataset.galleryId === 'gallery' ? state.portfolioImages : state.photographyImages;
    const index = parseInt(imageItem.dataset.index, 10);
    const img = document.createElement('img');

    img.src = src;
    img.alt = imageList[index].title;
    img.loading = 'lazy';
    img.decoding = 'async';

    const placeholder = imageItem.querySelector('.image-placeholder');
    if (placeholder) {
        placeholder.replaceWith(img);
    }

    imageItem.classList.remove('loading-placeholder');
    imageItem.classList.add('loaded');
};

export const renderGallery = (imageList, galleryId) => {
    const gallery = document.getElementById(galleryId);
    gallery.innerHTML = '';
    const fragment = document.createDocumentFragment();

    imageList.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item loading-placeholder';
        imageItem.dataset.index = index;
        imageItem.dataset.src = image.src;
        imageItem.dataset.galleryId = galleryId;

        imageItem.innerHTML = `
            <div class="image-placeholder"><div class="placeholder-shimmer"></div></div>
            <div class="image-overlay">
                <div class="image-title">${image.title}</div>
                <div class="image-description">${image.description}</div>
            </div>
        `;
        fragment.appendChild(imageItem);
        observer.observe(imageItem);
    });

    gallery.appendChild(fragment);
};

const preloadFirstImages = (imageList) => {
    for (let i = 0; i < Math.min(6, imageList.length); i++) {
        const img = new Image();
        img.src = imageList[i].src;
    }
};

export const initGallery = () => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadImage(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px' });

    renderGallery(state.portfolioImages, 'gallery');
    preloadFirstImages(state.portfolioImages);

    // Event Listeners
    document.querySelector('.content-container').addEventListener('click', (e) => {
        const imageItem = e.target.closest('.image-item');
        if (imageItem && imageItem.dataset.index) {
            const index = parseInt(imageItem.dataset.index, 10);
            const galleryId = imageItem.dataset.galleryId;
            state.activeImageList = galleryId === 'gallery' ? state.portfolioImages : state.photographyImages;
            openLightbox(index);
        }
    });
};