import type { Customer } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Sofia Rossi',
    email: 'sofia.r@example.com',
    phone: '+39 331 123 4567',
    points: 450,
    savedPaymentMethod: {
      last4: '4242',
      brand: 'visa'
    }
  },
  {
    id: 'cust-2',
    name: 'Marco Bianchi',
    email: 'marco.b@example.com',
    phone: '+39 332 987 6543',
    points: 120,
    savedPaymentMethod: {
      last4: '5555',
      brand: 'mastercard'
    }
  },
  {
    id: 'cust-3',
    name: 'Giulia Colombo',
    email: 'giulia.c@example.com',
    phone: '+39 333 456 7890',
    points: 850,
  }
];
