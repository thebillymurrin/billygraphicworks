/* === PASTE THIS ENTIRE BLOCK INTO js/app.js === */

import { initNavigation } from './modules/navigation.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initGallery();
    initLightbox();
});