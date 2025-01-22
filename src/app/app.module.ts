import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './shared/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth/auth.interceptor';
import { FoodMenuComponent } from './module/user/components/food-menu/food-menu.component';
import { OrderSummaryComponent } from './module/user/components/order-summary/order-summary.component';
import { LayoutComponent } from './module/user/components/layout/layout.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FoodMenuComponent,
    OrderSummaryComponent,
    LayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    MatSelectModule,
    MatIconModule,
    ToastrModule.forRoot({ // Configure Toastr globally
      timeOut: 3000, // Default timeout in ms
      positionClass: 'toast-top-right', // Position of the toast
      preventDuplicates: true, // Prevent duplicate toasts
    }),
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },],
  bootstrap: [AppComponent]
})
export class AppModule { }
