import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from 'app/shared/language';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
  imports: [TranslateDirective, FormsModule],
})
export default class FooterComponent implements OnInit {
  authToken: any = {};

  redeemCode: string = '';
  responseText: string = '';

  getBearerToken(): string {
    let authToken = localStorage.getItem('jhi-authenticationToken') ?? sessionStorage.getItem('jhi-authenticationToken');
    if (authToken) {
      authToken = JSON.parse(authToken);
      return `Bearer ${authToken}`;
    }
    return '';
  }

  ngOnInit(): void {
    this.authToken = this.getBearerToken();
  }

  onRedeem(): void {
    const url = `${location.protocol}/api/code?redeem=${this.redeemCode}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: this.authToken,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        this.responseText = data;
      })
      .catch(error => {
        this.responseText = error;
      });
  }

  public aboutDivRemove(): void {
    const aboutDiv = document.getElementById('aboutDiv');
    if (aboutDiv) {
      aboutDiv.remove();
    }
  }
}
