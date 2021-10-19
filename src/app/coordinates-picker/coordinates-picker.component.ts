import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { Coordinates } from '../utils';

@Component({
  selector: 'app-coordinates-picker',
  template: `
    <h1 mat-dialog-title>Выберите координаты</h1>
    <div mat-dialog-content class="coord-container">
        <div *ngIf="xCoord && yCoord" class="show-coord-text">Выбранная точка: ({{ xCoord }}, {{ yCoord }})</div>
        <div id="graph">
            <canvas #taskChart id="task-chart" (click)="click($event)"></canvas>
            <!-- <img id="task-graph" src="./assets/images/graph-positive-r.png" /> -->
        </div>
    </div>
    <div mat-dialog-actions>
        <button mat-raised-button (click)="onReadyButtonClick()">Готово</button>
        <button mat-raised-button [mat-dialog-close] cdkFocusInitial>Отмена</button>
    </div>
  `,
  styleUrls: ['./coordinates-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoordinatesPickerComponent implements OnInit {

  @ViewChild('taskChart', { static: true }) taskChartRef: ElementRef;
  
  @Input()
  coordinatesInput: Coordinates;

  xCoord: number = 0;
  yCoord: number = 0;
  rCoord: number = 300;

  xCoordGraph: number = 0;

  arrowLength: number = 7;
  lineWidth: number = 2;
  pointScale: number = 3;
  signSpace: number = 9;
  pointRadius: number = 1.5;

  axisesColor: string = "black";
  signsColor: string = this.axisesColor;

  signsFont: string = "14px monospace";
  R: number = this.rCoord;
  chartWidth: number = 220;
  chartHeight: number = this.chartWidth;
  rCoefficient: number = 0.4;

  constructor(private dialogRef: MatDialogRef<CoordinatesPickerComponent>) { }

  ngOnInit(): void {
  }

  onReadyButtonClick(): void {
    this.dialogRef.close(new Coordinates(this.xCoord, this.yCoord))
  }

  ngAfterViewInit(): void {
    var self = this;
    let canvas = this.taskChartRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.width;
    this.chartWidth = canvas.offsetWidth;
    this.chartHeight = this.chartWidth;
    this.draw();
    if (this.coordinatesInput)
      this.redraw();

    window.onresize = (event)=>{
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.width;
        this.chartWidth = canvas.offsetWidth;
        this.chartHeight = this.chartWidth;
        this.redrawAxises();
        console.log('resize');
        
    };
  }

  draw() {
    let canvas = this.taskChartRef.nativeElement;
    this.drawAxises(canvas);
    this.drawAxisesSigns(canvas);
    this.drawPointsSigns(canvas, this.rCoord);
  }

  drawAxises(canvas) {
    let context = canvas.getContext("2d");

    context.beginPath();
    context.strokeStyle = this.axisesColor;
    context.lineWidth = this.lineWidth;

    context.moveTo(canvas.width / 2, canvas.height);
    context.lineTo(canvas.width / 2, 0);

    context.lineTo(canvas.width / 2 - this.arrowLength / 2, this.arrowLength);
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2 + this.arrowLength / 2, this.arrowLength);

    context.moveTo(0, canvas.height / 2);
    context.lineTo(canvas.width, canvas.height / 2);

    context.lineTo(canvas.width - this.arrowLength, canvas.height / 2 + this.arrowLength / 2);
    context.moveTo(canvas.width, canvas.height / 2);
    context.lineTo(canvas.width - this.arrowLength, canvas.height / 2 - this.arrowLength / 2);


    context.moveTo(canvas.width * 0.1, canvas.height / 2 - this.pointScale);
    context.lineTo(canvas.width * 0.1, canvas.height / 2 + this.pointScale);

    context.moveTo(canvas.width * 0.3, canvas.height / 2 - this.pointScale);
    context.lineTo(canvas.width * 0.3, canvas.height / 2 + this.pointScale);

    context.moveTo(canvas.width * 0.7, canvas.height / 2 - this.pointScale);
    context.lineTo(canvas.width * 0.7, canvas.height / 2 + this.pointScale);

    context.moveTo(canvas.width * 0.9, canvas.height / 2 - this.pointScale);
    context.lineTo(canvas.width * 0.9, canvas.height / 2 + this.pointScale);

    context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.1);
    context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.1);

    context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.3);
    context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.3);

    context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.7);
    context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.7);

    context.moveTo(canvas.width / 2 - this.pointScale, canvas.height * 0.9);
    context.lineTo(canvas.width / 2 + this.pointScale, canvas.height * 0.9);

    context.stroke();
  }

  drawAxisesSigns(canvas) {
    let context = canvas.getContext("2d");
    context.font = this.signsFont;
    context.fillStyle = this.signsColor;

    context.fillText("Y", canvas.width / 2 + this.signSpace / 2, this.signSpace);
    context.fillText("X", canvas.width - this.signSpace, canvas.height / 2 - this.signSpace / 2);
  }

  drawPointsSigns(canvas, r) {
    let context = canvas.getContext("2d");
    context.font = this.signsFont;
    context.fillStyle = this.signsColor;

    let rIsNumber = !isNaN(Number(r));

    let sign;
    rIsNumber ? sign = -r + "" : sign = "-" + r;
    if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
        sign = Number(sign).toFixed(1);
    }
    context.fillText(sign, canvas.width * 0.1 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
    context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.9 + this.signSpace / 2);
    rIsNumber ? sign = -r / 2 + "" : sign = "-" + r + "/2";
    if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
        sign = Number(sign).toFixed(1);
    }
    context.fillText(sign, canvas.width * 0.3 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
    context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.7 + this.signSpace / 2);
    rIsNumber ? sign = r / 2 + "" : sign = r + "/2";
    if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
        sign = Number(sign).toFixed(1);
    }
    context.fillText(sign, canvas.width * 0.7 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
    context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.3 + this.signSpace / 2);
    sign = r + "";
    if (rIsNumber && (Math.abs(sign) - Math.floor(Math.abs(sign))) == 0) {
        sign = Number(sign).toFixed(1);
    }
    context.fillText(sign, canvas.width * 0.9 - 0.5 * sign.length * this.signSpace, canvas.height / 2 - this.signSpace / 2);
    context.fillText(sign, canvas.width / 2 + this.signSpace / 2, canvas.height * 0.1 + this.signSpace / 2);
  }

  drawPoint(canvas, x, y, pointColor) {
    let context = canvas.getContext("2d");
    context.beginPath();
    context.strokeStyle = pointColor;
    context.fillStyle = pointColor;

    context.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.stroke();
  }

  click(event) {
    this.R = this.rCoord;
    let canvas = event.target;
    let originalX = event.pageX - canvas.offsetLeft;
    let originalY = event.pageY - canvas.offsetTop;
    let compY = String(this.toComputingY(originalY, this.R)).substring(0, 10);
    let compX = String(this.toComputingX(originalX, this.R)).substring(0, 10);

    let roundedX = Math.round(parseFloat(compX));
    let roundedY = Math.round(parseFloat(compY));
    console.log(`(${roundedX}, ${roundedY})`);
    this.redrawAxises()
    this.drawPoint(canvas, originalX, originalY, "green");
    this.xCoord = roundedX;
    this.yCoord = roundedY;
    
  }

  redraw() {
    let canvas = this.taskChartRef.nativeElement;
    this.drawPoint(canvas, this.toOriginalX(this.coordinatesInput.xCoord, this.R), this.toOriginalY(this.coordinatesInput.yCoord, this.R), "green");
  }

  redrawAxises(){
    let canvas = this.taskChartRef.nativeElement;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    this.draw();
  }

  toOriginalX(computingX, R) {
    let X = computingX / R;
    X *= this.rCoefficient * this.chartWidth;
    X += this.chartWidth / 2;

    return X;
  }

  toOriginalY(computingY, R) {
      let Y = computingY / R;
      Y *= this.rCoefficient * this.chartHeight;
      Y = -Y + this.chartHeight / 2;

      return Y;
  }

  toComputingX(originalX, R) {
      let X = originalX - this.chartWidth / 2;
      X /= this.rCoefficient * this.chartWidth;
      X *= R;

      return X;
  }

  toComputingY(originalY, R) {
      let Y = -originalY + this.chartHeight / 2;
      Y /= this.rCoefficient * this.chartHeight;
      Y *= R;

      return Y;
  }
}
