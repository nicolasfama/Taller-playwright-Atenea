import { test, expect } from '@playwright/test';
import { Loginpage } from '../Pages/loginpage';
import TestData from '../Data/testData.json';
import { DashboardPage } from '../Pages/dashboardPage';
import { BackendUtils } from '../utils/backendUtils';

let loginPage: Loginpage; //(esto se llama inicializar)
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

test('TC-11 Loguearse con nuevo usuario creado por backend', async ({ page, request }) => {
  const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);

  const responsePromiseLogin = page.waitForResponse('http://localhost:6007/api/auth/login');
  await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);

  const responseLogin = await responsePromiseLogin;
  const responseBodyLoginJson = await responseLogin.json();

  expect(responseLogin.status()).toBe(200);
  expect(responseBodyLoginJson).toHaveProperty('token');
  expect(typeof responseBodyLoginJson.token).toBe('string');
  expect(responseBodyLoginJson).toHaveProperty('user');
  expect(responseBodyLoginJson.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: TestData.usuarioValido.nombre,
    lastName: TestData.usuarioValido.apellido,
    email: nuevoUsuario.email,
  }));


  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();

});