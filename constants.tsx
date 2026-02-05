
import { Service, SocialPost } from './types';

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Gel Toes Only',
    description: 'Professional gel application for toes, providing long-lasting shine and durability.',
    price: 'R 180',
    duration: '1 hr',
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=1200&auto=format&fit=crop',
    category: 'Feet'
  },
  {
    id: '2',
    name: 'Gelish Hands (Rubber Base)',
    description: 'Strengthening rubber base application on natural nails with a premium Gelish finish.',
    price: 'R 250',
    duration: '1 hr 20 min',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1200&auto=format&fit=crop',
    category: 'Nails'
  },
  {
    id: '3',
    name: 'Acrylic/Polygel French',
    description: 'Expertly crafted acrylic or polygel nails with free-hand French art for a timeless look.',
    price: 'R 380',
    duration: '1 hr 50 min',
    image: 'https://images.unsplash.com/photo-1634712282287-14ed57b9cc89?q=80&w=1200&auto=format&fit=crop',
    category: 'Nails'
  },
  {
    id: '4',
    name: 'Acrylic Tips with Gelish',
    description: 'Full set of acrylic tips finished with your choice of vibrant gelish colors.',
    price: 'R 330',
    duration: '1 hr',
    image: 'https://images.unsplash.com/photo-1516252233870-df03dd358896?q=80&w=1200&auto=format&fit=crop',
    category: 'Nails'
  },
  {
    id: '5',
    name: 'Eyebrow Shaping & Tint',
    description: 'Precision mapping and tinting to define your natural brow structure.',
    price: 'R 120',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=1200&auto=format&fit=crop',
    category: 'Face'
  },
  {
    id: '6',
    name: 'Special Occasion Makeup',
    description: 'Full glam or natural transformation tailored for weddings, events, or photoshoots.',
    price: 'R 550',
    duration: '90 min',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop',
    category: 'Makeup'
  },
  {
    id: '7',
    name: 'Gents Deluxe Manicure',
    description: 'Clean, professional nail care tailored specifically for the modern gentleman.',
    price: 'R 220',
    duration: '45 min',
    image: 'https://images.unsplash.com/photo-1519415510236-85591148f82f?q=80&w=1200&auto=format&fit=crop',
    category: 'Gents'
  },
  {
    id: '8',
    name: 'Full Body Waxing',
    description: 'Smooth, effective hair removal using premium wax suitable for sensitive skin.',
    price: 'R 450',
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1559599141-3816a0b3f11d?q=80&w=1200&auto=format&fit=crop',
    category: 'Waxing'
  }
];

export const SOCIAL_POSTS: SocialPost[] = [
  {
    id: 's1',
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=800&auto=format&fit=crop',
    caption: 'Chic pedicure with neutral polish at TA\'s Beauty Lounge, Midrand. The perfect Saturday treat. 💖',
    date: '2 hours ago'
  },
  {
    id: 's2',
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1512496011220-fd2b096874a9?q=80&w=800&auto=format&fit=crop',
    caption: 'Comfortable beauty chairs waiting for you. Relax and rejuvenate in our Halfway Gardens sanctuary.',
    date: 'Yesterday'
  },
  {
    id: 's3',
    platform: 'instagram',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
    caption: 'Acrylic artistry at its finest. Book with Portia for your next custom set!',
    date: '3 days ago'
  }
];
