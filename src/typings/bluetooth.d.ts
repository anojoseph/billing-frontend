// src/typings/bluetooth.d.ts

interface Navigator {
  bluetooth: {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
  };
}

// Declare these if they're missing
interface BluetoothDevice {
  gatt: BluetoothRemoteGATTServer | null;
}

interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  getPrimaryService(id: string | number | BluetoothUUID): Promise<BluetoothRemoteGATTService>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic(id: string | number | BluetoothUUID): Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTCharacteristic {
  writeValue(data: BufferSource): Promise<void>;
}

type BluetoothUUID = string | number;

interface RequestDeviceOptions {
  filters: { services: string[] }[];
}

interface BluetoothRemoteGATTServer {
  connected: boolean;
  disconnect: () => void;
}

