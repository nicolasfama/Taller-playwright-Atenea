import { test, expect } from '@playwright/test';

test('TC-1 Verificacion de elementos visuales en la pagina de registro', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-2 verificar boton de registro esta inhabilitado por defecto', async ({ page }) => {
 await page.goto('https://atena-redux.ngrok.app/signup'); 
 await expect(page.getByTestId('boton-registrarse')).toBeDisabled()
});

test('TC-3 verificar boton de registro se habilita al completar los campos obligatorios', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('nicolas');
  await page.locator('input[name="lastName"]').fill('fama');
  await page.locator('input[name="email"]').fill('nicolas@email.com');
  await page.locator('input[name="password"]').fill('123456');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled()

});

test('TC-4 Verificar redireccionamiento a pagina de inicia al hacer click', async ({ page }) => {
  await page.goto('https://atena-redux.ngrok.app/signup'); 
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('https://atena-redux.ngrok.app/login');
  await page.waitForTimeout(5000);//espera a que la pagina se cargue correctamente
});   
test('TC-5 Verificar Registro exitoso', async ({ page }) => {
   await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('nicolas');
  await page.locator('input[name="lastName"]').fill('fama');
  await page.locator('input[name="email"]').fill('nicolas' +Date.now().toString()+ '@email.com');
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();

});
test ('TC-6 Verificar que el usuario no pueda registrarse con un usuario ya existente', async ({ page }) =>{
  const email= 'nicolas'+ Date.now().toString() +'@email.com';
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('nicolas');
  await page.locator('input[name="lastName"]').fill('fama');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
  await page.goto('https://atena-redux.ngrok.app/signup');
  await page.locator('input[name="firstName"]').fill('nicolas');
  await page.locator('input[name="lastName"]').fill('fama');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('123456');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});