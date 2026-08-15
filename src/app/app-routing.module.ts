import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AccountLayoutComponent } from './account/layout/account-layout/account-layout.component';
import { DashboardComponent } from './account/pages/dashboard/dashboard.component';
import { OrdersComponent } from './account/pages/orders/orders.component';
import { DownloadComponent } from './account/pages/download/download.component';
import { EditAddressComponent } from './account/pages/edit-address/edit-address.component';
import { BillingComponent } from './account/pages/billing/billing.component';
import { ShippingComponent } from './account/pages/shipping/shipping.component';
import { PaymentMethodComponent } from './account/pages/payment-method/payment-method.component';
import { EditAccountComponent } from './account/pages/edit-account/edit-account.component';
import { CustomerSupportComponent } from './account/pages/customer-support/customer-support.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'product-view', component: ProductViewComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'checkout', component: CheckoutComponent },

  {
    path: 'account',
    component: AccountLayoutComponent,
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
        component:OrdersComponent
      },
      {
        path: 'downloads',
        component:DownloadComponent
      },
      {
        path: 'address',
        component:EditAddressComponent
      },
      {
        path: 'address/billing',
        component:BillingComponent
      },
      {
        path: 'address/shipping',
        component:ShippingComponent
      },
      {
        path: 'payment',
        component:PaymentMethodComponent
      },
      {
        path: 'edit-account',
        component:EditAccountComponent
      },
      {
        path: 'customer-support',
        component:CustomerSupportComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
