import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { first, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { selectCartCount, selectCartItems, selectCartTotal, selectCartTotalPrice } from './cart.selectors';
import { clearCart, removeFromCart, updateCartItem } from './cart.actions';
import { CartItem } from './cart.model';
import { cartService } from './cart.service'
import { BluetoothPrinterService } from '../../printer/bluetooth-printer.service';
import { PaymentTypeDialogComponent } from '../payment-dialog/payment-type-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddonDialogComponent } from '../food-menu/addon-dialog.component';
import { FoodMenuService } from '../food-menu/foodmenu.service';
import { SettingsService } from '../../admin/settings/general-settings/generasetting/generasettings.service';



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})

export class CartComponent implements OnInit {
  cart$: Observable<CartItem[]> = this.store.select(selectCartItems);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);
  cartTotalPrice$: Observable<number> = this.store.select(selectCartTotalPrice);
  tableNumber: any;
  table: any;
  cartCount$: Observable<number>;
  orderType: string = 'Bill';
  isLoading: boolean = false;
  discountType: 'percentage' | 'amount' = 'percentage';
  discountValue: number = 0;
  finalTotalPrice: number = 0;
  taxAmount: number = 0;
  sgst: number = 0;
  cgst: number = 0;
  grandTotal: number = 0;
  finalTotal: number = 0;
  roundOff: number = 0;
  public Math = Math;
  taxstatus: any;


  constructor(
    private store: Store,
    private toastr: ToastrService,
    private cartService: cartService,
    private btPrinter: BluetoothPrinterService,
    private dialog: MatDialog,
    private foodmenuservice: FoodMenuService,
    private settingsService: SettingsService
  ) {
    this.cartCount$ = this.store.select(selectCartCount);
  }

  ngOnInit(): void {
    this.gettables();
    this.loadTaxSettings();
  }

  loadTaxSettings() {
    this.settingsService.getSettings().subscribe(
      (data: any) => {
        this.taxstatus = data?.tax_status || false;
        if (data && data?.tax_status) {
          this.sgst = data.sgst ?? 0;
          this.cgst = data.cgst ?? 0;
          this.taxAmount = this.sgst + this.cgst;
        }
      },
      (error) => {
        this.toastr.error('Failed to load tax settings');
        console.error('Settings error:', error);
      }
    );
  }


  gettables() {
    this.cartService.gettables().subscribe(
      (resp) => {
        this.table = resp;
      },
      (error) => {
        this.toastr.error(error.message || 'Error fetching table');
      }
    );
  }

  selecttable(type: any): void {
    this.tableNumber = this.tableNumber === type._id ? '' : type._id;
  }

  // Remove item from the cart
  removeFromCart(item: CartItem): void {
    this.store.dispatch(removeFromCart({ productId: item.id }));
  }

  updateQuantity(order: CartItem, change: number): void {
    const updatedQuantity = order.selectedQty + change;
    if (updatedQuantity >= 1) {
      this.store.dispatch(updateCartItem({ productId: order.id, quantity: updatedQuantity }));

    }
  }


  checkoutDisabled(): boolean {
    if (this.orderType === 'Dine-in') {
      return !(this.tableNumber && this.cartCount$);
    }
    return !(this.cartCount$);
  }

  submitOrder() {
    this.cart$.pipe(first()).subscribe(cartItems => {
      if (!cartItems.length) {
        this.toastr.warning('Cart is empty!');
        return;
      }

      const proceedWithOrder = (paymentType?: string) => {
        const orderData: any = {
          tableId: this.orderType === 'Dine-in' ? this.tableNumber : null,
          orderType: this.orderType,
          items: cartItems,
          ...(paymentType && { paymentType }), // only include if exists
          ...(this.orderType !== 'Dine-in' && this.discountValue > 0 && {
            discountType: this.discountType,
            discountValue: this.discountValue
          })
        };


        this.isLoading = true;
        this.cartService.createOrder(orderData).subscribe(
          (response) => {
            this.toastr.success(response.message);
            this.store.dispatch(clearCart());

            const order = response.order;
            this.taxAmount = order.taxAmount || 0;
            this.sgst = order.sgst || 0;
            this.cgst = order.cgst || 0;
            this.grandTotal = order.grandTotal || 0;
            this.finalTotal = Math.round(this.grandTotal);
            this.roundOff = this.finalTotal - this.grandTotal;

            this.cartService.printOrder(response.order._id).subscribe(
              (printResponse) => {
                console.log(printResponse)
                if (printResponse.printContent) {
                  this.toastr.success('Printed successfully.');
                }
                this.isLoading = false;
              },
              (error) => {
                this.toastr.error(error.error?.message);
                this.isLoading = false;
              }
            );
          },
          (error) => {
            this.toastr.error(error.error.message || 'Failed to create order');
            this.isLoading = false;
          }
        );
      };

      // 🟨 For Dine-in: Skip asking for payment type
      if (this.orderType === 'Dine-in') {
        proceedWithOrder(); // no paymentType
      } else {
        // 🟩 For Takeaway and Bill: Ask for payment type
        const dialogRef = this.dialog.open(PaymentTypeDialogComponent, {
          width: '500px',
          disableClose: true
        });

        dialogRef.afterClosed().subscribe(paymentType => {
          if (!paymentType) return;
          proceedWithOrder(paymentType);
        });
      }
    });
  }

  getAddonTotal(order: CartItem): number {
    return order.addons?.reduce(
      (sum, addon) => sum + (addon.price * (addon.qty || 1)),
      0
    ) || 0;
  }

  editAddons(order: CartItem) {
    this.foodmenuservice.getfoodbyid(order.id).subscribe((food: any) => {
      const baseAddons = food?.addons || [];

      // Merge with existing cart addons
      const enrichedAddons = baseAddons.map((addon: any) => {
        const existing = order.addons?.find((a: any) => a.name === addon.name);
        return {
          ...addon,
          qty: existing?.qty ?? 1
        };
      });

      const dialogRef = this.dialog.open(AddonDialogComponent, {
        width: '400px',
        data: {
          addons: enrichedAddons
        }
      });

      dialogRef.afterClosed().subscribe((selectedAddons) => {
        if (!selectedAddons) return;

        this.store.dispatch(updateCartItem({
          productId: order.id,
          quantity: order.selectedQty,
          addons: selectedAddons
        }));
      });

    }, error => {
      this.toastr.error('Failed to fetch addon info');
    });
  }

  getDiscountedTotal(originalTotal: number): number {
    if (this.discountType === 'percentage') {
      const discountAmount = (this.discountValue / 100) * originalTotal;
      return Math.max(originalTotal - discountAmount, 0); // prevent negative
    } else {
      return Math.max(originalTotal - this.discountValue, 0);
    }
  }

  getEstimatedTaxBreakdown(total: number) {
    // Step 1: Apply tax first
    const sgstAmount = (this.sgst / 100) * total;
    const cgstAmount = (this.cgst / 100) * total;
    const taxAmount = sgstAmount + cgstAmount;

    const taxedTotal = total + taxAmount;

    // Step 2: Apply discount on taxed amount
    let discountAmount = 0;
    if (this.discountType === 'percentage') {
      discountAmount = (this.discountValue / 100) * taxedTotal;
    } else {
      discountAmount = this.discountValue;
    }

    const grandTotal = Math.max(taxedTotal - discountAmount, 0);
    const roundOff = Math.round(grandTotal) - grandTotal;
    const finalTotal = Math.round(grandTotal);

    return {
      taxedTotal,
      sgstAmount,
      cgstAmount,
      taxAmount,
      discountAmount,
      grandTotal,
      roundOff,
      finalTotal
    };
  }





}
