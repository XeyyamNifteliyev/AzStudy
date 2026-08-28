import type { Dormitory } from '@/types';
import { seedImages } from './images';

export const seedDormitories: Dormitory[] = [
  {
    id: 'd-1',
    universityId: 'u-bsu',
    capacity: 2000,
    pricePerMonth: 100,
    currency: 'USD',
    photos: [seedImages.dorm, seedImages.dorm2],
  },
  {
    id: 'd-2',
    universityId: 'u-ada',
    capacity: 800,
    pricePerMonth: 250,
    currency: 'USD',
    photos: [seedImages.dorm2, seedImages.dorm],
  },
  {
    id: 'd-3',
    universityId: 'u-odu',
    capacity: 1500,
    pricePerMonth: 80,
    currency: 'USD',
    photos: [seedImages.dorm, seedImages.campusBuilding],
  },
  {
    id: 'd-4',
    universityId: 'u-gtu',
    capacity: 1200,
    pricePerMonth: 60,
    currency: 'USD',
    photos: [seedImages.dorm2, seedImages.dorm],
  },
  {
    id: 'd-5',
    universityId: 'u-sdu',
    capacity: 1000,
    pricePerMonth: 70,
    currency: 'USD',
    photos: [seedImages.dorm, seedImages.dorm2],
  },
];
