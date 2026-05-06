export type UserRole = 'admin' | 'dean' | 'student';

export interface Student {
  uid: string;
  name: string;
  roll: string;
  phone: string;
  hostel: 'boys' | 'girls';
  room: string;
  status: 'in' | 'out';
  createdAt: string;
}

export interface Entry {
  id: string;
  uid: string;
  name: string;
  roll: string;
  hostel: 'boys' | 'girls';
  room: string;
  type: 'in' | 'out' | 'visitor';
  photoURL: string;
  location: { lat: number; lng: number };
  timestamp: string;
  time: string;
  date: string;
  visitorName?: string;
  visitorPhone?: string;
  reason?: string;
  hostStudentName?: string;
}

export const MOCK_STUDENTS: Student[] = [
  {
    uid: 's1',
    name: 'Rakesh Kumar',
    roll: '2021CS001',
    phone: '+917375923307',
    hostel: 'boys',
    room: '101',
    status: 'in',
    createdAt: new Date().toISOString(),
  },
  {
    uid: 's2',
    name: 'Priya Sharma',
    roll: '2021CS002',
    phone: '+919876543210',
    hostel: 'girls',
    room: '202',
    status: 'out',
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_ENTRIES: Entry[] = [
  {
    id: 'e1',
    uid: 's1',
    name: 'Rakesh Kumar',
    roll: '2021CS001',
    hostel: 'boys',
    room: '101',
    type: 'in',
    photoURL: 'https://picsum.photos/seed/s1/400/400',
    location: { lat: 26.9124, lng: 75.7873 },
    timestamp: new Date().toISOString(),
    time: '08:30 AM',
    date: '2023-10-27',
  },
  {
    id: 'e2',
    uid: 's1',
    name: 'Rakesh Kumar',
    roll: '2021CS001',
    hostel: 'boys',
    room: '101',
    type: 'visitor',
    photoURL: 'https://picsum.photos/seed/v1/400/400',
    location: { lat: 26.9124, lng: 75.7873 },
    timestamp: new Date().toISOString(),
    time: '10:15 AM',
    date: '2023-10-27',
    visitorName: 'Sunil Kumar',
    visitorPhone: '+919998887776',
    reason: 'Parent Meeting',
    hostStudentName: 'Rakesh Kumar',
  }
];
