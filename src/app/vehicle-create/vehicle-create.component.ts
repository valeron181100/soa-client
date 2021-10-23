import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CoordinatesPickerComponent } from '../coordinates-picker/coordinates-picker.component';
import { RandomService } from '../random.service';
import { Coordinates, FuelType, fuelTypeValidator, Vehicle, VehicleType, vehicleTypeValidator } from '../utils';

@Component({
  selector: 'app-vehicle-create',
  templateUrl: './vehicle-create.component.html',
  styleUrls: ['./vehicle-create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VehicleCreateComponent implements OnInit {

  vehicleForm: FormGroup;

  @Input()
  vehicle: Vehicle;

  constructor(private dialog: MatDialog,
              private randomService: RandomService,
              private dialogRef: MatDialogRef<VehicleCreateComponent>) { }

  ngOnInit(): void {
    this.vehicleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      coordinates: new FormControl('', [Validators.required]),
      enginePower: new FormControl('1', [Validators.required, Validators.min(0)]),
      numberOfWheels: new FormControl('1', [Validators.required, Validators.min(0)]),
      vehicleType: new FormControl('', [vehicleTypeValidator()]),
      fuelType: new FormControl('', [fuelTypeValidator()])
    });
    if (this.vehicle) {
      this.vehicleForm.get('name').setValue(this.vehicle.name);
      this.vehicleForm.get('coordinates').setValue(Coordinates.toString(this.vehicle.coordinates));
      this.vehicleForm.get('enginePower').setValue(this.vehicle.enginePower);
      this.vehicleForm.get('numberOfWheels').setValue(this.vehicle.numberOfWheels);
      this.vehicleForm.get('vehicleType').setValue(this.vehicle.vehicleType);
      this.vehicleForm.get('fuelType').setValue(this.vehicle.fuelType);
    }
  }
  onReadyButtonClick(): void {
    console.log(this.vehicleForm.valid);
    let vehicle = new Vehicle(
      this.vehicle ? this.vehicle.id : 99,
      this.vehicleForm.get('name').value,
      Coordinates.fromString(this.vehicleForm.get('coordinates').value),
      this.vehicle ? this.vehicle.creationDate : new Date().toISOString(),
      this.vehicleForm.get('enginePower').value,
      this.vehicleForm.get('numberOfWheels').value,
      VehicleType[VehicleType[this.vehicleForm.get('vehicleType').value]],
      FuelType[FuelType[this.vehicleForm.get('fuelType').value]],
    )
    this.dialogRef.close({
      vehicle: vehicle,
      action: this.vehicle ? 'update' : 'create'
    });
  }

  async onRandomClick(): Promise<void> {
    let vehicle = await this.randomService.getRandomVehicle().toPromise();
    console.log(Coordinates.toString(vehicle.coordinates));
    
    this.vehicleForm.get('name').setValue(vehicle.name);
    this.vehicleForm.get('coordinates').setValue(Coordinates.toString(vehicle.coordinates));
    this.vehicleForm.get('enginePower').setValue(vehicle.enginePower);
    this.vehicleForm.get('numberOfWheels').setValue(vehicle.numberOfWheels);
    this.vehicleForm.get('vehicleType').setValue(vehicle.vehicleType);
    this.vehicleForm.get('fuelType').setValue(vehicle.fuelType);
  }

  getValuesFromEnum(enumStr: string): string[] {
    if (enumStr === 'vehicleType')
      return (<any>Object).values(VehicleType).filter(p => !Number.isInteger(p));
    else
      return (<any>Object).values(FuelType).filter(p => !Number.isInteger(p));
  }

  openCoordinatesPicker(): void {
    const dialogRef = this.dialog.open(CoordinatesPickerComponent, {
      width: '400px'
    });

    dialogRef.componentInstance.coordinatesInput = Coordinates.fromString(this.vehicleForm.get('coordinates').value);

    dialogRef.afterClosed().subscribe((result: Coordinates) => {
      if (result)
        this.vehicleForm.get('coordinates').setValue(`(${result.xCoord}, ${result.yCoord})`);
    });
  }

}