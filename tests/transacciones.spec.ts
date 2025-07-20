import{test , expect} from '@playwright/test'
import { DashboardPage } from '../Pages/dashboardPage'
import { ModalEnviarTransferencia } from '../Pages/modalEnviarTransferencia'
import TestData from '../data/testData.json'

let dashboardPage: DashboardPage;

const testUsuarioEnvia = test.extend ({//lo que hace esto es hacer una version de test para poder poner algo especifico, le podemos poder el estado de la seccion expecifico
    storageState: require.resolve('../playwright/.auth/usuarioEnvia.json')
});
//esto lo que hace es habilitarnos a nosotros a ejecutar caso de pruebas con el usuario que envia ya logiado o en el caso siguiente el osuario que 
//recibe ya logiado 
const testUsuarioRecibe = test.extend({
    storageState: require.resolve('../playwright/.auth/usuarioRecibe.json')
});
test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.visitarPaginaDashboard();
})

testUsuarioEnvia('TC-12 Verificar transaccion exitosa', async ({ page }) => {
    testUsuarioEnvia.info().annotations.push({

        type: 'Informacion de usuario que Recibe',
        description: TestData.usuarioValido.email });

    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.botonEnviarDinero.click();
    const modalEnviarTransferencia = new ModalEnviarTransferencia(page);
    await modalEnviarTransferencia.completaryhacerClickBotonEnviar(TestData.usuarioValido.email, '100');
    await expect(page.getByText('transferencia enviada a ' + TestData.usuarioValido.email)).toBeVisible();
    await page.waitForTimeout(5000);
})
testUsuarioRecibe('TC-13 Verificar que el usuario reciba la transferencia', async ({ page }) => {
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await page.waitForTimeout(5000);
    await expect(page.getByText('Transferencia de email').first()).toBeVisible();
});

//para poder hacer el reporte de todo, cerramos el playwright con ctrl + c y luego ejecutamos el comando npx playwright , espereamos a que todos los casos de prueba terminen
//luego ponemos el comando npx playwright show-report hacemos click en la url que nos dieron y nos mostrara el reporte de todo los casos de prueba
