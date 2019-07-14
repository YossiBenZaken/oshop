import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {

  constructor(private db: AngularFireDatabase, private shoppingCartService: ShoppingCartService) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart();
    return result;
  }

  getOrders() { 
    const productRef = this.db.list('/orders', ref => ref.orderByChild('datePlaced'));
    return productRef.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}));
    }));
  }

  getOrdersByUser(userId: string) {
    const ordersRef = this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId));
     return ordersRef.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}));
    }));
    //return this.db.list('/orders', ref => ref.orderByChild('userId').equalTo(userId));
  }
  get(orderId) {
    return this.db.object('/orders/' + orderId).valueChanges();
  }
}
