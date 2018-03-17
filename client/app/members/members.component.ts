import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MemberService } from '../services/member.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Member } from '../shared/models/member.model';

import { AgentService } from '../services/agent.service';
import { Agent } from '../shared/models/agent.model';
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {

  member = new Member();
  members: Member[] = [];
  isLoading = true;
  isEditing = false;

  agent = new Agent();
  agents: Agent[] = [];

  pageInfo: any = {
    page: 1,
  };

  searchMemberForm: any = {
    _agent: '',
  };

  addMemberForm: FormGroup;
  bid = new FormControl('', Validators.required);
  username = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  _agent = new FormControl('', Validators.required);

  constructor(private memberService: MemberService,
              private agentService: AgentService,
              private formBuilder: FormBuilder,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getMembers();
    this.getAgents();
    this.addMemberForm = this.formBuilder.group({
      bid: this.bid,
      username: this.username,
      name: this.name,
      _agent: this._agent,
    });
  }

  getMembers() {
    const param = Object.assign(this.searchMemberForm);
    param.pageNum = this.pageInfo.page;
    param.pageSize = this.config.pageSize;
    this.memberService.getMembers(param).subscribe(
      (data: any) => {
        this.pageInfo.totalRecord = data.totalRecord;
        this.members = data.retData;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getAgents() {
    this.agentService.getAgents().subscribe(
      (data: any) => this.agents = data.retData,
      error => console.log(error)
    );
  }

  addMember() {
    this.memberService.addMember(this.addMemberForm.value).subscribe(
      (res: any) => {
        // 关联agent
        res._agent = this.agents.filter(item => item._id === res._agent)[0];
        this.members.push(res);
        this.addMemberForm.reset();
        this.addMemberForm.patchValue({
          _agent: '',
        });
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(member: Member) {
    this.isEditing = true;
    this.member = member;
  }

  cancelEditing() {
    this.isEditing = false;
    this.member = new Member();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the members to reset the editing
    this.getMembers();
  }

  editMember(member: Member) {
    this.memberService.editMember(member).subscribe(
      () => {
        this.isEditing = false;
        this.member = member;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteMember(member: Member) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.memberService.deleteMember(member).subscribe(
        () => {
          const pos = this.members.map(elem => elem._id).indexOf(member._id);
          this.members.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  changePage() {
    this.getMembers();
  }

}
