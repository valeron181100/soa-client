import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoordinatesPickerComponent } from './coordinates-picker/coordinates-picker.component';
import { PanelComponent } from './panel/panel.component';
import { VehicleCreateComponent } from './vehicle-create/vehicle-create.component';

const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'vehicle', component: VehicleCreateComponent },
  { path: 'chart', component: CoordinatesPickerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
