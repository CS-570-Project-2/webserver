import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrameComponent } from './frame/frame.component';

const routes: Routes = [
  {
    path: '',
    component: FrameComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'traveling-salesman',
        loadChildren: () => import('./dashboard/projects/travel-salesman/travel-salesman.module').then(m => m.TravelSalesmanModule)
      },
      {
        path: 'project2',
        loadComponent: () => import('./dashboard/projects/project2/project2.component').then(m => m.Project2Component)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
