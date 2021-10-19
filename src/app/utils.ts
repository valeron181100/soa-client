import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export class Vehicle {
    constructor(public id: number,
                public name: string,
                public coordinates: Coordinates,
                public creationDate: string,
                public enginePower: number,
                public numberOfWheels: number,
                public vehicleType: VehicleType,
                public fuelType: FuelType
                ) { }
}

export class Coordinates {
    constructor(public xCoord: number,
                public yCoord: number) { }
    
    static fromString(coordStr: string): Coordinates {
        let coords = coordStr.substring(1, coordStr.length - 1).split(', ');
        return new Coordinates(Number.parseInt(coords[0]), Number.parseInt(coords[1]));
    }
    
    static toString(coord: Coordinates) : string {
        return `(${coord.xCoord}, ${coord.yCoord})`
    }
}

export enum VehicleType {
    HATCHBACK,
    SEDAN,
    PLANE,
    SUBMARINE,
    SHIP,
    CHOPPER
}

export enum FuelType {
    SOLID,
    LIQUID,
    GAS,
    DIESEL,
    KEROSENE,
    MANPOWER,
    NUCLEAR
}

export function vehicleTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value)
        return null;
      return (<any>Object).values(VehicleType).includes(control.value) ? null : { invalidVehicleType: { value: control.value } };
    }
  }
  
  export function fuelTypeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value)
        return null;
      return (<any>Object).values(FuelType).includes(control.value) ? null : { invalidVehicleType: { value: control.value } };
    }
  }