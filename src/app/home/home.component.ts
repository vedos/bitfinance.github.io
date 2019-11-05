import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BudgetResponse, BudgetRequest } from '../_models'
import { AlertService, BudgetService } from '../_services';
import { first } from 'rxjs/operators';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  budgetForm: FormGroup;
  request: BudgetRequest;
  loading = false;
  submitted = false;
  dateTo: NgbDateStruct;
  dateFrom: NgbDateStruct;
  budgets: BudgetResponse[] = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private budgetService: BudgetService,
    private alertService: AlertService,
    ) {
      this.budgets.push(
        {
          id:1,
          amount: 2,
          name: "",
          date_created: new Date(),
          date_from: new Date(),
          date_to: new Date(),
          owner: [1]
        }
      );
    }

  ngOnInit() {
    this.budgetForm = this.formBuilder.group({
      name: ['', Validators.required],
      amount: ['', Validators.required],
      date_to: Date,
      date_from: Date
    });
    //this.loadBudgets();
  }

  //load all budgets from api
  loadBudgets()
  {
    this.budgetService.getAll().subscribe(
      data => {
        this.budgets = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  selectBudget(id: string)
  {
    this.router.navigate([`/transaction/${id}`], { skipLocationChange: true });
  }


  // convenience getter for easy access to form fields
  get f() { return this.budgetForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.budgetForm.invalid) {
      return;
    }
    this.budgetForm.value.date_to = this.convertToDate(this.dateTo).toJSON();
    this.budgetForm.value.date_from = this.convertToDate(this.dateFrom).toJSON();

    this.loading = true;
    
    this.budgetService.budget(this.budgetForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loadBudgets(); //reload budgets after new is added
          this.resetForm();
          this.alertService.success('Budget ' + data.name + ' successfully added', true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  resetForm(){
    this.loading = false;
    this.budgetForm.reset();
    this.dateFrom = null;
    this.dateTo = null;
    Object.keys(this.budgetForm.controls).forEach(key => { //clear all errors
      this.budgetForm.controls[key].setErrors(null)
    });
  }

  convertToDate(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }

}

