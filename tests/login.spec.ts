import { test, expect } from '@playwright/test';
import { Loginpage } from '../Pages/loginpage';
import TestData from '../Data/testData.json';
import { DashboardPage } from '../Pages/dashboardPage';

let loginPage: Loginpage;
let dashboardPage: DashboardPage;

test.beforeEach(async ({ page }) => {
  loginPage = new Loginpage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaLogin();
});

test('TC-7 Verificar inicio de sesion de login con credenciales validas', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
 // await expect(page.getByText('Inicio de sesion exitoso')).toBeVisible();
  await expect(page.locator('text=Inicio de sesión exitoso')).toBeVisible()
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});

test('TC-11 logiarse con nuevo usuario creado por backend', async ({ page, request }) => {
  // Generar un email único para el usuario de prueba
  const email = (TestData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + TestData.usuarioValido.email.split('@')[1];
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    data: { firstname: TestData.usuarioValido.nombre,
            lastname: TestData.usuarioValido.apellido,
            email: email,
            password: TestData.usuarioValido.contraseña,
          }
    }
  );
  expect(response.status()).toBe(201);
  // Verificar que la respuesta del registro sea exitosa

  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
  await loginPage.completarYHacerClickBotonLogin({email: email, contraseña: TestData.usuarioValido.contraseña});

  const responseLogin = await responsePromiseLogin;
  //aqui estamos espeando la respuesta del request 
  const responseBodyLoginJson = await responseLogin.json();
  // aqui guardamos la respuesta del cuerpo del request en formato json

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty('token'); 
  // la respuesta tiene que tener un token de tipo string
  expect(typeof responseBodyLoginJson.token).toBe('string');
  expect(responseBodyLoginJson).toHaveProperty('user');
  expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: TestData.usuarioValido.nombre,
    lastName: TestData.usuarioValido.apellido,
    email: email,
  }));

  await expect(page.locator('text=Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
  
});
//asi nosotros podemos hacer nuestros casos de pruebas mucho mas rapidos, porque no tenemos que esperar a que se registre el usuario, sino que lo hacemos directamente desde el backend
