/**
 * Created by xiashan on 18/3/7.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { OrderService } from '../services/order.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Order } from '../shared/models/order.model';
import { OrderAgent } from '../shared/models/order-agent.model';
import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-topics',
  templateUrl: './order-agents.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderAgentsComponent implements OnInit {

  order = new Order();
  orderAgents: OrderAgent[] = [];
  isLoading = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderService: OrderService,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.orderService.getOrder(id).subscribe(
      (data: Order) => {
        this.order = data;
        this.orderAgents = data.agentList;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  exportList(id) {
    window.location.href = `/api/order/agent-export/${id}`;
  }

  back() {
    window.history.back();
  }
}
