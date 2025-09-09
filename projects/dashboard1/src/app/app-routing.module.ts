import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/dashboard/components/main-component/main-component.component').then(m => m.MainComponentComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/components/main-component/main-component.component').then(m => m.MainComponentComponent)
  },
  {
    path: 'detail/:id/:name',
    loadComponent: () => import('./modules/meter-manager/components/details/details.component').then(m => m.DetailsComponent)
  },
  {
    path: 'water-clock',
    loadComponent: () => import('./modules/water-clock/components/water-meter-info/water-meter-info.component').then(m => m.WaterMeterInfoComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
