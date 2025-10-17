import { Component, Input } from '@angular/core';
import { Rive } from '@rive-app/canvas';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.css'],
})
export class EmptyStateComponent {
  @Input() nombreArchivo: string = '';
  private riveInstance?: Rive;

  ngOnInit(): void {
    this.riveInstance = new Rive({
      src: `assets/${this.nombreArchivo}.riv`,
      canvas: document.getElementById('riveCanvas') as HTMLCanvasElement,
      autoplay: true,
      animations: 'Timeline 1',
      onLoad: () => {
        this.riveInstance?.resizeDrawingSurfaceToCanvas();
        this.riveInstance?.play('Timeline 1');
      },
    });

    this.riveInstance?.play('Timeline 1', true);
  }

  ngOnDestroy(): void {
    this.riveInstance?.cleanup();
  }
}
