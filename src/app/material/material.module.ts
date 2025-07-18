import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatSelectModule} from '@angular/material/select'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatDatepickerModule} from '@angular/material/datepicker'
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core'
import {MatTabsModule} from '@angular/material/tabs'
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatTableModule} from '@angular/material/table'
import {DragDropModule} from '@angular/cdk/drag-drop'
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'
import {MatChipsModule} from '@angular/material/chips'
import {MatCardModule} from '@angular/material/card';
import {MatSliderModule} from '@angular/material/slider';
import {MatSortModule} from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTreeModule } from '@angular/material/tree';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

import {MatSidenavModule} from '@angular/material/sidenav';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports:[
    MatToolbarModule
    , MatIconModule
    , MatButtonModule
    , MatFormFieldModule
    , MatInputModule
    , MatSelectModule
    , MatCheckboxModule
    , MatDatepickerModule
    , MatNativeDateModule
    , MatTabsModule
    , MatAutocompleteModule
    , MatTableModule
    , DragDropModule
    , MatPaginatorModule
    , MatProgressSpinnerModule
    , MatChipsModule
    , MatCardModule
    , MatSliderModule
    , MatSortModule
    , MatDialogModule
    , MatSnackBarModule
    , MatMenuModule
    , MatTreeModule
    , MatGridListModule
    , MatExpansionModule
    //, MatSliderModule
    , MatSlideToggleModule
    , MatDividerModule
    ,MatListModule
    ,MatSidenavModule
  ]
  ,

    providers: [

      { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }

    ]
})
export class MaterialModule { }
