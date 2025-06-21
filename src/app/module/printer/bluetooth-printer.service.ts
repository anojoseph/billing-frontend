// bluetooth-printer.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BluetoothPrinterService {
    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private writer: BluetoothRemoteGATTCharacteristic | null = null;

    async connectToPrinter(): Promise<void> {
        try {
            this.device = await (navigator.bluetooth as any).requestDevice({
                filters: [{ namePrefix: 'Printer' }], // or leave out to show all
                optionalServices: [0xFFE0]
            });
            if (!this.device) {
                throw new Error('No device connected');
            }
            const gatt = this.device.gatt;
            if (!gatt) {
                throw new Error('GATT server not available on the selected device');
            }
            this.server = await gatt.connect();
            const service = await this.server?.getPrimaryService(0xFFE0); // Replace with your service UUID
            this.writer = await service?.getCharacteristic(0xFFE1) || null; // Replace with characteristic UUID
            console.log('Connected to printer');
        } catch (error) {
            console.error('Bluetooth connection failed:', error);
        }
    }

    async print(data: string): Promise<void> {
        if (!this.writer) {
            throw new Error('Not connected to printer');
        }
        const encoder = new TextEncoder();
        const payload = encoder.encode(data + '\n');
        try {
            await this.writer.writeValue(payload);
            console.log('Print successful');
        } catch (error) {
            console.error('Print failed:', error);
        }
    }
}
