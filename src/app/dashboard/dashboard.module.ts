import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared";
import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ProjectPanelComponent } from './project-panel/project-panel.component';
import { ProjectListComponent } from './project-list/project-list.component';

@NgModule({
    declarations: [
        DashboardComponent,
        ProjectPanelComponent,
        ProjectListComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule
    ]
})
export class DashboardModule {}