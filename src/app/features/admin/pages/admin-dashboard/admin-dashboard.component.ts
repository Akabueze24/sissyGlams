import { Component } from "@angular/core";
import { SalesDataPoint } from "../../sales point Model/sales-point.model";

interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: string;
}
 
type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
 
interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: OrderStatus;
}
 
interface BestSellingProduct {
  name: string;
  category: string;
  unitsSold: number;
  price: string;
  imageUrl: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class adminDashboardComponent {

   readonly stats: DashboardStat[] = [
    { label: 'Total Revenue', value: '\u20A61,250,000', trend: '+12.4% this month', trendDirection: 'up', icon: 'fa-solid fa-sack-dollar' },
    { label: 'Total Orders', value: '128', trend: '+8 today', trendDirection: 'up', icon: 'fa-solid fa-receipt' },
    { label: 'Total Customers', value: '542', trend: '+15 this week', trendDirection: 'up', icon: 'fa-solid fa-users' },
    { label: 'Total Products', value: '86', trend: '3 low in stock', trendDirection: 'down', icon: 'fa-solid fa-shirt' }
  ];
 
  // Passed straight into <app-sales-chart>. Library-agnostic shape —
  // see SalesDataPoint. DashboardComponent doesn't know or care how
  // this eventually gets rendered.
  readonly salesData: SalesDataPoint[] = [
    { label: 'Jan', value: 82000 },
    { label: 'Feb', value: 94500 },
    { label: 'Mar', value: 101000 },
    { label: 'Apr', value: 87500 },
    { label: 'May', value: 112000 },
    { label: 'Jun', value: 126500 },
    { label: 'Jul', value: 119000 },
    { label: 'Aug', value: 134000 },
    { label: 'Sep', value: 108500 },
    { label: 'Oct', value: 121000 },
    { label: 'Nov', value: 143000 },
    { label: 'Dec', value: 158500 }
  ];
 
  readonly recentOrders: RecentOrder[] = [
    { id: '#SG-1042', customer: 'Amara Chukwu', date: 'Aug 22, 2026', amount: '\u20A645,000', status: 'Processing' },
    { id: '#SG-1041', customer: 'Jin Park', date: 'Aug 22, 2026', amount: '\u20A618,500', status: 'Pending' },
    { id: '#SG-1040', customer: 'Bella Okafor', date: 'Aug 21, 2026', amount: '\u20A682,000', status: 'Shipped' },
    { id: '#SG-1039', customer: 'Tolu Adeyemi', date: 'Aug 21, 2026', amount: '\u20A627,300', status: 'Delivered' },
    { id: '#SG-1038', customer: 'Chidinma Eze', date: 'Aug 20, 2026', amount: '\u20A612,900', status: 'Cancelled' }
  ];
 
  readonly bestSellingProducts: BestSellingProduct[] = [
    { name: 'Blush Satin Wrap Dress', category: 'Dresses', unitsSold: 214, price: '$42.99', imageUrl: 'https://placehold.co/80x80/ffd6e8/e8558c?text=Dress' },
    { name: 'Long Body Wave Wig', category: 'Wigs', unitsSold: 176, price: '$89.99', imageUrl: 'https://placehold.co/80x80/ffe0ee/e8558c?text=Wig' },
    { name: 'Silky Lace Babydoll', category: 'Lingerie', unitsSold: 158, price: '$34.99', imageUrl: 'https://placehold.co/80x80/ffc2dc/e8558c?text=Babydoll' },
    { name: 'The Sissy Maker\u2019s Handbook', category: 'Ebooks', unitsSold: 132, price: '$12.99', imageUrl: 'https://placehold.co/80x80/ffe6f0/e8558c?text=Ebook' }
  ];
 
  // Pending/Processing get brand-styled badges (scoped SCSS below).
  // Shipped/Delivered/Cancelled use Bootstrap's built-in subtle-color
  // utilities directly, rather than inventing new SCSS status colors.
  statusClass(status: OrderStatus): string {
    switch (status) {
      case 'Pending':
        return 'dashboard__status--pending';
      case 'Processing':
        return 'dashboard__status--processing';
      case 'Shipped':
        return 'bg-info-subtle text-info-emphasis';
      case 'Delivered':
        return 'bg-success-subtle text-success-emphasis';
      case 'Cancelled':
        return 'bg-danger-subtle text-danger-emphasis';
      default:
        return '';
    }
  }
}