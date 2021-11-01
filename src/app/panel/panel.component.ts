import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatRow, MatTableModule } from '@angular/material/table';
import { Car, Coordinates, FuelType, Vehicle, VehicleType } from '../utils';
import { PanelService } from './panel.service';
import { json2xml, xml2json } from 'xml-js'
import { elementAt, map, switchMap } from 'rxjs/operators'
import { RandomService } from '../random.service';
import { from } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { VehicleCreateComponent } from '../vehicle-create/vehicle-create.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FiltersComponent } from '../filters/filters.component';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PanelComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'coordinates', 'creationDate', 'enginePower', 'numberOfWheels', 'vehicleType', 'fuelType', 'actionsColumn'];
  vehicles: Vehicle[];
  paginatorVehicles: Vehicle[] = [];
  paginatorPageSize: number = 5;
  paginatorLength: number = 5;
  expandedElement: any;
  expandedElementInfo: string;
  expandedElementImgSrc: string;
  isInfoLoading: boolean = true;
  avgWheelsNum: number;
  deleteAllFuel: FuelType;
  sortState: Sort;
  filtersObj: Car;

  isExpansionDetailRow = (row: any) => row.hasOwnProperty('detailRow');


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private panelService: PanelService,
              private randomService: RandomService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private liveAnnouncer: LiveAnnouncer,
              private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.filtersObj = new Car();
  }

  ngAfterViewInit(): void {
    this.loadData()
    this.paginator.page.subscribe(
      () => this.loadData()
    )
  }

  clearFilters(): void {
    this.filtersObj = undefined;
    this.loadData();
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

  onDeleteByFuelTypeClick(): void {
    if (this.deleteAllFuel)
      this.panelService.deleteVehicleByFuelType(this.deleteAllFuel).subscribe(
        () => {
          this.showToast(`Удалены машины с типом топлива: ${this.deleteAllFuel}`);
          this.loadData();
        }
      )
  }

  showToast(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
      panelClass: 'custom-snack-bar'
    });
  }

  loadData(): void {
    let startIndex = this.paginator.pageSize * this.paginator.pageIndex;
    let maxResults = this.paginator.pageSize;
    
    this.panelService.getVehicles(startIndex, maxResults, this.sortState, this.filtersObj).pipe(
      map(data => { 
        let obj = JSON.parse(xml2json(data, {compact: true, spaces: 4}));
        if (!Array.isArray(obj.vehicles.vehicle))
          obj.vehicles.vehicle = [obj.vehicles.vehicle];
        return {
          vehicles: obj.vehicles.vehicle,
          totalCount: obj.vehicles.totalCount._text
        }
      }),
      map((respJson) => {
        let vehiclesList = [];
        if (respJson.totalCount > 0)
          vehiclesList =  respJson.vehicles.map(vehicle => {
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
          });
        return {
          vehicles: vehiclesList,
          totalCount: respJson.totalCount
        }
      })
    ).subscribe(data => {
      this.vehicles = data.vehicles;
      console.log(data);
      this.paginatorLength = data.totalCount;
      this.cdr.detectChanges();
    });
  }

  announceSortChange(sortState: Sort): void {
    console.log(sortState);
    this.sortState = sortState;
    this.loadData();
  }

  countAvgWheelsNum(): void {
    this.panelService.getAvgNumberOfWheels().subscribe(
      data => {
        this.avgWheelsNum = data;
        this.cdr.markForCheck();
      }
    );
  }

  vehiclesTrackBy(index: number, item: any): any {
    return item.id;
  }

  getVehicleInfo(vehicle: Vehicle): void {
    if (this.expandedElement === vehicle) {
      this.isInfoLoading = true;
      this.expandedElementInfo = undefined;
      this.randomService.getVehicleInfo(vehicle.name).subscribe(
        (data: string) => {
          if (!data) {
            this.expandedElementInfo = undefined;
            this.isInfoLoading = false;
            return;
          }
          let info = data.split('<!--')[0].trim();
          if (info)
            this.expandedElementInfo = info;
          else
            this.expandedElementInfo = undefined;
          this.isInfoLoading = false;
        }
      );
    }
  }

  getVehicleImage(vehicle: Vehicle): void {
    if (this.expandedElement === vehicle) {
      this.expandedElementImgSrc = undefined;
      this.randomService.getVehicleImage(vehicle.name).subscribe(
        data => this.expandedElementImgSrc = data
      );
    }
  }

  openFiltersDialog(): void {
    const dialogRef = this.dialog.open(FiltersComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.filtersObj = this.filtersObj;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      this.filtersObj = result;
      this.loadData();
    });
  }

  openCreateVehicleDialog(vehicle?: Vehicle): void {
    const dialogRef = this.dialog.open(VehicleCreateComponent, {
      width: '500px'
    });

    dialogRef.componentInstance.vehicle = vehicle;

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result);
      
      if (result)
        if (result.action === 'create')
          this.panelService.postVehicle(result.vehicle).subscribe(
            () => this.loadData()
          );
        else
          this.panelService.updateVehicle(result.vehicle).subscribe(
            () => this.loadData()
          ); 
    });
  }

  getValuesFromEnum(enumStr: string): string[] {
    if (enumStr === 'vehicleType')
      return (<any>Object).values(VehicleType).filter(p => !Number.isInteger(p));
    else
      return (<any>Object).values(FuelType).filter(p => !Number.isInteger(p));
  }
}