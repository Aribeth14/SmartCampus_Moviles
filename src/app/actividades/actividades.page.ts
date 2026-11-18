import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonInput,
  IonTextarea, IonSelect, IonSelectOption,
  IonDatetime, IonRadioGroup, IonRadio,
  IonCheckbox, IonButton, IonBadge,
  IonToast, IonAlert
} from '@ionic/angular';

import {
  ActividadesService,
  Actividad
} from '../services/actividades';

@Component({
  selector: 'app-actividades',
  templateUrl: './actividades.page.html',
  styleUrls: ['./actividades.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonInput,
    IonTextarea, IonSelect, IonSelectOption,
    IonDatetime, IonRadioGroup, IonRadio,
    IonCheckbox, IonButton, IonBadge,
    IonToast, IonAlert
  ]
})
export class ActividadesPage implements OnInit {

  actividades: Actividad[] = [];

  nueva: Actividad = this.formularioVacio();

  mensaje = '';
  mostrarToast = false;
  mostrarAlerta = false;
  idEliminar = '';
  guardando = false;

  // Botones de confirmación para eliminar
  botonesAlerta = [
    {
      text: 'Cancelar',
      role: 'cancel'
    },
    {
      text: 'Eliminar',
      role: 'destructive',
      handler: () => {
        void this.eliminarConfirmado();
      }
    }
  ];

  constructor(
    private servicio: ActividadesService,
    private cdr: ChangeDetectorRef
  ) {}

  // Cargar actividades al iniciar
  ngOnInit() {
    void this.cargar();
  }

  // Actualizar actividades al entrar en la pestaña
  ionViewWillEnter() {
    void this.cargar();
  }

  // Limpiar formulario
  formularioVacio(): Actividad {
    return {
      titulo: '',
      descripcion: '',
      tipo: '',
      fechaEntrega: '',
      prioridad: '',
      completada: false
    };
  }

  // READ: Consultar actividades
  async cargar() {
    try {
      this.actividades = await this.servicio.listar();

      console.log('Actividades cargadas:', this.actividades);

      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error al cargar actividades:', error);
      this.notificar('Error al consultar actividades');
    }
  }

  // CREATE: Guardar actividad
  async guardar() {

    if (
      !this.nueva.titulo.trim() ||
      this.nueva.descripcion.trim().length < 10 ||
      !this.nueva.tipo ||
      !this.nueva.fechaEntrega ||
      !this.nueva.prioridad
    ) {
      this.notificar('Completa correctamente todos los campos');
      return;
    }

    this.guardando = true;

    try {
      await this.servicio.crear({
        ...this.nueva,
        titulo: this.nueva.titulo.trim(),
        descripcion: this.nueva.descripcion.trim(),
        fechaEntrega: this.nueva.fechaEntrega.slice(0, 10)
      });

      this.nueva = this.formularioVacio();

      await this.cargar();

      this.notificar('Actividad guardada correctamente');

    } catch (error) {
      console.error('Error al guardar:', error);
      this.notificar('No se pudo guardar la actividad');

    } finally {
      this.guardando = false;
      this.cdr.detectChanges();
    }
  }

  // UPDATE: Seleccionar Pendiente o Completada
  async cambiarEstado(
    actividad: Actividad,
    evento: CustomEvent
  ) {

    if (!actividad.id) return;

    const nuevoEstado = evento.detail.value as boolean;

    if (nuevoEstado === actividad.completada) return;

    try {
      await this.servicio.actualizar(
        actividad.id,
        nuevoEstado
      );

      actividad.completada = nuevoEstado;

      this.cdr.detectChanges();

      this.notificar('Estado actualizado correctamente');

    } catch (error) {
      console.error('Error al actualizar:', error);
      this.notificar('No se pudo actualizar el estado');

      await this.cargar();
    }
  }

  // Abrir alerta de confirmación
  confirmarEliminar(id: string) {
    this.idEliminar = id;
    this.mostrarAlerta = true;
  }

  // DELETE: Eliminar actividad
  async eliminarConfirmado() {

    if (!this.idEliminar) return;

    try {
      await this.servicio.eliminar(this.idEliminar);

      await this.cargar();

      this.notificar('Actividad eliminada correctamente');

      this.idEliminar = '';

    } catch (error) {
      console.error('Error al eliminar:', error);
      this.notificar('No se pudo eliminar la actividad');
    }
  }

  // Mostrar mensajes
  notificar(texto: string) {
    this.mensaje = texto;
    this.mostrarToast = true;
    this.cdr.detectChanges();
  }

  // Color según prioridad
  colorPrioridad(prioridad: string): string {
    if (prioridad === 'Alta') return 'danger';
    if (prioridad === 'Media') return 'warning';
    return 'success';
  }
}