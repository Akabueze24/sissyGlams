import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AccountLayoutComponent } from './features/customer/account-layout/account-layout.component';
import { DashboardComponent } from './features/customer/pages/dashboard/dashboard.component';
import { OrdersComponent } from './features/customer/pages/orders/orders.component';
import { DownloadComponent } from './features/customer/pages/download/download.component';
import { EditAddressComponent } from './features/customer/pages/edit-address/edit-address.component';
import { BillingComponent } from './features/customer/pages/billing/billing.component';
import { ShippingComponent } from './features/customer/pages/shipping/shipping.component';
import { PaymentMethodComponent } from './features/customer/pages/payment-method/payment-method.component';
import { EditAccountComponent } from './features/customer/pages/edit-account/edit-account.component';
import { CustomerSupportComponent } from './features/customer/pages/customer-support/customer-support.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { adminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard.component';
import { AdminCustomersComponent } from './features/admin/pages/admin-customers/admin-customers.component';
import { AdminInventoryComponent } from './features/admin/pages/admin-inventory/admin-inventory.component';
import { AdminOrdersComponent } from './features/admin/pages/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './features/admin/pages/admin-products/admin-products.component';
import { SettingsComponent } from './features/admin/pages/settings/settings.component';
import { AdminCategoriesComponent } from './features/admin/pages/admin-categories/admin-categories.component';
import { StoreLayoutComponent } from './layouts/store-layout/store-layout.component';

const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: HomeComponent },

      { path: 'home', component: HomeComponent },

      { path: 'shop', component: ShopComponent },

      {
        path: 'product-view/:slug',
        component: ProductViewComponent,
      },

      { path: 'cart', component: CartComponent },

      { path: 'checkout', component: CheckoutComponent },

      {
        path: 'order-confirmation',
        component: OrderConfirmationComponent,
      },

      // CUSTOMER ACCOUNT
      {
        path: 'account',
        component: AccountLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: DashboardComponent,
          },
          {
            path: 'wishlist',
            component: WishlistComponent,
          },
          {
            path: 'orders',
            component: OrdersComponent,
          },
          {
            path: 'downloads',
            component: DownloadComponent,
          },
          {
            path: 'address',
            component: EditAddressComponent,
          },
          {
            path: 'address/billing',
            component: BillingComponent,
          },
          {
            path: 'address/shipping',
            component: ShippingComponent,
          },
          {
            path: 'payment',
            component: PaymentMethodComponent,
          },
          {
            path: 'edit-account',
            component: EditAccountComponent,
          },
          {
            path: 'customer-support',
            component: CustomerSupportComponent,
          },
        ],
      },
    ],
  },

  // ADMIN — completely separate
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: adminDashboardComponent },
      { path: 'customers', component: AdminCustomersComponent },
      { path: 'inventory', component: AdminInventoryComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
