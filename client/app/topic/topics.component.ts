import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { TopicService } from '../services/topic.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Topic } from '../shared/models/topic.model';
import { NgbPaginationConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {

  topic = new Topic();
  topics: Topic[] = [];
  isLoading = true;
  isEditing = false;

  selectedAll: any;
  settleValid: any;

  pageInfo: any = {
    page: 1,
  };

  searchTopicForm = {
    status: '',
  };

  addTopicForm: FormGroup;
  no = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  shortName = new FormControl('', Validators.required);
  total = new FormControl('', Validators.required);
  assessment = new FormControl('', Validators.required);
  note = new FormControl('');

  constructor(private topicService: TopicService,
              private formBuilder: FormBuilder,
              private config: NgbPaginationConfig,
              private modalService: NgbModal,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getTopics();
    this.addTopicForm = this.formBuilder.group({
      no: this.no,
      name: this.name,
      shortName: this.shortName,
      total: this.total,
      assessment: this.assessment,
      note: this.note,
    });
  }

  getTopics() {
    const param = Object.assign(this.searchTopicForm);
    param.pageNum = this.pageInfo.page;
    param.pageSize = this.config.pageSize;

    this.topicService.getTopics(param).subscribe(
      (data: any) => {
        this.pageInfo.page = data.pageNum;
        this.pageInfo.totalRecord = data.totalRecord;
        this.topics = data.retData;
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addTopic() {
    this.topicService.addTopic(this.addTopicForm.value).subscribe(
      res => {
        this.topics.push(res);
        this.addTopicForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(topic: Topic) {
    this.isEditing = true;
    this.topic = topic;
  }

  cancelEditing() {
    this.isEditing = false;
    this.topic = new Topic();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the topics to reset the editing
    this.getTopics();
  }

  editTopic(topic: Topic) {
    this.topicService.editTopic(topic).subscribe(
      () => {
        this.isEditing = false;
        this.topic = topic;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteTopic(topic: Topic) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.topicService.deleteTopic(topic).subscribe(
        () => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  importMarks(topic: Topic) {
    this.topic = topic;
    if (window.confirm('Are you sure you want to import members?')) {
      this.topicService.importMembers(topic).subscribe(
        (res) => {
          console.log(res);
          this.topic.marks = res;
          this.toast.setMessage('item import successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  showMarks(topic: Topic, content: any) {
    this.topic = topic;
    this.modalService.open(content).result.then(
      // 点击关闭按钮
      (result) => {
        // this.closeResult = `Closed with: ${result}`;
      },
      // 点击其他地方关闭弹窗
      (reason) => {
      });
  }

  selectAll() {
    this.topics = this.topics.map((item) => {
      item.selected = this.selectedAll;
      return item;
    });
    this.settleValid = this.topics.some(item => item.selected);
  }

  checkIfAllSelected() {
    this.selectedAll = this.topics.every((item: any) => item.selected);
    this.settleValid = this.topics.some(item => item.selected);
  }

  settleTopic() {
    this.topicService.genOrder(this.topics).subscribe(
      (res) => {
        console.log(res);
        this.toast.setMessage('item import successfully.', 'success');
      },
      error => console.log(error)
    );
  }
}
