import { Component } from '@angular/core';
import { PrintService, ThermalPrintModule, UsbDriver, WebPrintDriver } from 'ng-thermal-print';
import { PrintDriver } from 'ng-thermal-print/lib/drivers/PrintDriver';

@Component({
  selector: 'app-print',
  templateUrl: 'print.component.html',
  // styleUrls: ['print.component.css'] 
})
export class PrintComponent {

  isConnected = false;
  status: boolean = false;
  usbPrintDriver: UsbDriver;
  webPrintDriver: WebPrintDriver | undefined;
  ip: string = '';

  constructor(
    private printService: PrintService
  ) {
    this.usbPrintDriver = new UsbDriver();
    this.printService.isConnected.subscribe(result => {
      this.status = result;
      if (result) {
        console.log('Connected to printer!!!');
      } else {
        console.log('Not connected to printer.');
      }
    });
  }

  requestUsb() {
    this.usbPrintDriver.requestUsb().subscribe(result => {
      this.printService.setDriver(this.usbPrintDriver, 'ESC/POS');
    });
  }

  connectToWebPrint() {
    this.webPrintDriver = new WebPrintDriver(this.ip);
    this.printService.setDriver(this.webPrintDriver, 'WebPRNT');
  }

  print() {
    this.printService.init()
      .setBold(true)
      .writeLine('Hello World!')
      .setBold(false)
      .feed(4)
      .cut('full')
      .flush();
  }
}
