import { test as setup, expect } from '@playwright/test'; //setup es un alias y en vez de crear con test podemos crear con setup
//importamos expect por si tenemos que hacer algun ascersion 
import { Loginpage } from '../Pages/loginpage'; //el loginpage porque despues nos tenemos que logiar 
import TestData from '../data/testData.json';// importamos testdata por si nos hace falta 
import { BackendUtils } from '../utils/backendUtils'; //importamos backendutils que nos permite crear un usuario a traves de un request de backend
import { DashboardPage } from '../Pages/dashboardPage';
import { ModalCrearCuenta } from '../Pages/modalCrearCuenta';

let loginPage: Loginpage; //creamos la variable de login page 
let dashboardPage: DashboardPage //creamos la variable de dashboardpage
let modalCrearCuenta: ModalCrearCuenta; //creamos la variable de modalCrearCuenta


const usuarioEnviaAuthFile ='playwright/.auth/usuarioEnvia.json'; //generamos la constante donde se va a guardar el archivo del usuario 1
const usuarioRecibeAuthFile = 'playwright/.auth/usuarioRecibe.json';// generamos la constante donde se va a guardar el archivo donde se generara el usuario 2 (el que recibe ek dinero)

setup.beforeEach(async ({ page }) => {
    loginPage = new Loginpage(page);
    dashboardPage = new DashboardPage(page);
    modalCrearCuenta = new ModalCrearCuenta(page);
    await loginPage.visitarPaginaLogin();

});
setup('Generar usuario que envia dinero', async ({ page, request }) => {
    const nuevoUsuario = await BackendUtils.crearUsuarioPorAPI(request, TestData.usuarioValido);//enviamos el request del backendutils para crear el usuario a traves de la API
    await loginPage.completarYHacerClickBotonLogin(nuevoUsuario);
    await dashboardPage.botonDeAgregarCuenta.click();
    await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
   // await modalCrearCuenta.tipoDeCuentaDropdown.selectOption('Debito');// SelectOption es un metodo que se utiliza especificamente para 
    // elementos de tipo dropdown o combobox este metodo lo que hace es esperar por chequeos accionable espera a que todas las opciones esten 
    //presente dentro de un select. Este elemnto de tipo select es un imput pero es un select porque tiene varias opciones 
     await modalCrearCuenta.montoInput.fill('1000');
     await modalCrearCuenta.botonCrearCuenta.click ();
     await expect(page.getByText('¡Cuenta Creada Exitosamente!')).toBeVisible();
    //todo esto se hizo atraves del frontend pero tambien se puede hacer atraves del backend 
    await page.context().storageState({path: usuarioEnviaAuthFile}) //lo que hace es agarrar la informacion de este usuario nuevo y la guarda en USUARIORECIBEAUTHFILE.JSON

    // porque no aparece nuestro archivo en playwright o nuestro caso de prueba? playwright solo leera archivos que tenga .spec para que a nosotros nos funcione
// debemos crear un nuevo proyecto dentro de lo que es la configuracion dentro de playwright debemos ir a playwright.config.ts
//dentro del mismo debemos buscar la parte de projecto y dentro de la misma debemos crear nuestro setup 
});

setup('Logiarse con usuario que recibe dinero', async ({ page, request }) => {
    await loginPage.completarYHacerClickBotonLogin(TestData.usuarioValido);
    //aqui se genera un archivo de usuariorecibe.json
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await page.context().storageState({path: usuarioRecibeAuthFile})
});