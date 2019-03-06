import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';

import { IssueService } from 'src/app/issue.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  id: string;
  issue: any = {};
  updateForm: FormGroup;
  unsubscribe$: Subject<any> = new Subject();

  constructor(
    private _issueService: IssueService,
    private _router: Router,
    private _route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private _fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.updateForm = this._fb.group({
      title: ['', Validators.required],
      responsible: '',
      description: '',
      severity: '',
      status: ''
    });
  }

  ngOnInit() {
    this._route.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.id = params.id;
      this._issueService
        .getById(this.id)
        .pipe(first())
        .subscribe(res => {
          this.issue = res;
          this.updateForm.patchValue(this.issue);
        });
    });
  }

  updateIssue() {
    let issue = this.updateForm.value;
    issue.id = this.id;
    this._issueService
      .put(issue)
      .pipe(first())
      .subscribe(() => {
        this.snackBar.open('Issue updated successfully', 'OK', {
          duration: 3000
        });
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
