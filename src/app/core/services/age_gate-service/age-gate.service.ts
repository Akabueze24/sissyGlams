import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AgeGateService {
  private STORAGE_KEY = 'isAgeVerified';
  private isVerifiedSubject = new BehaviorSubject<boolean>(
    this.checkVerificationStatus(),
  );

  isVerified$ = this.isVerifiedSubject.asObservable();

  private checkVerificationStatus(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  verifyAge(): void {
    localStorage.setItem(this.STORAGE_KEY, 'true');
    this.isVerifiedSubject.next(true);
  }

}
