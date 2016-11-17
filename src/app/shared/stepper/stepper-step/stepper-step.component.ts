import {Component, OnInit, ElementRef} from '@angular/core';

@Component({
  selector: 'grf-stepper-step',
  templateUrl: './stepper-step.component.html',
  styleUrls: ['./stepper-step.component.scss']
})
export class StepperStepComponent implements OnInit {

  constructor(public elementRef: ElementRef) { }

  ngOnInit() {
  }

}
