import{Page, Locator} from '@playwright/test'

export class Loginpage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly Loginbutton: Locator;

constructor(page: Page) {
            this.page =page; 
            this.emailInput = page.locator('input[name="email"]');
            this.passwordInput = page.locator('input[name="password"]');
            this.Loginbutton = page.getByTestId('boton-login');
}

async visitarPaginaLogin(){
        await  this.page.goto('http://localhost:3000/login');
        await  this.page.waitForLoadState('networkidle');
}


async completarFormulariodeLogin(usuario:{email: string, contraseña: string}){
await this.emailInput.fill(usuario.email);
await this.passwordInput.fill(usuario.contraseña);

}
async hacerClickBotonLogin(){
    await this.Loginbutton.click();
}
async completarYHacerClickBotonLogin(usuario: {email: string, contraseña: string}) {
    await this.completarFormulariodeLogin(usuario);
    await this.hacerClickBotonLogin(); 

}


}

