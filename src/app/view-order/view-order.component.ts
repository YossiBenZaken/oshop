import { Product } from './../shared/models/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'shared/services/order.service';
import { Order } from 'shared/models/order';
import { ShoppingCart } from 'shared/models/shopping-cart';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {
  id;
  order;
  items:any[];
  products: Product[] =[];
  constructor(private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService) {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.orderService.get(this.id).subscribe(p => this.order = p);
    }
    console.log(this.items);
  }

  getItems(){
  }
  ngOnInit() {

  }

}
