import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.scss'],
})
export class OtpModalComponent implements OnChanges {
  // ============================================================
  // INPUTS (parent controls these)
  // ============================================================

  /** When true, overlay is shown */
  @Input() open = false;

  @Input() title = 'Verify Your Email';
  @Input() description =
    "We've sent a six-digit verification code to your registered email address.";

  /** Server / parent error (invalid code, expired, etc.) */
  @Input() errorMessage = '';

  /** Disable Verify while HTTP is running */
  @Input() verifying = false;

  /**
   * Seconds until Resend is allowed.
   * Parent sets e.g. 60 after sending a code; we count down locally.
   */
  @Input() resendSeconds = 0;

  // ============================================================
  // OUTPUTS
  // ============================================================

  @Output() closed = new EventEmitter<void>();
  @Output() resend = new EventEmitter<void>();
  /** Emits the full 6-digit string when user clicks Verify */
  @Output() verified = new EventEmitter<string>();

  // ============================================================
  // LOCAL STATE
  // ============================================================

  /** One character per box */
  digits: string[] = ['', '', '', '', '', ''];

  /** Local validation before emit */
  localError = '';

  private timerId: ReturnType<typeof setInterval> | null = null;
   secondsLeft = 0;

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.resetDigits();
      this.localError = '';
    }

    if (changes['resendSeconds'] && this.resendSeconds > 0) {
      this.startTimer(this.resendSeconds);
    }

    if (changes['open'] && !this.open) {
      this.clearTimer();
    }
  }

  // ============================================================
  // TEMPLATE HELPERS
  // ============================================================

  get showError(): boolean {
    return !!(this.localError || this.errorMessage);
  }

  get displayError(): string {
    return this.localError || this.errorMessage;
  }

  get canResend(): boolean {
    return this.secondsLeft <= 0 && !this.verifying;
  }

  get timerLabel(): string {
    const s = Math.max(0, this.secondsLeft);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
  }

  get code(): string {
    return this.digits.join('');
  }

  // ============================================================
  // DIGIT INPUT
  // ============================================================

  onDigitInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/\D/g, '');

    // Paste of full code into first box (or any box)
    if (raw.length > 1) {
      this.applyPaste(raw);
      return;
    }

    this.digits[index] = raw.slice(0, 1);
    this.localError = '';

    if (raw && index < 5) {
      this.focusDigit(index + 1);
    }
  }

  onDigitKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.digits[index] && index > 0) {
      this.focusDigit(index - 1);
    }
  }

  onDigitPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text') ?? '';
    this.applyPaste(text);
  }

  private applyPaste(text: string): void {
    const nums = text.replace(/\D/g, '').slice(0, 6).split('');
    this.digits = ['', '', '', '', '', ''];
    nums.forEach((ch, i) => {
      this.digits[i] = ch;
    });
    this.localError = '';
    const focusAt = Math.min(nums.length, 5);
    setTimeout(() => this.focusDigit(focusAt), 0);
  }

  private focusDigit(index: number): void {
    const el = document.getElementById(
      `otp-digit-${index}`,
    ) as HTMLInputElement | null;
    el?.focus();
    el?.select();
  }

  private resetDigits(): void {
    this.digits = ['', '', '', '', '', ''];
  }

  // ============================================================
  // ACTIONS
  // ============================================================

  onVerify(): void {
    if (this.verifying) {
      return;
    }

    if (this.code.length !== 6) {
      this.localError = 'Please enter the 6-digit code.';
      return;
    }

    this.localError = '';
    this.verified.emit(this.code);
  }

  onResend(): void {
    if (!this.canResend) {
      return;
    }
    this.resend.emit();
  }

  onClose(): void {
    this.resetDigits();
    this.localError = '';
    this.closed.emit();
  }

  // ============================================================
  // TIMER
  // ============================================================

  private startTimer(seconds: number): void {
    this.clearTimer();
    this.secondsLeft = seconds;

    this.timerId = setInterval(() => {
      this.secondsLeft -= 1;
      if (this.secondsLeft <= 0) {
        this.secondsLeft = 0;
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}