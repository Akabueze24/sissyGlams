import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AgeGateService } from './core/services/age_gate-service/age-gate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'sissy-glams';

  isVerified$!: Observable<boolean>;

  showRestrictedPage = false;

  constructor(private ageGateService: AgeGateService) {}

  ngOnInit(): void {
    this.isVerified$ = this.ageGateService.isVerified$;

    this.ageGateService.isVerified$.subscribe(isVerified => {
      if (isVerified) {
        // User passed the age gate
        document.body.style.overflow = '';
      } else {
        // Age gate is active
        document.body.style.overflow = 'hidden';
      }
    });
  }

  onConfirm(): void {
    this.ageGateService.verifyAge();
  }

  onReject(): void {
    this.showRestrictedPage = true;

    // Keep the page locked
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // Restore normal scrolling
    document.body.style.overflow = '';
  }
}