import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { FuelType, Vehicle, VehicleType } from '../utils';
import { PanelService } from './panel.service';
import { json2xml, xml2json } from 'xml-js'
import { elementAt, map, switchMap } from 'rxjs/operators'
import { RandomService } from '../random.service';
import { from } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { VehicleCreateComponent } from '../vehicle-create/vehicle-create.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PanelComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'coordinates', 'creationDate', 'enginePower', 'numberOfWheels', 'vehicleType', 'fuelType', 'deleteColumn'];
  vehicles: Vehicle[];
  paginatorVehicles: Vehicle[] = [];
  paginatorPageSize: number = 5;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private panelService: PanelService,
              private randomService: RandomService,
              private dialog: MatDialog,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.paginatorVehicles = this.getPagedItems(this.paginator.pageIndex, this.paginator.pageSize);
    this.cdr.detectChanges();
  }

  getPagedItems(pageIndex: number, pageSize: number): any[] {
    if (this.vehicles) {
      let pagesNumber = Math.ceil(this.vehicles.length / pageSize);
      let firstElIndex = pageSize * pageIndex;
      let lastElIndex = pageSize * pageIndex + pageSize;
      return this.paginatorVehicles = this.vehicles.slice(firstElIndex, lastElIndex);
    }
  }

  async onAddRandomCarClick(): Promise<void> {
    let vehicle = await this.randomService.getRandomVehicle().toPromise();
    this.panelService.postVehicle(vehicle).subscribe(
      () => this.loadData()
    );
  }

  onDeleteButtonClick(element: Vehicle) {
    this.panelService.deleteVehicle(element.id).subscribe(
      () => this.loadData()
    );
  }

  loadData(): void {
    this.panelService.getVehicles().pipe(
      map(data => JSON.parse(xml2json(data, {compact: true, spaces: 4})).vehicles.vehicle),
      map((list) => list.map(vehicle => {
        return {
          id: vehicle.id['_text'],
          name: vehicle.name['_text'],
          coordinates: {
            xCoord: vehicle.coordinates.xCoord['_text'],
            yCoord: vehicle.coordinates.yCoord['_text']
          },
          creationDate: vehicle.creationDate['_text'],
          enginePower: vehicle.enginePower['_text'],
          numberOfWheels: vehicle.numberOfWheels['_text'],
          vehicleType: vehicle.type['_text'],
          fuelType: vehicle.fuelType['_text'],
        }
      }))
    ).subscribe((data: Array<Vehicle>) => {
      this.vehicles = data;
      this.paginatorVehicles = this.getPagedItems(this.paginator.pageIndex, this.paginator.pageSize);
    });
  }

  vehiclesTrackBy(index: number, item: any): any {
    return item.id;
  }

  openCreateVehicleDialog(): void {
    const dialogRef = this.dialog.open(VehicleCreateComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: Vehicle) => {
      console.log(result);
      
      if (result)
        this.panelService.postVehicle(result).subscribe(
          () => this.loadData()
        );
    });
  }

}