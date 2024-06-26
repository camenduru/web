import { inject, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Subscription, Observer, Observable, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import SockJS from 'sockjs-client';
import { RxStomp } from '@stomp/rx-stomp';

import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { AccountService } from '../auth/account.service';
import { Account } from '../auth/account.model';
import { TrackerActivity } from './tracker-activity.model';

const DESTINATION_TRACKER = '/topic/tracker';
const DESTINATION_ACTIVITY = '/topic/activity';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  account: Account = {} as Account;
  private messageNotify = new Subject<string>();
  private messageChat = new Subject<string>();

  private rxStomp?: RxStomp;
  private routerSubscription: Subscription | null = null;

  private router = inject(Router);
  private accountService = inject(AccountService);
  private authServerProvider = inject(AuthServerProvider);
  private location = inject(Location);

  setup(): void {
    this.rxStomp = new RxStomp();

    this.accountService.getAuthenticationState().subscribe({
      next: (account: Account | null) => {
        if (account) {
          this.account = account;
          this.connect();
        } else {
          this.disconnect();
        }
      },
    });

    this.rxStomp.connected$.subscribe(() => {
      this.sendActivity();

      this.routerSubscription = this.router.events
        .pipe(filter((event: Event) => event instanceof NavigationEnd))
        .subscribe(() => this.sendActivity());

      this.subscribeToNotifyUser();
      this.subscribeToChatUser();
    });
  }

  get stomp(): RxStomp {
    if (!this.rxStomp) {
      throw new Error('Stomp connection not initialized');
    }
    return this.rxStomp;
  }

  public subscribe(observer: Partial<Observer<TrackerActivity>>): Subscription {
    return (
      this.stomp
        .watch(DESTINATION_TRACKER)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .pipe(map(imessage => JSON.parse(imessage.body)))
        .subscribe(observer)
    );
  }

  public subscribeToNotify(message: string): Observable<string> {
    this.messageNotify.next(message);
    return this.messageNotify.asObservable();
  }

  public subscribeToNotifyUser(observer?: Partial<Observer<string>>): Subscription {
    const DESTINATION_NOTIFY = '/notify/' + this.account.login;
    return (
      this.stomp
        .watch(DESTINATION_NOTIFY)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .pipe(
          map(imessage => imessage.body),
          tap(message => this.subscribeToNotify(message)),
        )
        .subscribe(observer)
    );
  }

  public subscribeToChat(message: string): Observable<string> {
    this.messageChat.next(message);
    return this.messageChat.asObservable();
  }

  public subscribeToChatUser(observer?: Partial<Observer<string>>): Subscription {
    const DESTINATION_CHAT = '/chat/' + this.account.login;
    return (
      this.stomp
        .watch(DESTINATION_CHAT)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .pipe(
          map(imessage => imessage.body),
          tap(message => this.subscribeToChat(message)),
        )
        .subscribe(observer)
    );
  }

  sendActivity(): void {
    this.stomp.publish({
      destination: DESTINATION_ACTIVITY,
      body: JSON.stringify({ page: this.router.routerState.snapshot.url }),
    });
  }

  sendNotify(): void {
    const DESTINATION_NOTIFY = '/notify/' + this.account.login;
    this.stomp.publish({
      destination: DESTINATION_NOTIFY,
      body: 'DONE',
    });
  }

  private connect(): void {
    this.updateCredentials();
    return this.stomp.activate();
  }

  private disconnect(): Promise<void> {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
      this.routerSubscription = null;
    }
    return this.stomp.deactivate();
  }

  private buildUrl(): string {
    // building absolute path so that websocket doesn't fail when deploying with a context path
    let url = '/websocket/tracker';
    url = this.location.prepareExternalUrl(url);
    const authToken = this.authServerProvider.getToken();
    if (authToken) {
      return `${url}?access_token=${authToken}`;
    }
    return url;
  }

  private updateCredentials(): void {
    this.stomp.configure({
      webSocketFactory: () => SockJS(this.buildUrl()),
    });
  }
}
