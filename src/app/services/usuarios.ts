import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = 'https://jsonplaceholder.typicode.com/users';

  async obtenerUsuarios(): Promise<Usuario[]> {
    const respuesta = await fetch(this.url);

    if (!respuesta.ok) {
      throw new Error('No se pudo consultar la API');
    }

    return await respuesta.json() as Usuario[];
  }
}
