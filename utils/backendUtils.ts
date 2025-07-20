import { APIRequestContext, expect } from '@playwright/test';

export class BackendUtils {
// metodo que tiene disponible,expone la clase sin necesidad de contruirla como pasa con el contructor en otros aserciones (
  static async crearUsuarioPorAPI(request: APIRequestContext, usuario: any) {           //)
    const email = (usuario.email.split('@')[0]) + Date.now().toString() + '@' + usuario.email.split('@')[1];
    const response = await request.post('http://localhost:6007/api/auth/signup', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      data: {
        firstName: usuario.nombre,
        lastName: usuario.apellido,
        email: email,
        password: usuario.contraseña,
      }
    });
    expect(response.status()).toBe(201);
    return { email: email, contraseña: usuario.contraseña };
  }
}// las utilitis siempre tienen que estar estaticas (static) y lo que son pages, con constructores. 
// cuando se dice que una clase es instanciada quiere decir que se esta creando un objeto a partir de una clase
// la clase es por ejemplo el plano de una casa 
// cuando esta EN MAYUSCULA SU PRIMERA LETRA estamos queriendo decir que ésta es una clase y MINUSCULA para una instancia