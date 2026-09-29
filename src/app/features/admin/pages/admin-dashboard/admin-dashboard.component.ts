import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, combineLatest } from 'rxjs';

import { Order } from 'src/app/core/models/order-models/order.model';
import { Product } from 'src/app/core/models/product-models/product.model';
import { OrderService } from 'src/app/core/services/order-service/order.service';
import { ProductService } from 'src/app/core/services/product-service/product.service';
import { SalesDataPoint } from 'src/app/core/models/admin-model/sales-point.model';

interface DashboardStat {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
}

type OrderStatusLabel =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

interface RecentOrderRow {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: OrderStatusLabel;
}

interface BestSellingRow {
  name: string;
  category: string;
  unitsSold: number;
  price: string;
  imageUrl: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStat[] = [];
  salesData: SalesDataPoint[] = [];
  recentOrders: RecentOrderRow[] = [];
  bestSellingProducts: BestSellingRow[] = [];

  /** Chart range: driven by the dashboard select */
  salesPeriod: '30d' | '6m' | '12m' = '30d';

  private orders: Order[] = [];
  private products: Product[] = [];
  private sub!: Subscription;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([
      this.orderService.orders$,
      this.productService.adminProducts$,
    ]).subscribe(([orders, products]) => {
      this.orders = orders;
      this.products = products;
      this.rebuild();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  /** Called when the period dropdown changes */
  onSalesPeriodChange(): void {
    this.salesData = this.buildSalesData();
  }

  private rebuild(): void {
    this.stats = this.buildStats();
    this.recentOrders = this.buildRecentOrders(8);
    this.bestSellingProducts = this.buildBestSellers(4);
    this.salesData = this.buildSalesData();
  }

  // ============================================================
  // CANCELLED CHECK (normalize so casing/spaces never break revenue)
  // ============================================================

  private isCancelled(order: Order): boolean {
    return (
      String(order.orderStatus ?? '')
        .trim()
        .toLowerCase() === 'cancelled'
    );
  }

  // ============================================================
  // STATS
  // ============================================================

  private buildStats(): DashboardStat[] {
    // Revenue only from non-cancelled orders
    const revenueOrders = this.orders.filter((o) => !this.isCancelled(o));
    const revenue = revenueOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const uniqueCustomers = new Set(
      this.orders
        .map((o) => o.customer?.email?.trim().toLowerCase())
        .filter((e): e is string => !!e)
    ).size;

    const lowStock = this.products.filter(
      (p) => p.stock > 0 && p.stock <= 5
    ).length;

    return [
      {
        label: 'Total Revenue',
        value: this.formatMoney(revenue),
        trend: `${revenueOrders.length} non-cancelled orders`,
        trendDirection: 'neutral',
        icon: 'fa-solid fa-sack-dollar',
      },
      {
        label: 'Total Orders',
        value: String(this.orders.length),
        trend: `${this.countByStatus('cancelled')} cancelled · ${
          this.countByStatus('pending') + this.countByStatus('processing')
        } open`,
        trendDirection: 'up',
        icon: 'fa-solid fa-receipt',
      },
      {
        label: 'Customers',
        value: String(uniqueCustomers),
        trend: 'Unique emails from orders',
        trendDirection: 'neutral',
        icon: 'fa-solid fa-users',
      },
      {
        label: 'Total Products',
        value: String(this.products.length),
        trend: lowStock > 0 ? `${lowStock} low in stock` : 'Stock levels OK',
        trendDirection: lowStock > 0 ? 'down' : 'up',
        icon: 'fa-solid fa-shirt',
      },
    ];
  }

  private countByStatus(status: Order['orderStatus']): number {
    return this.orders.filter(
      (o) =>
        String(o.orderStatus ?? '')
          .trim()
          .toLowerCase() === String(status).toLowerCase()
    ).length;
  }

  // ============================================================
  // RECENT ORDERS (includes cancelled — history)
  // ============================================================

  private buildRecentOrders(limit: number): RecentOrderRow[] {
    return this.orders.slice(0, limit).map((order) => ({
      id: order.id,
      customer:
        [order.customer?.firstName, order.customer?.lastName]
          .filter(Boolean)
          .join(' ') ||
        order.customer?.email ||
        'Guest',
      date: order.createdAt
        ? new Date(order.createdAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '—',
      amount: this.formatMoney(order.total || 0),
      status: this.toStatusLabel(order.orderStatus),
    }));
  }

  private toStatusLabel(status: Order['orderStatus']): OrderStatusLabel {
    switch (String(status ?? '').trim().toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  }

  // ============================================================
  // BEST SELLERS (cancelled excluded)
  // ============================================================

  private buildBestSellers(limit: number): BestSellingRow[] {
    const sold = new Map<
      string,
      { units: number; name: string; product?: Product }
    >();

    for (const order of this.orders) {
      if (this.isCancelled(order)) continue;

      for (const item of order.items || []) {
        const id = item.productId;
        if (!id) continue;

        const prev = sold.get(id);
        const units = (prev?.units || 0) + (item.quantity || 0);
        sold.set(id, {
          units,
          name: item.productName || prev?.name || id,
          product: this.products.find((p) => p.id === id) || prev?.product,
        });
      }
    }

    return [...sold.entries()]
      .sort((a, b) => b[1].units - a[1].units)
      .slice(0, limit)
      .map(([, row]) => {
        const p = row.product;
        return {
          name: p?.name || row.name,
          category: p?.category ? this.formatCategory(p.category) : '—',
          unitsSold: row.units,
          price: this.formatMoney(p?.price ?? 0),
          imageUrl: p?.images?.[0] || 'https://placehold.co/80x80?text=Product',
        };
      });
  }

  // ============================================================
  // SALES CHART (period-aware, cancelled excluded)
  // ============================================================

  private buildSalesData(): SalesDataPoint[] {
    const now = new Date();
    const start = this.getPeriodStart(now);

    const active = this.orders.filter((order) => {
      if (this.isCancelled(order)) return false;
      if (!order.createdAt) return false;
      const d = new Date(order.createdAt);
      if (Number.isNaN(d.getTime())) return false;
      return d >= start && d <= now;
    });

    if (this.salesPeriod === '30d') {
      return this.bucketByDay(active, start, now);
    }

    const monthCount = this.salesPeriod === '6m' ? 6 : 12;
    return this.bucketByMonth(active, monthCount, now);
  }

  private getPeriodStart(now: Date): Date {
    const start = new Date(now);

    if (this.salesPeriod === '30d') {
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    if (this.salesPeriod === '6m') {
      start.setMonth(start.getMonth() - 5, 1);
      start.setHours(0, 0, 0, 0);
      return start;
    }

    start.setMonth(start.getMonth() - 11, 1);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private bucketByMonth(
    orders: Order[],
    monthCount: number,
    now: Date
  ): SalesDataPoint[] {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const points: SalesDataPoint[] = [];
    const indexByKey = new Map<string, number>();

    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      indexByKey.set(key, points.length);
      points.push({
        label: `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        value: 0,
      });
    }

    for (const order of orders) {
      const d = new Date(order.createdAt!);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const idx = indexByKey.get(key);
      if (idx != null) {
        points[idx].value += order.total || 0;
      }
    }

    return points;
  }

  private bucketByDay(
    orders: Order[],
    start: Date,
    now: Date
  ): SalesDataPoint[] {
    const points: SalesDataPoint[] = [];
    const map = new Map<string, number>();

    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(0, 0, 0, 0);

    while (cursor <= end) {
      const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
      map.set(key, points.length);
      points.push({
        label: `${cursor.getDate()}/${cursor.getMonth() + 1}`,
        value: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    for (const order of orders) {
      const d = new Date(order.createdAt!);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const idx = map.get(key);
      if (idx != null) {
        points[idx].value += order.total || 0;
      }
    }

    return points;
  }

  // ============================================================
  // DISPLAY HELPERS
  // ============================================================

  private formatMoney(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  private formatCategory(category: string): string {
    return category
      .split('-')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }

  statusClass(status: OrderStatusLabel): string {
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