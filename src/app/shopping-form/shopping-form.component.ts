import { ShoppingCart } from 'shared/models/shopping-cart';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';
import { Order } from 'shared/models/order';

@Component({
  selector: 'shopping-form',
  templateUrl: './shopping-form.component.html',
  styleUrls: ['./shopping-form.component.css']
})
export class ShoppingFormComponent implements OnInit, OnDestroy {
  @Input('cart') cart:ShoppingCart;
  shipping = {}; 
  userSubscription: Subscription;
  userId: string;
  constructor(
    private router: Router,
    private authService:AuthService,
    private orderService: OrderService){}

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => this.userId = user.uid);
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
  async placeOrder() {
    let order = new Order(this.userId,this.Shop, this.cart);
    let result = await this.orderService.placeOrder(order);
    this.router.navigate(['/order-success', result.key]);
  
  }   
  public Shop: Shopping = {
    name:'',
    addressLine1:'',
    addressLine2:'',
    city:''
  }
}
export interface Shopping {
  name:string;
  addressLine1:string;
  addressLine2:string;
  city:string;
}