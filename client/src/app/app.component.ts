import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private accountService = inject(AccountService);

  title = 'client';

  // ===============================
  // App startup
  // Restores the logged-in user from session storage when the page refreshes.
  // ===============================
  ngOnInit(): void {
    this.accountService.restoreCurrentUser();
  }
}