import{Page, Locator} from '@playwright/test'

export class ModalEnviarTransferencia {
    readonly page: Page;
    readonly emailDestinatarioInput: Locator;
    readonly cuentaDeOrigenDropdown: Locator;
    readonly montoEnviarInput: Locator;
    readonly botonCancelar: Locator;
    readonly botonEnviar: Locator;
    readonly cuentaDeOrigenOption: Locator;
 
    constructor(page: Page) {  
        this.page = page;
        this.emailDestinatarioInput = page.getByRole('textbox', { name: 'Email del destinatario *' })
        this.cuentaDeOrigenDropdown = page.getByRole('combobox', { name: 'Cuenta origen *' })
        this.montoEnviarInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' })
        this.botonCancelar = page.getByRole('button', { name: 'Cancelar' })
        this.botonEnviar = page.getByRole('button', { name: 'Enviar' })
        this.cuentaDeOrigenOption = page.getByRole('option', { name: '••••' })
    } 
    async completaryhacerClickBotonEnviar(emailDestinatario: string, monto: string){
        await this.emailDestinatarioInput.fill(emailDestinatario);
        await this.cuentaDeOrigenDropdown.click();
        await this.cuentaDeOrigenOption.click();
        await this.montoEnviarInput.fill(monto);
        await this.botonEnviar.click();
    }

}



