import { Injectable } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { MatSpinner } from '@angular/material/progress-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingSpinnerService {
  private overlayRef: OverlayRef = this.cdkSpinnerCreate();

  constructor(private overlay: Overlay) { }

  private cdkSpinnerCreate() {
   return this.overlay.create({
          hasBackdrop: true,
          backdropClass: 'dark-backdrop',
          positionStrategy: this.overlay.position()
           .global()
           .centerHorizontally()
           .centerVertically()
          })
}

  public show(){
    if(!this.overlayRef){
      this.overlayRef = this.overlay.create();
    }

    this.overlayRef.attach(new ComponentPortal(MatSpinner));
  }

  public hide(){
    if(!!this.overlayRef){
      this.overlayRef.detach();
    }
  }
}
