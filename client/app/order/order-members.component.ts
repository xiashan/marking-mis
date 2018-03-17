/**
 * Created by xiashan on 18/3/7.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Order } from '../shared/models/order.model';
import { OrderService } from '../services/order.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { OrderMember } from '../shared/models/order-member.model';
import { AgentService } from '../services/agent.service';
import { Agent } from '../shared/models/agent.model';

import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-topics',
  templateUrl: './order-members.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderMembersComponent implements OnInit {

  order = new Order();
  orderMembers: OrderMember[] = [];
  isLoading = true;

  agent = new Agent();
  agents: Agent[] = [];

  pageInfo: any = {
    page: 1,
  };

  searchMemberForm: any = {
    _agent: '',
  };

  id = '';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderService: OrderService,
              private agentService: AgentService,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getMembers();
    this.getAgents();
  }

  getAgents() {
    this.agentService.getAgents().subscribe(
      (data: any) => this.agents = data.retData,
      error => console.log(error)
    );
  }

  getMembers() {
    const param = Object.assign(this.searchMemberForm);
    param.pageNum = this.pageInfo.page;
    param.pageSize = this.config.pageSize;
    this.orderService.getOrderMembers(this.id, param).subscribe(
      (data: any) => {
        this.pageInfo.totalRecord = data.totalRecord;
        this.order = data.orderData;
        this.orderMembers = data.retData;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  changePage() {
    this.getMembers();
  }

  exportList(id) {
    const query = [];
    Object.keys(this.searchMemberForm).forEach((key) => {
      if (this.searchMemberForm[key] !== '' && this.searchMemberForm[key] !== null) {
        query.push(`${key}=${encodeURIComponent(this.searchMemberForm[key])}`);
      }
    });
    window.location.href = `/api/order/member-export/${id}?${query.join('&')}`;
  }

  back() {
    window.history.back();
  }
}
