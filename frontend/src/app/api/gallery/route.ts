import { NextRequest, NextResponse } from 'next/server';
import { GALLERY_ITEMS, GALLERY_CATEGORIES, getGalleryByCategory, searchGallery, getFeaturedGalleryItems } from '@/data/gallery';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search') || searchParams.get('q');
    const id = searchParams.get('id');

    if (id) {
      const item = GALLERY_ITEMS.find(i => i.id === id);
      if (!item) {
        return NextResponse.json({ success: false, error: 'Photo not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, item });
    }

    let results = GALLERY_ITEMS;

    if (featured === 'true' || featured === '1') {
      results = getFeaturedGalleryItems();
    } else if (category && category !== 'all') {
      results = getGalleryByCategory(category);
    }

    if (search) {
      const q = search.toLowerCase().trim();
      results = results.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.event.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      total: results.length,
      categories: GALLERY_CATEGORIES,
      photos: results
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}
