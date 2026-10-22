import rawGallery from './gallery.json';

export interface GalleryItem {
  id: string;
  filename: string;
  webFilename: string;
  src: string;
  thumbSrc: string;
  origSrc: string;
  title: string;
  category: string;
  categoryLabel: string;
  event: string;
  description: string;
  featured: boolean;
  tags: string[];
  width: number;
  height: number;
  thumbWidth: number;
  thumbHeight: number;
  aspectRatio: number;
  orientation: 'landscape' | 'portrait';
  originalSizeMb: number;
  webSizeKb: number;
  thumbSizeKb: number;
}

export const GALLERY_ITEMS: GalleryItem[] = rawGallery as GalleryItem[];

export interface GalleryCategoryOption {
  id: string;
  label: string;
  count: number;
  description?: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryOption[] = [
  { id: 'all', label: 'All Photos', count: GALLERY_ITEMS.length, description: 'Complete archive of official symposium and conference photographs' },
  { id: 'corsym', label: 'CORSYM 2024', count: GALLERY_ITEMS.filter(i => i.category === 'corsym').length, description: 'International Corrosion Prevention Symposium for Research Scholars (17-18 Feb 2024)' },
  { id: 'rsccm', label: 'RSCCM 2024', count: GALLERY_ITEMS.filter(i => i.category === 'rsccm').length, description: 'Recent Scenario of Corrosion Control & Management National Seminar (21 Sept 2024)' },
  { id: 'dignitaries', label: 'Dignitaries & Ceremonies', count: GALLERY_ITEMS.filter(i => i.category === 'dignitaries').length, description: 'Auspicious lamp lighting, souvenir release & global AMPP leadership' },
  { id: 'technical', label: 'Technical Sessions & Keynotes', count: GALLERY_ITEMS.filter(i => i.category === 'presentations' || i.category === 'academic' || i.category === 'technical').length, description: 'Keynotes, paper presentations, mementos, and research felicitation' },
  { id: 'cultural', label: 'Networking & Discussions', count: GALLERY_ITEMS.filter(i => i.category === 'cultural' || i.category === 'committee').length, description: 'Delegate interactions, technical debates & tea break networking' },
];

export function getFeaturedGalleryItems(): GalleryItem[] {
  return GALLERY_ITEMS.filter(item => item.featured);
}

export function getGalleryByCategory(category: string): GalleryItem[] {
  if (!category || category === 'all') return GALLERY_ITEMS;
  if (category === 'technical') {
    return GALLERY_ITEMS.filter(i => i.category === 'presentations' || i.category === 'academic' || i.category === 'technical');
  }
  if (category === 'cultural' || category === 'networking') {
    return GALLERY_ITEMS.filter(i => i.category === 'cultural' || i.category === 'committee');
  }
  return GALLERY_ITEMS.filter(item => item.category === category);
}

export function getGalleryItemById(id: string): GalleryItem | undefined {
  return GALLERY_ITEMS.find(item => item.id === id);
}

export function searchGallery(query: string): GalleryItem[] {
  if (!query || !query.trim()) return GALLERY_ITEMS;
  const q = query.toLowerCase().trim();
  return GALLERY_ITEMS.filter(item => 
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.event.toLowerCase().includes(q) ||
    item.tags.some(t => t.toLowerCase().includes(q))
  );
}
