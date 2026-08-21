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
import { AdminLayoutComponent } from './admin/layout/admin-layout/admin-layout.component';
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
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { ToastComponent } from './shared/toast/toast.component';

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
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
