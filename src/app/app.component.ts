import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'soa-client';

  @ViewChild('authorNameBackground') authorBackgroundRef: ElementRef;
  @ViewChild('authorName') authorNameRef: ElementRef;
  @ViewChild('mainHeaderCodeImg') coderImgRef: ElementRef;

  compatSaysWho(){
    var ua= navigator.userAgent, tem,
          M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if(/trident/i.test(M[1])){
          tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE '+(tem[1] || '');
      }
      if(M[1]=== 'Chrome'){
          tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
          if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
      if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
      return M.join(' ');
  }

  compatApply(){
    var broserInfo = this.compatSaysWho();
    var browserName = broserInfo.split(' ')[0];
    var browserVer = broserInfo.split(' ')[1];
    if( browserName == 'Firefox' && parseInt(browserVer) <= 52){
      this.coderImgRef.nativeElement.remove();
      this.authorBackgroundRef.nativeElement.remove();
      this.authorNameRef.nativeElement.css('position', 'relative');
      this.authorNameRef.nativeElement.css('margin-left', 'calc(5vw * 0.5)');
    }
  }

  ngAfterViewInit(): void {
    this.compatApply();
  }
}
