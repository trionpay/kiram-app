export interface AdminUserRow {
  id: string;
  phone: string;
  name: string;
  suspended: boolean;
  registeredAt: string;
}

export const initialMockUsers: AdminUserRow[] = [
  {
    id: 'u1',
    phone: '+90 532 111 2233',
    name: 'Ayşe Yılmaz',
    suspended: false,
    registeredAt: '2025-03-10',
  },
  {
    id: 'u2',
    phone: '+90 533 444 5566',
    name: 'Mehmet Kaya',
    suspended: false,
    registeredAt: '2025-03-18',
  },
  {
    id: 'u3',
    phone: '+90 534 777 8899',
    name: 'Zeynep Demir',
    suspended: true,
    registeredAt: '2025-02-01',
  },
  {
    id: 'u4',
    phone: '+90 535 000 1122',
    name: 'Can Öztürk',
    suspended: false,
    registeredAt: '2025-03-22',
  },
];
