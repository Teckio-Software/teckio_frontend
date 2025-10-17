import { Component, OnInit, OnDestroy } from '@angular/core';
import { Rive } from '@rive-app/canvas';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent implements OnInit, OnDestroy {
  private riveInstance?: Rive;

  ngOnInit(): void {
    this.riveInstance = new Rive({
      src: 'assets/logo_teckio.riv',
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
