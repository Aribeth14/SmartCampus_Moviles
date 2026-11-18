import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('../inicio/inicio.page').then(m => m.InicioPage)
      },
      {
        path: 'actividades',
        loadComponent: () =>
          import('../actividades/actividades.page').then(m => m.ActividadesPage)
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('../usuarios/usuarios.page').then(m => m.UsuariosPage)
      },
      {
        path: 'dispositivo',
        loadComponent: () =>
          import('../dispositivo/dispositivo.page').then(m => m.DispositivoPage)
      },
      {
        path: '',
        redirectTo: '/tabs/inicio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  }
];
