import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
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
    settle: '',
  };

  addTopicForm: FormGroup;
  no = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  shortName = new FormControl('', Validators.required);
  total = new FormControl('', Validators.required);
  withhold = new FormControl('', Validators.required);
  note = new FormControl('');

  constructor(public auth: AuthService,
              private topicService: TopicService,
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
      withhold: this.withhold,
      note: this.note,
    });
  }

  getTopics() {
    const param = Object.assign(this.searchTopicForm);
    param.pageNum = this.pageInfo.page;
    param.pageSize = 50;

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
        this.toast.setMessage('题包增加成功.', 'success');
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
    this.toast.setMessage('取消编辑题包.', 'warning');
    // reload the topics to reset the editing
    this.getTopics();
  }

  editTopic(topic: Topic) {
    this.topicService.editTopic(topic).subscribe(
      () => {
        this.isEditing = false;
        this.topic = topic;
        this.toast.setMessage('题包编辑成功.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteTopic(topic: Topic) {
    if (window.confirm('确认要删除题包么?')) {
      this.topicService.deleteTopic(topic).subscribe(
        () => {
          const pos = this.topics.map(elem => elem._id).indexOf(topic._id);
          this.topics.splice(pos, 1);
          this.toast.setMessage('题包删除成功.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  importMarks(topic: Topic) {
    this.topic = topic;
    if (window.confirm('确认要导入标注信息么?')) {
      this.topicService.importMembers(topic).subscribe(
        (res) => {
          console.log(res);
          this.topic.marks = res;
          this.toast.setMessage('信息导入成功.', 'success');
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
      if (!item.settle) {
        item.selected = this.selectedAll;
      }
      return item;
    });
    this.settleValid = this.topics.some(item => item.selected);
  }

  checkIfAllSelected() {
    this.selectedAll = this.topics.every((item: any) => item.selected);
    this.settleValid = this.topics.some(item => item.selected);
  }

  /**
   * 多选题包结算
   */
  settleTopic() {
    if (window.confirm('确认要生成订单么?')) {
      this.topicService.genOrder(this.topics).subscribe(
        (res) => {
          this.toast.setMessage('成功生成订单.', 'success');
          window.location.href = '/orders';
        },
        error => console.log(error)
      );
    }
  }

  fileChange(event, topic) {
    this.topic = topic;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];

      const formData: FormData = new FormData();
      formData.append('_id', topic._id);
      formData.append('file', file, file.name);

      this.topicService.uploadMark(formData).subscribe((res) => {
        this.topic.marks = res;
        this.toast.setMessage('标注信息上传成功.', 'success');
      }, error => console.log(error));
    }
  }

  changePage() {
    this.getTopics();
  }
}
