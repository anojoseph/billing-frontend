export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number; // Change this to selectedQty if that’s what you want
  selectedQty: number;  // Add this field if you're using it
  image?: any;
  addons?: {
    name: string;
    price: number;
    qty: number; // 👈 Add this
  }[];
   addonsAvailable:number
  
  
}
