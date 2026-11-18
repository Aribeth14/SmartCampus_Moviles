import { Injectable } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { environment } from '../../environments/environment';

export interface Actividad {
  id?: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  fechaEntrega: string;
  prioridad: string;
  completada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {

  private app = getApps().length
    ? getApp()
    : initializeApp(environment);

  private db = getFirestore(this.app);
  private referencia = collection(this.db, 'actividades');

  async crear(actividad: Actividad) {
    const { id, ...datos } = actividad;
    return await addDoc(this.referencia, datos);
  }

  async listar(): Promise<Actividad[]> {
    const resultado = await getDocs(this.referencia);

    return resultado.docs.map(documento => ({
      id: documento.id,
      ...documento.data()
    } as Actividad));
  }

  async actualizar(id: string, completada: boolean) {
    const referencia = doc(this.db, 'actividades', id);

    await updateDoc(referencia, {
      completada
    });
  }

  async eliminar(id: string) {
    const referencia = doc(this.db, 'actividades', id);
    await deleteDoc(referencia);
  }
}