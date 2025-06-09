
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  longDescription?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  eventDate?: string;
}

export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export interface NavLinkItem {
  label: string;
  path: string;
}
