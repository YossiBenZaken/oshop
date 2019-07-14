import { AngularFireList } from 'angularfire2/database';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
import { Component, OnInit } from '@angular/core';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  cart$;
  constructor(private shoppingCartService: ShoppingCartService) {
  }

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
  }
  clearCart(){
    this.shoppingCartService.clearCart();
  }
}
