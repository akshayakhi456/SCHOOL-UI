import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
    private darkBackdrop = 'cdk-overlay-dark-backdrop';
    private whiteBackdrop = 'cdk-overlay-white-dropback';
    overlayRef: OverlayRef | any;
    counter = 0;

    constructor(private overlay: Overlay) {}

    show(isTransparent: boolean = true) {
        const backdropclass = isTransparent ? this.darkBackdrop : this.whiteBackdrop;
        if (!this.overlayRef) {
            this.overlayRef = this.overlay.create({
                positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
                hasBackdrop: true,
                backdropClass: backdropclass
            })
        }

        if (this.counter <= 0) {
            this.counter = 1;
            this.overlayRef.attach(new ComponentPortal(SpinnerComponent))
        }
        else {
            this.counter++;
        }
    }

    dispose() {
        this.counter--;
        if (this.overlayRef && this.counter == 0) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}