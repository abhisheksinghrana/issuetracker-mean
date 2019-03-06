import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { IssueService } from 'src/app/issue.service';

import { Issue } from 'src/app/issue.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private _issueService: IssueService,
    private _fb: FormBuilder,
    private _router: Router
  ) {
    this.createForm = _fb.group({
      title: ['', Validators.required],
      responsible: '',
      description: '',
      severity: ''
    });
  }

  addIssue() {
    let issue: Issue = this.createForm.value;
    this._issueService
      .post(issue)
      .pipe(first())
      .subscribe(() => {
        this._router.navigate(['/list']);
      });
  }

  ngOnInit() {}
}
