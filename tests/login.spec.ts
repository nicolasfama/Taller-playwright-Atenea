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
  await expect(page.getByText('Inicio de sesion exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});