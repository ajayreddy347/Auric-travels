export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'perk' | 'sanctuary' | 'concierge';
  actionView?: string;
  actionPayload?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Dedicated Concierge Assigned',
    message: 'Travel Architect Vikram Seth is standing by for your bespoke itinerary revisions and private jet transfers.',
    timestamp: '10m ago',
    read: false,
    type: 'concierge',
    actionView: 'account',
  },
  {
    id: 'notif-2',
    title: 'New Sanctuary Added: Amalfi Coast',
    message: 'Villa TreVille & Cliffside Suites in Positano now available with exclusive Sovereign Member private yacht access.',
    timestamp: '2h ago',
    read: false,
    type: 'sanctuary',
    actionView: 'destinations',
    actionPayload: 'amalfi-coast',
  },
  {
    id: 'notif-3',
    title: 'Autumn Voyager Privileges Active',
    message: 'Complimentary vintage champagne tasting and private palace curator walkthroughs enabled for upcoming bookings.',
    timestamp: '1d ago',
    read: false,
    type: 'perk',
    actionView: 'account',
  },
  {
    id: 'notif-4',
    title: 'Booking Confirmed: Taj Lake Palace',
    message: 'Grand Royal Suite reserved in Udaipur for 2 guests. Confirmation reference AUR-RES-7821.',
    timestamp: '2d ago',
    read: true,
    type: 'booking',
    actionView: 'bookings',
  },
];
