import { test, expect,request } from '@playwright/test';
import {RegisterPage} from '../Pages/Registerpage'
import TestData from '../Data/testData.json';

let registerPage: RegisterPage; 

test.beforeEach (async ({page}) =>{
  registerPage= new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();

})

test('TC-1 Verificacion de elementos visuales en la pagina de registro', async ({ page }) => {

  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
});

test('TC-2 verificar boton de registro esta inhabilitado por defecto', async ({ page }) => {
  
 await expect(registerPage.registerButton).toBeDisabled()
});

test('TC-3 verificar boton de registro se habilita al completar los campos obligatorios', async ({ page }) => {

  await registerPage.completarFormulariodeRegistro(TestData.usuarioValido);
  await expect(registerPage.registerButton).toBeEnabled()

});

test('TC-4 Verificar redireccionamiento a pagina de inicia al hacer click', async ({ page }) => {

  await registerPage.Loginbutton.click();
  await expect(page).toHaveURL('http://localhost:3000/login');     
 
});   
test('TC-5 Verificar Registro exitoso', async ({ page }) => {

  const email= (TestData.usuarioValido.email.split('@')[0])+ Date.now().toString() +'@' + TestData.usuarioValido.email.split('@')[1];
  TestData.usuarioValido.email = email;
  await registerPage.completarFormulariodeRegistro(TestData.usuarioValido);
  await registerPage.hacerClickBotonRegistro();
  await expect(page.getByText('Registro exitoso')).toBeVisible()

});
test ('TC-6 Verificar que el usuario no pueda registrarse con un usuario ya existente', async ({ page }) =>{
  const email= (TestData.usuarioValido.email.split('@')[0])+ Date.now().toString() +'@' + TestData.usuarioValido.email.split('@')[1];
  TestData.usuarioValido.email = email; 
  await registerPage.completarFormulariodeRegistro(TestData.usuarioValido);
  await registerPage.hacerClickBotonRegistro();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await registerPage.visitarPaginaRegistro();
  await registerPage.completarFormulariodeRegistro(TestData.usuarioValido);
  await registerPage.hacerClickBotonRegistro();
  await expect(page.getByText('email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});
test('TC-8 Verificar el registro exitoso con datos validos Verificando respuesta de la API ', async ({ page }) => {
  await test.step('Completar el formulario de registro', async () => {
    const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
    TestData.usuarioValido.email = email;
    await registerPage.completarFormulariodeRegistro(TestData.usuarioValido);
  });

  const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/signup');
  await registerPage.hacerClickBotonRegistro();
  const response = await responsePromise;
  const responseBody = await response.json();

  expect(response.status()).toBe(201);
  await expect(page.getByText('Registro exitoso')).toBeVisible(); 
// aca lo que se hace es ejecutar la accion o la llamada desde el frontend y verificamos el backend

});

test('TC-9 Verificar que el registro falle con datos invalidos Verificando respuesta de la API', async ({ page, request }) => {
  //primero se hace un email aleatorio porque si ponemos uno que ya existe, la API no nos va a dejar registrarnos
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
  //Despues se hace la response,el await es que nosotros queremos esperar que el obkjeto de tipo request haga una llamada de tipo post a la URL enviandole los headers y enviandole los datos para poder hacer la peticion.
  // lo que estamos diciendo es (espera a que me devuelva la respuesta de esta llamada que estamos haciendo)
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    data: {
      firstName: TestData.usuarioValido.nombre,
      lastName: TestData.usuarioValido.apellido,
      email: email,
      password: TestData.usuarioValido.contraseña,
// la respuesta contiene muchas cosas como los headers, el status, el body, etc.

    }
  });
  const responseBody = await response.json();
  // entonces lo que queremos es la respuesta en formato JSON
  expect(response.status()).toBe(201);
  // a la respuesta le consultamos cual fue el estado, si fue 201, significa que se creo el usuario correctamente
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: TestData.usuarioValido.nombre,
    lastName: TestData.usuarioValido.apellido,
    email: email,
// aca lo que se hace es llamar directamente al backend sin pasar por el frontend, esa es la diferencia que existe entre el TC8 y TC9 
// en este caso de prueba podemos decir que esta aislado porque no hace falta abrir la pagina simplemente manda el request desde el backend utilizando el navegador pero no hace falta ir a la pagina
  }));
});
// un 500 es un error de conexion de que no llego un request al endpoint porque habia un error de conexion.como hago yo para verificar cuando ese error se lleva a cabo
//cuando halla un 500 como voy a saber que estoy viendo la pantalla y que el usuario esta viendo esa pantalla si no puedo probar ese escenario 
//para eso nosotros podemos interceptar esa llamada y hacer que nos devuelva lo que nosotros queramos y de este modo no dependemos de que un desarrollador nos baje un ambiente
// ejecutemos el caso de prueba manualmente y despues veamos el resultado sino que directamente nosotros podemos simular ese escenario es importante que sepamos como se ve esa respuesta 
//el desarrollador va a tener que hacer que eso se trigree y sino ir al backend y preguntarle a la gente del backend como se ve esa respuesta
//o los diferente tipos de respuesta que se puede ver en este caso en el singup de esa forma vemos como reacciona el frontend cuando hay un error de backend 
// porque eso se llama manejo de errores y es importante que en el testing ver que cuando hay un error no solamente sea claro para el usuario para entender lo que esta sucediendo 
//sino que tambien muestre la informacion correcta sobre el error que acabamos de encontrar.

test('TC-10 Verificar comportamiento del front ante un error 500 en el registro', async ({ page, request }) => {
  //primero se hace un email aleatorio porque si ponemos uno que ya existe, la API no nos va a dejar registrarnos
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
// interceptar la solicitud de registro y simular un error 500
  await page.route('**/api/auth/signup', async route => {
    //esto lo que hace es interceptar la llamada al endpoint (encuentra el request)
    await route.fulfill({
      //el fulfill lo que hace es llenar los datos de una respuesta especifica 
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),

      // lo que hace esto es generar como si fuera una trampa, es algo que esta ahi para que cada vez que se ejecute este request en ves de devolvernos la respuesta ideal nos devuelve un 500  

    });
  });
  //llenar el formulario de registro, la navegacion se hace en beforeEach
  await registerPage.firstNameInput.fill(TestData.usuarioValido.nombre);
  await registerPage.lastNameInput.fill(TestData.usuarioValido.apellido);
  await registerPage.emailInput.fill(email);
  await registerPage.passwordInput.fill(TestData.usuarioValido.contraseña);
  // hacer click en el boton de registro
  await registerPage.registerButton.click();
  // verificar que se muestra un mensaje de error
  await expect(page.getByText('Registro fallido')).toBeVisible();
});
// podemos hacer el logeo atraves del backend utulizando estos request.por ejemplo asi como podemos hacer el login podriamos hacer lo mismo utilizando el backend
//mandando un request primero el signup y despues el login
