import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-placeholder.component.html',
  styleUrl: './page-placeholder.component.css'
})
export class PagePlaceholderComponent implements OnInit {
  private route = inject(ActivatedRoute);

  title = '';
  subtitle = '';

  // ===============================
  // Route data setup
  // Reads title and subtitle from app.routes.ts.
  // ===============================
  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.title = data['title'] ?? 'Page';
      this.subtitle = data['subtitle'] ?? 'This page will be built in a later feature phase.';
    });
  }
}