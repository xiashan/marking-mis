import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MarkerService } from '../services/marker.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Marker } from '../shared/models/marker.model';

import { AgentService } from '../services/agent.service';
import { Agent } from '../shared/models/agent.model';
import {NgbPaginationConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styleUrls: ['./markers.component.css']
})
export class MarkersComponent implements OnInit {

  marker = new Marker();
  markers: Marker[] = [];
  isLoading = true;
  isEditing = false;

  agent = new Agent();
  agents: Agent[] = [];

  page = 1;
  totalRecord = 0;

  searchMarkerForm = {
    agent: '',
  };

  addMarkerForm: FormGroup;
  bid = new FormControl('', Validators.required);
  username = new FormControl('', Validators.required);
  name = new FormControl('', Validators.required);
  agent = new FormControl('', Validators.required);

  constructor(private markerService: MarkerService,
              private agentService: AgentService,
              private formBuilder: FormBuilder,
              private config: NgbPaginationConfig,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getMarkers();
    this.getAgents();
    this.addMarkerForm = this.formBuilder.group({
      bid: this.bid,
      username: this.username,
      name: this.name,
      agent: this.agent,
    });
  }

  getMarkers() {
    const param = Object.assign(this.searchMarkerForm);
    param.pageNum = this.page;
    param.pageSize = this.config.pageSize;
    this.markerService.getMarkers(param).subscribe(
      data => this.markers = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getAgents() {
    this.agentService.getAgents().subscribe(
      data => this.agents = data,
      error => console.log(error)
    );
  }

  addMarker() {
    this.markerService.addMarker(this.addMarkerForm.value).subscribe(
      res => {
        this.markers.push(res);
        this.addMarkerForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(marker: Marker) {
    this.isEditing = true;
    this.marker = marker;
  }

  cancelEditing() {
    this.isEditing = false;
    this.marker = new Marker();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the markers to reset the editing
    this.getMarkers();
  }

  editMarker(marker: Marker) {
    this.markerService.editMarker(marker).subscribe(
      () => {
        this.isEditing = false;
        this.marker = marker;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteMarker(marker: Marker) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.markerService.deleteMarker(marker).subscribe(
        () => {
          const pos = this.markers.map(elem => elem._id).indexOf(marker._id);
          this.markers.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

  changePage() {
    alert(this.page);
  }

}
