import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BudgetResponseExt, BudgetRequest } from '../_models'
import { AlertService, BudgetService } from '../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})

export class TransactionComponent implements OnInit {
  closeResult: string;
  id: number;
  budgetInfo: BudgetResponseExt;
  beneficiaryForm: FormGroup;

  constructor(private route: ActivatedRoute,
    private budgetService: BudgetService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
    ) { this.createForm();}

    private createForm() {
      this.beneficiaryForm = this.formBuilder.group({
        userId: ['', Validators.required]
      });
    }
    /*private submitForm() {
      //this.beneficiaryForm.value
      console.log(this.beneficiaryForm.value);
      //this.modal.close(this.beneficiaryForm.value);
      
    }*/

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
        }
      );
    this.getBudget();
    //this.getLocalBudget();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {      
      console.log("Save "+ result);
      //call api if result number
      this.budgetInfo.budget_users.push({ "name": result, "id":result });

    }, (reason) => {
      console.log("Don't save");
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
