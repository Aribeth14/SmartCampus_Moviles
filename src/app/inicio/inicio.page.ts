import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { schoolOutline, clipboardOutline, peopleOutline, phonePortraitOutline } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [DatePipe, RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonIcon]
})
export class InicioPage {
  fecha = new Date();
  integrantes = 'Ariana Villota';

  modulos = [
    {
      titulo: 'Actividades',
      descripcion: 'Registra tareas y organiza sus fechas de entrega.',
      ruta: '/tabs/actividades',
      icono: 'clipboard-outline'
    },
    {
      titulo: 'Usuarios',
      descripcion: 'Encuentra contactos por nombre en el directorio.',
      ruta: '/tabs/usuarios',
      icono: 'people-outline'
    },
    {
      titulo: 'Dispositivos',
      descripcion: 'Consulta el acelerómetro y guarda tu nombre en el dispositivo.',
      ruta: '/tabs/dispositivo',
      icono: 'phone-portrait-outline'
    }
  ];

  constructor() {
    addIcons({ schoolOutline, clipboardOutline, peopleOutline, phonePortraitOutline });
  }
}
