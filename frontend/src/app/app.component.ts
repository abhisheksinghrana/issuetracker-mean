import { Component, OnInit } from '@angular/core';

import { IssueService } from './issue.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'issue-tracker';

  constructor(private _issueService: IssueService) {}

  ngOnInit() {}
}
