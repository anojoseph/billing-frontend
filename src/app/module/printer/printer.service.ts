import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  private device: BluetoothDevice | null = null;
  private server: BluetoothRemoteGATTServer | null = null;
  private service: BluetoothRemoteGATTService | null = null;
  private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

  // Update these to match your printer's BLE service + characteristic UUIDs
  private serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';  // Example BLE serial service
  private characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; // Example BLE serial characteristic

  async connectToPrinter(): Promise<void> {
    try {
      this.device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [this.serviceUUID] }]
      });

      console.log(this.device)

      this.server = await this.device.gatt?.connect() ?? null;
      if (!this.server) throw new Error('Failed to connect GATT server');

      this.service = await this.server.getPrimaryService(this.serviceUUID);
      this.characteristic = await this.service.getCharacteristic(this.characteristicUUID);

      console.log('✅ Printer connected');
    } catch (error) {
      console.error('❌ Failed to connect to printer', error);
    }
  }

  async print(text: string): Promise<void> {
    if (!this.characteristic) {
      console.error('❌ Printer not connected');
      return;
    }
    const ESC = 0x1B;
    const GS = 0x1D;
    let commands: number[] = [];
    commands.push(ESC, 0x40);
    commands = commands.concat([...new TextEncoder().encode(text + '\n')]);
    commands.push(ESC, 0x64, 0x03);
    commands.push(GS, 0x56, 0x00);
    const data = new Uint8Array(commands);

    try {
      await this.characteristic.writeValue(data);
      console.log('✅ Printed successfully');
    } catch (error) {
      console.error('❌ Failed to print', error);
    }
  }

  async disconnect(): Promise<void> {
  try {
    if (this.device && this.device.gatt) {
      if (this.device.gatt.connected) {
        this.device.gatt.disconnect();
        console.log('🔌 Printer disconnected');
      } else {
        console.log('Printer already disconnected');
      }
    }
  } catch (error) {
    console.error('❌ Failed to disconnect printer!', error);
  }
}

}
