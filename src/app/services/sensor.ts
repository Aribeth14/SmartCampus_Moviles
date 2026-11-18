import { Injectable } from '@angular/core';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

export interface Ejes {
  x: number;
  y: number;
  z: number;
}

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private listener?: PluginListenerHandle;

  async iniciar(
    callback: (datos: Ejes) => void
  ): Promise<void> {

    await this.detener();

    if (typeof DeviceMotionEvent === 'undefined') {
      throw new Error('Sensor no disponible');
    }

    const dispositivo = DeviceMotionEvent as any;

    if (typeof dispositivo.requestPermission === 'function') {
      const permiso = await dispositivo.requestPermission();

      if (permiso !== 'granted') {
        throw new Error('Permiso del sensor denegado');
      }
    }

    this.listener = await Motion.addListener('accel', evento => {

      const aceleracion =
        evento.accelerationIncludingGravity ??
        evento.acceleration;

      if (!aceleracion) return;

      callback({
        x: aceleracion.x ?? 0,
        y: aceleracion.y ?? 0,
        z: aceleracion.z ?? 0
      });
    });
  }

  async detener(): Promise<void> {
    if (this.listener) {
      const actual = this.listener;
      this.listener = undefined;
      await actual.remove();
    }
  }
}
