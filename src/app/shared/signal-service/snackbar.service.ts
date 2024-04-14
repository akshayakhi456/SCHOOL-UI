import { Injectable } from "@angular/core";
import { SnackbarComponent } from "../components/snackbar/snackbar.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    constructor(private snackbar: MatSnackBar) {}

    openSuccessSnackbar(message: string, action: string = 'okay', icon: string = 'done') {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: {
                message,
                action,
                icon,
                snackbar: this.snackbar
            },
            panelClass: 'success-snackbar',
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        })
    }

    openWarningSnackbar(message: string, action: string = 'okay', icon: string = 'warning') {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: {
                message,
                action,
                icon,
                snackbar: this.snackbar
            },
            panelClass: 'warning-snackbar',
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        })
    }

    openDangerSnackbar(message: string, action: string = 'try again', icon: string = 'error') {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: {
                message,
                action,
                icon,
                snackbar: this.snackbar
            },
            panelClass: 'danger-snackbar',
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        })
    }

    openInfoSnackbar(message: string, action: string = 'okay', icon: string = 'info') {
        this.snackbar.openFromComponent(SnackbarComponent, {
            data: {
                message,
                action,
                icon,
                snackbar: this.snackbar
            },
            panelClass: 'info-snackbar',
            duration: 2000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
        })
    }
}