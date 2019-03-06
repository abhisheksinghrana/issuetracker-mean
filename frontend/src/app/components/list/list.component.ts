import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { IssueService } from 'src/app/issue.service';
import { Issue } from 'src/app/issue.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  issues: Issue[];
  displayedColumns = ['title', 'responsible', 'severity', 'status', 'actions'];

  constructor(private _issueService: IssueService, private _router: Router) {}

  ngOnInit() {
    this.fetchIssues();
  }

  fetchIssues() {
    this._issueService
      .get()
      .pipe(first())
      .subscribe((data: Issue[]) => {
        this.issues = data;
      });
  }

  editIssue(id: string) {
    this._router.navigate([`/edit/${id}`]);
  }

  deleteIssue(id: string) {
    this._issueService
      .delete(id)
      .pipe(first())
      .subscribe(() => {
        this.fetchIssues();
      });
  }
}
