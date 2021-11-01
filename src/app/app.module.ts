import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanelComponent } from './panel/panel.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { VehicleCreateComponent } from './vehicle-create/vehicle-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoordinatesPickerComponent } from './coordinates-picker/coordinates-picker.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { RandomcolorModule } from 'angular-randomcolor';
import { FiltersComponent } from './filters/filters.component';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    VehicleCreateComponent,
    CoordinatesPickerComponent,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    RandomcolorModule,
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
