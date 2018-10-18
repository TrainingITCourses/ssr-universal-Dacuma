import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Options } from '../options';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'dcm-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() values = [];
  @Output() optionChange = new EventEmitter();
  @Output() valueChange = new EventEmitter();

  optionsForm: FormGroup;
  public option = Options.status;
  valuesForm: FormGroup;

  constructor() {
    this.optionsForm = new FormGroup({
      option: new FormControl(null)
    });
    this.optionsForm.controls['option'].setValue(this.option, { onlySelf: true });

    this.valuesForm = new FormGroup({
      value: new FormControl(null)
    });
  }

  ngOnInit() {
    this.initForms();
  }

  initForms(): void {
    this.optionsForm.valueChanges.subscribe(val => {
      this.optionChange.next(val.option);
      this.valuesForm.controls['value'].setValue(null);
    });
    this.valuesForm.valueChanges.subscribe(val => {
      this.valueChange.next(val.value);
    });
  }
}
