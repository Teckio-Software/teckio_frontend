import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({ selector: '[countUp]' })
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input('countUp') to = 0;
  @Input() from = 0;
  @Input() duration = 1000;
  @Input() decimals: 0 | 1 | 2 | 3 | 4 = 0;
  @Input() easing = true;

  private rafId: number | null = null;
  private startTime = 0;

  constructor(private el: ElementRef, private r: Renderer2) {}

  ngOnChanges(_: SimpleChanges): void {
    this.cancel();
    this.animate();
  }

  private animate() {
    const start = this.from;
    const end = this.to;
    const dur = Math.max(0, this.duration);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (ts: number) => {
      if (!this.startTime) this.startTime = ts;
      const p0 = Math.min(1, (ts - this.startTime) / dur);
      const p = this.easing ? easeOutCubic(p0) : p0;
      const value = start + (end - start) * p;

      this.r.setProperty(
        this.el.nativeElement,
        'textContent',
        value.toLocaleString('es-MX', {
          minimumFractionDigits: this.decimals,
          maximumFractionDigits: this.decimals,
        })
      );

      if (p0 < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.r.setProperty(
          this.el.nativeElement,
          'textContent',
          end.toLocaleString('es-MX', {
            minimumFractionDigits: this.decimals,
            maximumFractionDigits: this.decimals,
          })
        );
      }
    };

    this.rafId = requestAnimationFrame(step);
  }

  private cancel() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = null;
    this.startTime = 0;
  }

  ngOnDestroy(): void {
    this.cancel();
  }
}
