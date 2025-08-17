import { shuffleArray, formatTitle, formatPhotoTitle } from './utilities.js';

const generateImageList = () => {
    const watermarkedFiles = [
        '2014 Charger (Grey Chevron)_watermarked.png', '2016 FPIU_watermarked.jpg', '2020 FPIU (1)_watermarked.jpg',
        '2020 FPIU (Ghosted)_watermarked.jpg', 'AtlantaPD_watermarked.png', 'AtlantaPDWorn_watermarked.png',
        'Corrections_watermarked.png', 'DadeCity_watermarked.png', 'DadeCounty_watermarked.png',
        'DadeCountyFlag_watermarked.png', 'Fairfax1_watermarked.png', 'FallsChurch1_watermarked.png',
        'FHP_watermarked.png', 'Forensics_watermarked.jpg', 'Houston PD 2016 FPIU_watermarked.jpg',
        'LakeCounty_watermarked.png', 'LSPD1_watermarked.png', 'LSPD2_watermarked.png',
        'LSPDPatch1_watermarked.png', 'LSPDPatch2_watermarked.png', 'LSPDPatch3_watermarked.png',
        'LSPDPatch4_watermarked.png', 'LSPDPatch5_watermarked.png', 'LSPDPatch6_watermarked.png',
        'LSPDPatch7_watermarked.png', 'LSPDPatch8_watermarked.png', 'Nevada_watermarked.png',
        'NewPortRichey1_watermarked.png', 'NewPortRicheyNew_watermarked.webp', 'NewPortRicheyOld_watermarked.png',
        'ParkRanger2_watermarked.png', 'ParkRanger3_watermarked.png', 'ParkRanger4_watermarked.png',
        'Pasco_watermarked.png', 'Pasco2_watermarked.png', 'PascoFire1_watermarked.png',
        'PascoFire2_watermarked.png', 'PascoFire3_watermarked.png', 'PascoFire4_watermarked.png',
        'PascoFire5_watermarked.png', 'pascoFire6_watermarked.png', 'PascoFire7_watermarked.png',
        'PortRichey_watermarked.png', 'PortRichey2_watermarked.png',
        'PortRichey4_watermarked.png', 'PortRicheyAgain_watermarked.png', 'PrinceWIlliamCounty_watermarked.png',
        'Prisoner Transport_watermarked.jpg', 'roundlake_watermarked.jpg', 'Rump Sheriff_watermarked.jpg',
        'SaltLake2013_watermarked.png', 'SaltLake2016_watermarked.png', 'SaltLake2020_watermarked.png',
        'SantaBarbara1_watermarked.png', 'SantaBarbara2_watermarked.png',
        'TEU_watermarked.jpg', 'TravisCounty_watermarked.png', 'VirginaParkRanger_watermarked.png',
        'WilmingtonFD_watermarked.png', 'Wisconsin_watermarked.png'
    ];
    const imageList = watermarkedFiles.map((filename, index) => ({
        id: index + 1,
        src: `assets/png/watermarked/${filename}`,
        title: formatTitle(filename),
        description: ''
    }));
    return shuffleArray(imageList);
};

const generatePhotographyList = () => {
    const photoFiles = ['Fire.png', 'Salt.png'];
    return photoFiles.map((filename, index) => ({
        id: index + 1,
        src: `assets/png/photos/${filename}`,
        title: formatPhotoTitle(filename),
        description: ''
    }));
};

// Centralized state for the application
export const state = {
    portfolioImages: [],
    photographyImages: [],
    activeImageList: [],
    currentImageIndex: 0,
    photographyGalleryLoaded: false,
    currentPage: 'portfolio',
};

// Initialize the image lists
state.portfolioImages = generateImageList();
state.photographyImages = generatePhotographyList();
state.activeImageList = state.portfolioImages;