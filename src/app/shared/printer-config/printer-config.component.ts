import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KitchenService } from 'src/app/module/admin/kitchen/kitchen/kitchen.service';

@Component({
    selector: 'app-printer-config',
    templateUrl: './printer-config.component.html'
})
export class PrinterConfigComponent implements OnInit {
    kitchens: any[] = [];
    loading: boolean = false;

    printerAssignments: {
        billing?: string;
        token?: string;
        kitchens: { [kitchenId: string]: string };
    } = { kitchens: {} };
    printerStatus: { [printerName: string]: boolean } = {};

    constructor(private kitchenService: KitchenService, private http: HttpClient) { }

    ngOnInit() {
        this.loading = true;
        this.kitchenService.getallkitchen().subscribe((kitchens: any) => {
            this.kitchens = kitchens;

            this.http.get<any>('/settings/printer-config').subscribe((config) => {
                this.printerAssignments.billing = config.billing || '';
                this.printerAssignments.kitchens = {};
                this.printerAssignments.token = config.token || '';

                this.kitchens.forEach(kitchen => {
                    this.printerAssignments.kitchens[kitchen._id] = config.kitchens?.[kitchen._id] || '';
                });

                this.loading = false; // ✅ Done loading
                this.checkprinter()
            }, () => {
                this.loading = false;
            });
        }, () => {
            this.loading = false;
        });

        // Check initial statuses


    }

    saveAssignments() {
        this.loading = true;
        this.http.post('/settings/printer-config', this.printerAssignments).subscribe(() => {
            this.loading = false;
        }, () => {
            this.loading = false;
        });
    }

    checkprinter() {
        console.log(this.printerAssignments.billing)
        if (this.printerAssignments.billing) {
            console.log(this.printerAssignments.billing)
            this.checkPrinterStatus(this.printerAssignments.billing);
        }
        if (this.printerAssignments.token) {
            this.checkPrinterStatus(this.printerAssignments.token);
        }
        this.kitchens.forEach(kitchen => {
            const pname = this.printerAssignments.kitchens[kitchen._id];
            if (pname) this.checkPrinterStatus(pname);
        });
    }

    checkPrinterStatus(printerName: string) {
        console.log("it s")
        if (!printerName) return;

        this.http.get<{ available: boolean }>(`/settings/printer-config/status?name=${printerName}`).subscribe({
            next: (res) => {
                this.printerStatus[printerName] = res.available;
            },
            error: () => {
                this.printerStatus[printerName] = false;
            }
        });
    }

}

