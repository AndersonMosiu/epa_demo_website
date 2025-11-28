export interface NewsItem {
  _id?: string;
  id?: number;
  title: string;
  summary: string;
  content?: string;
  date: string;
  category: string;
  imageUrl?: string;
  isFeatured?: boolean;
  author?: string;
  status?: 'draft' | 'published';
}

export interface EventItem {
  _id?: string;
  id?: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'event' | 'sports' | 'academic' | 'cultural';
  audience?: 'students' | 'parents' | 'staff' | 'all';
  registrationRequired?: boolean;
  registrationLink?: string;
  imageUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}