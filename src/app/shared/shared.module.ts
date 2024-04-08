import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';
import { MatNativeDateModule } from '@angular/material/core';
import {MatStepperModule} from '@angular/material/stepper';

// COMMON IMPORTS ALL IN ONE MODULE
@NgModule({
  declarations: [  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
    MatRadioModule,
    MatDatepickerModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatSnackBarModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatStepperModule,
    RouterModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatMenuModule,
    MatRadioModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatNativeDateModule,
    MatListModule,
    MatStepperModule,
    RouterModule
  ],
  providers: [],
})
export class SharedModule { }
