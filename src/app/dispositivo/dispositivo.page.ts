import {
  Component,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

import {
  IonHeader, IonToolbar, IonTitle,
  IonContent,
  IonInput, IonButton, IonToast
} from '@ionic/angular';

import { SensorService } from '../services/sensor';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle,
    IonContent,
    IonInput, IonButton, IonToast
  ]
})
export class DispositivoPage implements OnDestroy {

  x = 0;
  y = 0;
  z = 0;

  activo = false;
  iniciando = false;
  nombre = '';
  nombreGuardado = '';

  mensaje = '';
  mostrarToast = false;

  private lecturas = 0;

  constructor(
    private sensor: SensorService,
    private cdr: ChangeDetectorRef
  ) {}

  ionViewWillEnter() {
    void this.cargarNombre();
  }

  async iniciar() {
    if (this.activo || this.iniciando) return;

    this.iniciando = true;
    this.lecturas = 0;

    try {
      await this.sensor.iniciar(datos => {
        this.x = datos.x;
        this.y = datos.y;
        this.z = datos.z;

        this.lecturas++;
        this.cdr.detectChanges();
      });

      this.activo = true;
      this.notificar('Lectura iniciada. Mueve el teléfono.');

    } catch (error) {
      console.error('Error del sensor:', error);
      this.notificar('Sensor no disponible o permiso denegado');

    } finally {
      this.iniciando = false;
      this.cdr.detectChanges();
    }
  }

  async detener() {
    await this.sensor.detener();
    this.activo = false;

    if (this.lecturas === 0) {
      this.notificar('No se recibieron datos del sensor');
    } else {
      this.notificar('Lectura detenida');
    }

    this.cdr.detectChanges();
  }

  async guardarNombre() {
    const nombre = this.nombre.trim();

    if (!nombre) {
      this.notificar('Escribe tu nombre');
      return;
    }

    try {
      await Preferences.set({
        key: 'nombreEstudiante',
        value: nombre
      });

      this.nombreGuardado = nombre;
      this.notificar('Nombre guardado correctamente');

    } catch (error) {
      console.error(error);
      this.notificar('No se pudo guardar el nombre');
    }
  }

  async cargarNombre() {
    try {
      const resultado = await Preferences.get({
        key: 'nombreEstudiante'
      });

      this.nombreGuardado = resultado.value ?? '';
      this.nombre = this.nombreGuardado;
      this.cdr.detectChanges();

    } catch (error) {
      console.error(error);
      this.notificar('No se pudo recuperar el nombre');
    }
  }

  ionViewWillLeave() {
    void this.sensor.detener();
    this.activo = false;
  }

  ngOnDestroy() {
    void this.sensor.detener();
  }

  notificar(texto: string) {
    this.mensaje = texto;
    this.mostrarToast = true;
    this.cdr.detectChanges();
  }
}
