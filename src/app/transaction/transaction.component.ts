import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BudgetResponseExt, TransactionViewModel } from '../_models'
import { AlertService, BudgetService, TransactionService } from '../_services';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit {
  id: number;
  page :number = 1;
  pageSize :number = 5;
  budgetInfo: BudgetResponseExt;
  transactionForm: FormGroup;
  transactions: TransactionViewModel[];
  beneficiaryForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private budgetService: BudgetService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
    ) { 
      this.budgetInfo = new BudgetResponseExt(); 
      this.transactions = [];
    }

    private createBeneficiaryForm() {
      this.beneficiaryForm = this.formBuilder.group({
        userId: ['', Validators.required]
      });
    }

    private createTransactionForm() {
      this.transactionForm = this.formBuilder.group({
        description: ['', Validators.required],
        amount: ['', Validators.required],
        //type: [''],
        //datetime:[''],
        budget: ['']
      });
    }

  ngOnInit() {
    this.createBeneficiaryForm();
    this.createTransactionForm();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      );
    this.getBudget();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
      //modal saved
      if(result === this.transactionForm.value){ //check which modal is triggered
        //this.transactionForm.value.datetime = this.convertToDate(this.transactionForm.value.datetime).toJSON();
        this.transactionForm.value.budget = this.id;
        console.log(this.transactionForm.value);
        this.transactionService.transaction(this.transactionForm.value).subscribe(
          data => {
            this.resetForm();
            this.getTransactions(); //reload transactions
            //this.transactions.push(data)
            this.alertService.success("Successful transaction on budget " + this.budgetInfo.name);
          },
          error => {
            this.alertService.error(error);
          });
      }else{
      this.budgetService.beneficiary(this.budgetInfo.id,  { "beneficiary": result }).subscribe(
        data => {
          this.budgetInfo = data;
          this.alertService.success("New user added to budget " + this.budgetInfo.name);
        },
        error => {
          this.alertService.error(error);
        });
      }
    }, (reason) => {
      //modal closed
      console.log("close");
    });
  }

  getBudget() {
    this.budgetService.get(this.id).subscribe(
      data => {
        this.budgetInfo = data;
        this.getTransactions();
      },
      error => {
        this.alertService.error(error);
      });
  }

  getTransactions() {
    this.transactionService.getAll().pipe(
      map(transactions => {
        const mapped: TransactionViewModel[] = [];
        for (let transaction of transactions.filter(x=>x.budget === this.budgetInfo.id)) {
          const _a = new TransactionViewModel();
          _a.person = this.budgetInfo.budget_users.find(x => x.id === transaction.person).name;
          _a.id = transaction.id;
          _a.amount = transaction.amount;
          _a.description = transaction.description;
          _a.datetime = transaction.datetime;
          _a.type = transaction.type;
          mapped.push(_a);
        }
        return mapped;
      })
    ).subscribe(
      data => {
        this.transactions = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  convertToDate(date: NgbDateStruct): Date {
    return date ? new Date(date.year, date.month - 1, date.day) : null;
  }

  resetForm(){
    this.transactionForm.reset();
    Object.keys(this.transactionForm.controls).forEach(key => { //clear all errors
      this.transactionForm.controls[key].setErrors(null)
    });
  }
}
