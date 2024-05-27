/* eslint-disable */
import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { TrackerService } from 'app/core/tracker/tracker.service';

import 'deep-chat';
import { Signals } from 'deep-chat/dist/types/handler';
import { Request } from 'deep-chat/dist/types/request';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'sf-chat-widget',
  templateUrl: 'chat.widget.html',
  imports: [CommonModule],
})
export class ChatWidget extends ControlWidget implements OnInit {
  user: Account = {} as Account;
  authToken: any = {};

  protected accountService = inject(AccountService);
  protected trackerService = inject(TrackerService);

  constructor(private http: HttpClient) {
    super();
  }

  getBearerToken() {
    var authToken = localStorage.getItem('jhi-authenticationToken') || sessionStorage.getItem('jhi-authenticationToken');
    if (authToken) {
      authToken = JSON.parse(authToken);
      return `Bearer ${authToken}`;
    }
    return null;
  }

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe({
      next: (user: Account | null) => {
        if (user) {
          this.user = user;
        }
      },
    });
    this.authToken = this.getBearerToken();
  }

  request: Request = {
    url: '/api/chat',
    method: 'POST',
    handler: (body, signals: Signals) => {
      body.model = JSON.stringify(this.formProperty.findRoot().value);

      this.http
        .post(
          '/api/chat',
          { messages: body.messages, model: body.model },
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: this.authToken,
            }),
          },
        )
        .subscribe(
          response => {},
          error => {
            console.error('Error occurred:', error);
          },
        );

      this.trackerService.subscribeToChat('').subscribe({
        next(message) {
          signals.onResponse({ text: message });
        },
      });
    },
  };
}
