import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BudgetResponseExt, BudgetRequest, TransactionResponse, TransactionViewModel } from '../_models'
import { AlertService, BudgetService, TransactionService } from '../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit {
  id: number;
  budgetInfo: BudgetResponseExt;
  transactions: TransactionViewModel[];
  beneficiaryForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private budgetService: BudgetService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
    ) { this.createForm();}

    private createForm() {
      this.beneficiaryForm = this.formBuilder.group({
        userId: ['', Validators.required]
      });
    }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      );
    this.getBudget();
    this.getTransactions();
   // this.getLocalBudget();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
      //modal saved
      this.budgetService.beneficiary(result).subscribe(
        data => {
          this.budgetInfo = data;
          this.alertService.success("New user added to budget " + this.budgetInfo.name);
        },
        error => {
          this.alertService.error(error);
        });
    }, (reason) => {
      //modal closed
    });
  }

  getBudget() {
    this.budgetService.get(this.id).subscribe(
      data => {
        this.budgetInfo = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  getTransactions() {
    this.transactionService.getAll().pipe(
      map(transactions => {
        const mapped: TransactionViewModel[] = [];
        for (let transaction of transactions) {
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

  //for testing purpose since api is not working
  getLocalBudget() {
    this.budgetInfo = {
      "id": 77,
      "name": "Home",
      "amount": 2000.00,
      "date_from": new Date("2019-11-04T16:51:03Z"),
      "date_to": null,
      "date_created":  new Date("2019-11-04T16:51:03Z"),
      "owner": [11],
      "budget_users": [
        {
          "name": "eurobit",
          "id":1
        },
        {
          "name": "eurobit1",
          "id":2
        }
      ] 
    }
  }
}
