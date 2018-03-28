import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AgentService } from '../services/agent.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Agent } from '../shared/models/agent.model';

import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.css']
})
export class AgentsComponent implements OnInit {

  agent = new Agent();
  agents: Agent[] = [];
  isLoading = true;
  isEditing = false;

  pageInfo: any = {
    page: 1,
  };

  addAgentForm: FormGroup;
  name = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  discountPrice = new FormControl('', Validators.required);

  constructor(private agentService: AgentService,
              private formBuilder: FormBuilder,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getAgents();
    this.addAgentForm = this.formBuilder.group({
      name: this.name,
      price: this.price,
      discountPrice: this.discountPrice,
    });
  }

  getAgents() {
    const param = {
      pageNum: this.pageInfo.page,
      pageSize: this.config.pageSize,
    };
    this.agentService.getAgents(param).subscribe(
      (data: any) => {
        this.pageInfo.page = data.pageNum;
        this.pageInfo.totalRecord = data.totalRecord;
        this.agents = data.retData;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addAgent() {
    this.agentService.addAgent(this.addAgentForm.value).subscribe(
      res => {
        this.agents.push(res);
        this.addAgentForm.reset();
        this.toast.setMessage('代理商增加成功.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(agent: Agent) {
    this.isEditing = true;
    this.agent = agent;
  }

  cancelEditing() {
    this.isEditing = false;
    this.agent = new Agent();
    this.toast.setMessage('取消编辑代理商.', 'warning');
    // reload the agents to reset the editing
    this.getAgents();
  }

  editAgent(agent: Agent) {
    this.agentService.editAgent(agent).subscribe(
      () => {
        this.isEditing = false;
        this.agent = agent;
        this.toast.setMessage('代理商编辑成功.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteAgent(agent: Agent) {
    if (window.confirm('确认要删除代理商么?')) {
      this.agentService.deleteAgent(agent).subscribe(
        () => {
          const pos = this.agents.map(elem => elem._id).indexOf(agent._id);
          this.agents.splice(pos, 1);
          this.toast.setMessage('代理商删除成功.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  changePage() {
    console.log(this.pageInfo.page);
  }
}
