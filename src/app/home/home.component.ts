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
    private alertService: AlertService) {
     
    }

  ngOnInit() {
    this.budgetForm = this.formBuilder.group({
      budgetName: ['', Validators.required],
      amount: ['', Validators.required],
      dateTo: Date,
      dateFrom: Date
    });
    this.loadBudgets();
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
    this.budgetForm.value.dateTo = this.convertToDate(this.dateTo);
    this.budgetForm.value.dateFrom = this.convertToDate(this.dateFrom);

    this.loading = true;

    console.log(this.budgetForm.value);

    
    this.budgetService.budget(this.budgetForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loadBudgets(); //reload budgets after new is added
          this.alertService.success('Budget ' + data.name + ' successfully added', true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  convertToDate(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }
}

