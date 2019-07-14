import { Observable } from 'rxjs/Observable';
import { Product } from 'shared/models/product';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { take,map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { ShoppingCart } from 'shared/models/shopping-cart';
@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }
  private async getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
    let result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }
  private async updateItem(product: Product, change: number) {
    let cartId=await this.getOrCreateCartId();
    let item$= this.getItem(cartId,product.key);
    item$.snapshotChanges().pipe(take(1)).subscribe((i: any) => {
      let it = i.payload.val();
      if(it){
        let quantity = it.quantity + change;
        if(quantity === 0) item$.remove();
        else item$.update({ 
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price, 
          quantity: it.quantity + change
        });
      } else {
        item$.update({ title: product.title,
          imageUrl: product.imageUrl,
          price: product.price, 
          quantity: change
        });
      }
    });
  }

  async addToCart(product: Product){
    this.updateItem(product,1);
  }
  async removeFromCart(product: Product){
    this.updateItem(product,-1);
  }
  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId)
    .snapshotChanges().pipe(map((x:any) => {
      return new ShoppingCart(x.payload.val().items);
    }));
  }
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }
}