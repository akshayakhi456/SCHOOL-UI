import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class BreadCrumbService {
    isShowBreadcrumb = signal(false);
    breadcrumbData = signal(null);
    
    setBreadcrumb(isShowBReadcrumb: boolean, breadcrumbData? : any) {
        this.isShowBreadcrumb.set(isShowBReadcrumb);
        this.breadcrumbData.set(breadcrumbData);
    }
}