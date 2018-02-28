import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SuitService } from '../services/suit.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Suit } from '../shared/models/suit.model';

@Component({
  selector: 'app-suits',
  templateUrl: './suits.component.html',
  styleUrls: ['./suits.component.css']
})
export class SuitsComponent implements OnInit {

  suit = new Suit();
  suits: Suit[] = [];
  isLoading = true;
  isEditing = false;

  addSuitForm: FormGroup;
  name = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  discountPrice = new FormControl('', Validators.required);

  constructor(private suitService: SuitService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent) { }

  ngOnInit() {
    this.getSuits();
    this.addSuitForm = this.formBuilder.group({
      name: this.name,
      price: this.price,
      discountPrice: this.discountPrice,
    });
  }

  getSuits() {
    this.suitService.getSuits().subscribe(
      data => this.suits = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addSuit() {
    this.suitService.addSuit(this.addSuitForm.value).subscribe(
      res => {
        this.suits.push(res);
        this.addSuitForm.reset();
        this.toast.setMessage('item added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(suit: Suit) {
    this.isEditing = true;
    this.suit = suit;
  }

  cancelEditing() {
    this.isEditing = false;
    this.suit = new Suit();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the suits to reset the editing
    this.getSuits();
  }

  editSuit(suit: Suit) {
    this.suitService.editSuit(suit).subscribe(
      () => {
        this.isEditing = false;
        this.suit = suit;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deleteSuit(suit: Suit) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.suitService.deleteSuit(suit).subscribe(
        () => {
          const pos = this.suits.map(elem => elem._id).indexOf(suit._id);
          this.suits.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
