import { state } from './state.js';

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const imageTitle = document.getElementById('image-title');
const imageDescription = document.getElementById('image-description');

const updateLightboxImage = () => {
    const image = state.activeImageList[state.currentImageIndex];
    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    imageTitle.textContent = image.title;
    imageDescription.textContent = image.description;
};

const previousImage = () => {
    state.currentImageIndex = (state.currentImageIndex - 1 + state.activeImageList.length) % state.activeImageList.length;
    updateLightboxImage();
};

const nextImage = () => {
    state.currentImageIndex = (state.currentImageIndex + 1) % state.activeImageList.length;
    updateLightboxImage();
};

export const openLightbox = (index) => {
    state.currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
};

export const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
};

export const initLightbox = () => {
    document.getElementById('close-lightbox').addEventListener('click', closeLightbox);
    document.getElementById('prev-btn').addEventListener('click', previousImage);
    document.getElementById('next-btn').addEventListener('click', nextImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
};