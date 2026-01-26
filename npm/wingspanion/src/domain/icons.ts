const CATEGORY_ICON_BASE = `${import.meta.env.BASE_URL}/misc/categories`;

export function preloadCategoryIcons(categoryIds: string[]) {
    categoryIds.forEach(id => {
        const img = new Image();
        img.src = `${CATEGORY_ICON_BASE}/${id}.webp`;
    });
}