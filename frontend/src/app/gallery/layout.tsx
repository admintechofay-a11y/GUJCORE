import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Conference Photo Gallery & Symposia Archive | GUJCORR 2027',
  description: 'Explore archival photographs from CORSYM 2024 and RSCCM 2024 symposia organized in association with AMPP India Chapter, The M.S. University of Baroda, and IIM Baroda Chapter. High-resolution captures of lamp lighting ceremonies, souvenir releases, keynote lectures, and technical sessions.',
  keywords: [
    'GUJCORR Photo Gallery',
    'CORSYM 2024 photos',
    'RSCCM 2024 photos',
    'AMPP India Chapter gallery',
    'Dr Sunil Kahar',
    'Dr Vandana Rao',
    'Prof Amir Eliezer',
    'Corrosion Conference Vadodara',
    'Corrosion Symposium Photographs'
  ],
  openGraph: {
    title: 'GUJCORR 2027 Photo Gallery & Past Editions Archive',
    description: 'Visual highlights of past international symposiums on corrosion science, asset integrity, and protective coatings.',
    url: 'https://www.gujcorr.org/gallery',
    images: [
      {
        url: '/images/gallery/full/481987111_967586345483113_7352503268079112458_n.jpg',
        width: 1500,
        height: 1000,
        alt: 'GUJCORR Conference Photo Archive - CORSYM 2024 Souvenir Release'
      }
    ]
  }
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
