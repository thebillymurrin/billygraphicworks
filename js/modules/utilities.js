export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function formatTitle(filename) {
    return filename.replace(/_watermarked\.(png|jpg|webp)$/i, '').replace(/([A-Z])/g, ' $1').replace(/^\s+/, '').replace(/\s+/g, ' ').trim();
}

export function formatPhotoTitle(filename) {
    return filename.replace(/\.(png|jpg|webp)$/i, '').replace(/([A-Z])/g, ' $1').replace(/^\s+/, '').replace(/\s+/g, ' ').trim();
}