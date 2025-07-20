import{Page, Locator} from '@playwright/test'

export class ModalCrearCuenta {
    readonly page: Page;
    readonly tipoDeCuentaDropdown: Locator;
    readonly montoInput: Locator;
    readonly botonCancelar: Locator;
    readonly botonCrearCuenta: Locator;

    constructor(page: Page) {  
        //input de modal es un dropdown (es este input donde tu tienes que hace click y se despliega opciones)
        this.page = page;
        this.tipoDeCuentaDropdown = page.getByRole('combobox', { name: 'Tipo de cuenta *' });
        this.montoInput = page.getByRole('spinbutton', { name: 'Monto inicial *' });
        this.botonCancelar = page.getByTestId('boton-cancelar-crear-cuenta')
        this.botonCrearCuenta = page.getByTestId('boton-crear-cuenta')
    } 
// para no tener que probar cada opcion ej(debito, credito, caja de ahorro, cuenta corriente) lo que se hace es un METODO que se describe a continuacion
async seleccionarTipoDeCuenta(tipodeCuenta: string) {
    // Va a ser click en el dropdown
    await this.tipoDeCuentaDropdown.click();
    // y luego selecciona el tipo de cuenta 
    await this.page.getByRole('option', { name: tipodeCuenta }).click();

    //con esto ya no haria falta hacer un localizador para cada uno 
}
async completarMonto(monto:string){
        await this.montoInput.fill (monto);

}
        
}




