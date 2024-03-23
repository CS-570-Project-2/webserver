import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared";
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { InterpreterRoutingModule } from "./travel-salesman-routing.module";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { TravelSalesmanComponent } from "./travel-salesman.component";
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';

@NgModule({
    declarations: [
        TravelSalesmanComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MatInputModule,
        MatTableModule,
        MatSelectModule,
        MatSnackBarModule,
        InterpreterRoutingModule,
        MatSlideToggleModule,
        HttpClientModule,
        MatChipsModule
    ],
    exports: [
        TravelSalesmanComponent
    ]
})
export class TravelSalesmanModule {}