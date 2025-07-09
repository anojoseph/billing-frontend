import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KitchenService } from 'src/app/module/admin/kitchen/kitchen/kitchen.service';

@Component({
    selector: 'app-printer-config',
    templateUrl: './printer-config.component.html'
})
export class PrinterConfigComponent implements OnInit {
    kitchens: any[] = [];
    printerAssignments: {
        billing?: string;
        kitchens: { [kitchenId: string]: string };
    } = { kitchens: {} };

    constructor(private kitchenService: KitchenService, private http: HttpClient) { }


    ngOnInit() {
        this.kitchenService.getallkitchen().subscribe((kitchens: any) => {
            this.kitchens = kitchens;

            this.http.get<any>('/settings/printer-config').subscribe((config) => {
                this.printerAssignments.billing = config.billing || '';
                this.printerAssignments.kitchens = {};

                this.kitchens.forEach(kitchen => {
                    this.printerAssignments.kitchens[kitchen._id] = config.kitchens?.[kitchen._id] || '';
                });
            });
        });
    }

    saveAssignments() {
        this.http.post('/settings/printer-config', this.printerAssignments).subscribe(() => {
            alert('Printer configuration saved successfully!');
        });
    }
}
