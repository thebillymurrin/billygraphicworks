/* === PASTE THIS ENTIRE BLOCK INTO js/modules/navigation.js === */

import { state } from './state.js';
import { renderGallery } from './gallery.js';

const pages = {
    portfolio: document.getElementById('gallery'),
    photography: document.getElementById('photography-gallery'),
    about: document.getElementById('about-page')
};
const navButtons = {
    portfolio: document.getElementById('portfolio-nav'),
    photography: document.getElementById('photography-nav'),
    about: document.getElementById('about-nav')
};

const showPage = (page) => {
    if (state.currentPage === page) return;
    state.currentPage = page;

    Object.values(pages).forEach(p => p.classList.remove('active'));
    Object.values(navButtons).forEach(b => b.classList.remove('active'));

    pages[page].classList.add('active');
    navButtons[page].classList.add('active');

    if (page === 'photography' && !state.photographyGalleryLoaded) {
        renderGallery(state.photographyImages, 'photography-gallery');
        state.photographyGalleryLoaded = true;
    }
};

export const initNavigation = () => {
    navButtons.portfolio.addEventListener('click', () => showPage('portfolio'));
    navButtons.photography.addEventListener('click', () => showPage('photography'));
    navButtons.about.addEventListener('click', () => showPage('about'));

    // Hamburger menu logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navContainer = document.querySelector('.main-nav');
    hamburgerBtn.addEventListener('click', () => {
        navContainer.classList.toggle('active');
    });

    // Set initial page
    showPage('portfolio');
};