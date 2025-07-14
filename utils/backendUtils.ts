  import { test, expect,request } from '@playwright/test';

  export class BackendUtils {
      readonly page: Page;
 
  
  constructor(page: Page) {
  
  }
  
  async enviarRequestdeBackend(endpoint: String, data: JSON) {
  
     const apiRequestContext = await request.newContext();
     const response = await apiRequestContext.post(endpoint, {
        headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
    },
        data: {
        firstName: TestData.usuarioValido.nombre,
        lastName: TestData.usuarioValido.apellido,
        email: email,
        password: TestData.usuarioValido.contraseña,
    }
  });
  const responseBody = await response.json();