import { Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    headerMenuClick = signal(false);
    academicYear = new BehaviorSubject(1);
    academicYearData = this.academicYear.asObservable();
    selectedStudentIdForDetails = signal<number | null>(null);

    setSelectedStudent(id: number) {
        this.selectedStudentIdForDetails.set(id);
    }

    setAcademicYear(id: number) {
        this.academicYear.next(id);
    }
}