import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
})
export class ProgressBarComponent implements OnInit {
  @Input() progress = 0;
  @Input() color = '';
  animatedProgress = 0;

  ngOnInit() {
    this.animateProgress();
  }

  animateProgress() {
    const duration = 1000;
    const steps = 60;
    const increment = this.progress / steps;
    const interval = duration / steps;

    const timer = setInterval(() => {
      this.animatedProgress += increment;
      if (this.animatedProgress >= this.progress) {
        this.animatedProgress = this.progress;
        clearInterval(timer);
      }
    }, interval);
  }
}
