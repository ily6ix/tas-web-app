
export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  image: string;
  category: 'Nails' | 'Feet' | 'Face' | 'Makeup' | 'Waxing' | 'Gents';
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram';
  image: string;
  caption: string;
  date: string;
}

export interface BookingDetails {
  serviceId: string;
  date: string;
  time: string;
  name: string;
  email: string;
}
