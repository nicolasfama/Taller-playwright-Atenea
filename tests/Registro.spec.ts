import { test, expect } from '@playwright/test';
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