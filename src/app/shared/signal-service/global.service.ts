import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    headerMenuClick = signal(false);
}