import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home/home.component';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuFormComponent } from 'src/app/shared/partials/menu/menu-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({
  declarations: [
    HomeComponent,
    MenuFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatCardModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatListModule,
    MatGridListModule
  ],
})
export class AdminModule { }
