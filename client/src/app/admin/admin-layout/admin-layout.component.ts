import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  private router = inject(Router);
  accountService = inject(AccountService);

  // ===============================
  // Logout
  // Clears admin token and returns to public home.
  // ===============================
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}