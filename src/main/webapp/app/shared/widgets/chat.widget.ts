/* eslint-disable */
import { Component, inject, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';
import { CommonModule } from '@angular/common';
import 'deep-chat';
import { RequestInterceptor } from 'deep-chat/dist/types/interceptors';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';

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

  requestInterceptor: RequestInterceptor = request => {
    request.body = {
      messages: request.body.messages,
      model: JSON.stringify(this.formProperty.findRoot().value),
    };
    request.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: this.authToken,
    };
    return request;
  };
}
