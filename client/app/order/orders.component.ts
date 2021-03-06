/**
 * Created by xiashan on 18/3/7.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { OrderService } from '../services/order.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Order } from '../shared/models/order.model';
import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-topics',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  order = new Order();
  orders: Order[] = [];
  isLoading = true;

  pageInfo: any = {
    page: 1,
  };

  searchOrderForm = {};

  constructor(private orderService: OrderService,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    const param = Object.assign(this.searchOrderForm);
    param.pageNum = this.pageInfo.page;
    param.pageSize = this.config.pageSize;

    this.orderService.getOrders(param).subscribe(
      (data: any) => {
        this.pageInfo.page = data.pageNum;
        this.pageInfo.totalRecord = data.totalRecord;
        this.orders = data.retData;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  deleteOrder(order: Order) {
    if (window.confirm('确认要删除订单么?')) {
      this.orderService.deleteOrder(order).subscribe(
        () => {
          const pos = this.orders.map(elem => elem._id).indexOf(order._id);
          this.orders.splice(pos, 1);
          this.toast.setMessage('订单删除成功.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  changePage() {
    this.getOrders();
  }
}
