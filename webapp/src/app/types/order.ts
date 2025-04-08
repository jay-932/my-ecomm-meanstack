import { CartItem } from './cartItem';

export interface Order {
  _id?: string;
  items: CartItem[];
  paymentType: string;
  address: any;
  date: Date;
  totalPrice: number;
  status?: string;
  cancelReason?: string;
  cancelledBy?: 'user' | 'admin';

  // ✅ Add this to include user info from backend
  userId?: {
    _id?: string;
    name?: string;
    email?: string;
  };
}
