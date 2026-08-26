import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './shared/search/search.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { register } from 'swiper/element/bundle';
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { CollectionSliderComponent } from './shared/collection-slider/collection-slider.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CategorySidebarComponent } from './shared/shopping/category-sidebar/category-sidebar.component';
import { PriceFilterComponent } from './shared/shopping/price-filter/price-filter.component';
import { RatingFilterComponent } from './shared/shopping/rating-filter/rating-filter.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';
import { CartComponent } from './pages/cart/cart.component';
import { AuthComponent } from './pages/auth/auth.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
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
import { ToastComponent } from './shared/toast/toast.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { adminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './features/admin/pages/admin-products/admin-products.component';
import { AdminOrdersComponent } from './features/admin/pages/admin-orders/admin-orders.component';
import { AdminCustomersComponent } from './features/admin/pages/admin-customers/admin-customers.component';
import { AdminCategoriesComponent } from './features/admin/pages/admin-categories/admin-categories.component';
import { AdminInventoryComponent } from './features/admin/pages/admin-inventory/admin-inventory.component';
import { SettingsComponent } from './features/admin/pages/settings/settings.component';
import { SalesChartComponent } from './features/admin/pages/sales-chart/sales-chart.component';


register();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    FooterComponent,
    HomeComponent,
    ProductCardComponent,
    CollectionSliderComponent,
    ShopComponent,
    CategorySidebarComponent,
    PriceFilterComponent,
    RatingFilterComponent,
    ProductViewComponent,
    CartComponent,
    AuthComponent,
    WishlistComponent,
    AdminLayoutComponent,
    AccountLayoutComponent,
    DashboardComponent,
    OrdersComponent,
    DownloadComponent,
    EditAddressComponent,
    BillingComponent,
    ShippingComponent,
    PaymentMethodComponent,
    EditAccountComponent,
    CustomerSupportComponent,
    CheckoutComponent,
    OrderConfirmationComponent,
    ToastComponent,
    PaginationComponent,
    adminDashboardComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    AdminCustomersComponent,
    AdminCategoriesComponent,
    AdminInventoryComponent,
    SettingsComponent,
    SalesChartComponent
  

  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
