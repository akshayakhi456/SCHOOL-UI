import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    headerMenuClick = signal(false);

    selectedStudentIdForDetails = signal<number | null>(null);

    setSelectedStudent(id: number) {
        this.selectedStudentIdForDetails.set(id);
    }
}