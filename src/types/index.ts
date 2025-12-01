

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  specifications: string;
  applications: string;
  imageUrl: string;
  imageEffect?: 'center-fill' | 'blur-background' | 'solid-background';
};

export type ProductCategory = {
  id: string;
  name: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  date: string; // ISO 8601 string
  author: string;
  category: string;
  summary: string;
  content: string; // HTML content
  imageUrl: string;
};
