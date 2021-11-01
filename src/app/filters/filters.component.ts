import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { VehicleType, FuelType, fuelTypeValidator, vehicleTypeValidator, coordinatesInputValidator, Vehicle, Coordinates, Car } from '../utils';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  @Input()
  filtersObj: Car;

  filtersForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<FiltersComponent>) { 

   }

  ngOnInit(): void {
    this.filtersForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl(''),
      coordinates: new FormControl('', coordinatesInputValidator()),
      enginePower: new FormControl('', Validators.min(0)),
      numberOfWheels: new FormControl('', [Validators.min(0)]),
      vehicleType: new FormControl('', [vehicleTypeValidator()]),
      fuelType: new FormControl('', [fuelTypeValidator()])
    });

    if (this.filtersObj) {
      this.filtersForm.get('id').setValue(this.filtersObj.id);
      this.filtersForm.get('name').setValue(this.filtersObj.name);
      if (this.filtersObj.coordinates)
        this.filtersForm.get('coordinates').setValue(Coordinates.toString(this.filtersObj.coordinates));
      this.filtersForm.get('enginePower').setValue(this.filtersObj.enginePower);
      this.filtersForm.get('numberOfWheels').setValue(this.filtersObj.numberOfWheels);
      this.filtersForm.get('vehicleType').setValue(this.filtersObj.vehicleType);
      this.filtersForm.get('fuelType').setValue(this.filtersObj.fuelType);
    }
  }

  getValuesFromEnum(enumStr: string): string[] {
    if (enumStr === 'vehicleType')
      return (<any>Object).values(VehicleType).filter(p => !Number.isInteger(p));
    else
      return (<any>Object).values(FuelType).filter(p => !Number.isInteger(p));
  }

  onReadyButtonClick(): void {
    console.log(this.filtersForm.valid);
    let car = new Car();
    car.id = this.filtersForm.get('id').value;
    car.name = this.filtersForm.get('name').value;
    if (this.filtersForm.get('coordinates').value)
      car.coordinates = Coordinates.fromString(this.filtersForm.get('coordinates').value);
    car.creationDate = this.filtersObj ? this.filtersObj.creationDate : new Date().toISOString();
    car.enginePower = this.filtersForm.get('enginePower').value;
    car.numberOfWheels = this.filtersForm.get('numberOfWheels').value;
    car.vehicleType = VehicleType[VehicleType[this.filtersForm.get('vehicleType').value]];
    car.fuelType = FuelType[FuelType[this.filtersForm.get('fuelType').value]];
    this.dialogRef.close(car);
  }
}
