import { test, expect } from "@playwright/test";
import {RegisterPage} from '../Pages/Registerpage';
import { DashboardPage } from "../Pages/dashboardPage";

let loginPage: RegisterPage;
let dashboardPage: DashboardPage;
test.beforeEach(async ({ page }) => {
  loginPage = new RegisterPage(page);
  dashboardPage = new DashboardPage(page);
  await loginPage.visitarPaginaRegistro();
});

test('TC-1.1 Login exitoso y redireccion al dashboard', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // llenar email y contraseña
  await page.fill('input[name="email"]','testuser@example.com');
  await page.fill('input[name="password"]', '123456');
  // hacer click en iniciar sesión
  await page.click('button[type="submit"]');
    //verifique mensaje de exito
  await expect(page.locator('text=Inicio de sesión exitoso')).toBeVisible()
  // verificar que se redirige al dashboard
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  // verificar que el usuario esta logueado
  await expect(page.getByText('Tablero Principal')).toBeVisible();
});
test('TC-2.1 intento de login con credenciales invalidas', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // llenar email y contraseña incorrectos
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'wrongpassword');
  // hacer click en iniciar sesión
  await page.click('button[type="submit"]');
  // verificar mensaje de error
  await expect(page.locator('text=invalid credentials')).toBeVisible();
  // verificar que no se redirige al dashboard 
});

/// tooltips!! 

test('TC-2.2 intento de login con campos vacios', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
 // dejar los campos de email vacios
  await page.getByRole('textbox',{name:'contraseña'}).fill('132456');
  // intentar enviar el formulario
  await page.getByTestId('boton-login').click();
 // validar que el imput de email este vacio e invalido
const emailInput = page.getByRole('textbox', { name: 'Correo electrónico' });
await expect(emailInput).toBeEmpty();
await expect(emailInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
});
test('TC-2.3 intento de login sin contraseña', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // dejar el campo de contraseña vacio
  await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('testuser@example.com');
  // intentar enviar el formulario
  await page.getByTestId('boton-login').click();
  // validar que el imput de contraseña este vacio e invalido
  const passwordInput = page.getByRole('textbox', { name: 'Contraseña' });
  await expect(passwordInput).toBeEmpty();
  await expect(passwordInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');
});
test('TC-2.4 intento de login con Formato de email incorecto', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // llenar el campo de email con un formato incorrecto
  const emailInput = page.getByRole('textbox', { name: 'Correo electrónico' });
  //ingresar un email con formato incorrecto
  await emailInput.fill('asdasdasd'); // falta el '@'
  // intentar enviar el formulario
  await page.getByTestId('boton-login').click();
  // validar el mensaje que aparece en el navegador
  const mensaje= await emailInput.evaluate(el=> (el as HTMLInputElement).validationMessage);
  expect(mensaje).toContain("Please include an '@' in the email address. 'asdasdasd' is missing an '@'."); // Verifica que el mensaje de error sea el esperado
});
test('TC-3.1 Verificacion de enalace de registro', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // hacer click en ¿no tienes una cuenta? Regístrate
    await page.getByTestId('link-registrarse-login').click();
  // verificar que el usuario esta en la pagina de registro
  await page.goto('http://localhost:3000/signup');

});
test('TC-3.2 Verificacion de enalace de registro', async ({ page }) => {
  // ir a la pagina de login
  await page.goto('http://localhost:3000/login');
  // llenar email y contraseña
  await page.fill('input[name="email"]','testuser@example.com');
  await page.fill('input[name="password"]', '123456');
  // hacer click en iniciar sesión
  await page.click('button[type="submit"]');
    //verifique mensaje de exito
  await expect(page.locator('text=Inicio de sesión exitoso')).toBeVisible()
  // verificar que se redirige al dashboard
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  // verificar que el usuario esta logueado
  await expect(page.getByText('Tablero Principal')).toBeVisible();
  //hacer click en el boton cerrar sesión
  await page.getByTestId('boton-logout').click();
    // redirijirse a la pagina de login
    await page.goto('http://localhost:3000/login');
  await page.click('button[type="submit"]');
    await page.goto('http://localhost:3000/login');

});