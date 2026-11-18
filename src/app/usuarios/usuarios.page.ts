import { Component } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonSearchbar, IonCard,
  IonCardHeader, IonCardTitle,
  IonCardContent, IonInfiniteScroll,
  IonInfiniteScrollContent, IonButton,
  IonSpinner
} from '@ionic/angular';

import {
  UsuariosService,
  Usuario
} from '../services/usuarios';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle,
    IonContent, IonSearchbar, IonCard,
    IonCardHeader, IonCardTitle,
    IonCardContent, IonInfiniteScroll,
    IonInfiniteScrollContent, IonButton,
    IonSpinner
  ]
})
export class UsuariosPage {

  usuarios: Usuario[] = [];
  filtrados: Usuario[] = [];
  visibles: Usuario[] = [];

  cantidad = 4;
  busqueda = '';
  cargando = false;
  error = '';

  constructor(private servicio: UsuariosService) {}

  ionViewWillEnter() {
    void this.obtenerUsuarios();
  }

  async obtenerUsuarios() {
    this.cargando = true;
    this.error = '';

    try {
      this.usuarios = await this.servicio.obtenerUsuarios();
      this.aplicarFiltro();
    } catch (error) {
      console.error(error);
      this.error = 'No se pudieron cargar los usuarios. Intenta nuevamente.';
    } finally {
      this.cargando = false;
    }
  }

  buscar(evento: CustomEvent) {
    this.busqueda = String(evento.detail.value ?? '');
    this.cantidad = 4;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    const texto = this.busqueda.toLowerCase().trim();

    this.filtrados = this.usuarios.filter(usuario =>
      usuario.name.toLowerCase().includes(texto)
    );

    this.actualizarVisibles();
  }

  actualizarVisibles() {
    this.visibles = this.filtrados.slice(0, this.cantidad);
  }

  async cargarMas(evento: CustomEvent) {
    this.cantidad += 4;
    this.actualizarVisibles();

    const infinite = evento.target as HTMLIonInfiniteScrollElement;
    await infinite.complete();
  }

  get terminado(): boolean {
    return this.visibles.length >= this.filtrados.length;
  }
}
