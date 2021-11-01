import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoordinatesPickerComponent } from './coordinates-picker/coordinates-picker.component';
import { FiltersComponent } from './filters/filters.component';
import { PanelComponent } from './panel/panel.component';
import { VehicleCreateComponent } from './vehicle-create/vehicle-create.component';

const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'vehicle', component: VehicleCreateComponent },
  { path: 'chart', component: CoordinatesPickerComponent },
  { path: 'filters', component: FiltersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
