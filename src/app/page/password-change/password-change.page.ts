import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewPassword } from 'src/app/interfaces/newPassord';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/service/api.service';
import { OverlayService } from 'src/app/service/overlay.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
})
export class PasswordChangePage implements OnInit {
  public user: User = {
    password: '',
    confirmPassword: '',
  };

  public newPassword: NewPassword = {
    newPassword: '',
    newConfirmPassword: ''
  }

  userDados: any = ''
  praUp: any = ''

  public formUser: FormGroup;
  public formPassword: FormGroup;
  public formConfirmPassword: FormGroup;

  constructor(private fBuider: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.createForm(this.user, this.newPassword);

    this.getUserPraUp()
  }

  ordersPag() {
    this.router.navigate(['/orders']);
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

  getUserPraUp() {
    const userData = JSON.parse(localStorage.getItem('praUp'))
    this.praUp = userData
    console.log('tese', this.praUp)
  }

  createForm(user, newPassword): void {
    user = this.user
    newPassword = this.newPassword

    this.formUser = this.fBuider.group({
      password: [this.user.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.user.confirmPassword, [Validators.required, Validators.minLength(6)]],
    })

    this.formPassword = this.fBuider.group({
      newPassword: [this.newPassword.newPassword, [Validators.required, Validators.minLength(6)]],      
    })

    this.formConfirmPassword = this.fBuider.group({
      newConfirmPassword: [this.newPassword.newConfirmPassword, [Validators.required, Validators.minLength(6)]],      
    })
  }

  async passwordShowNew() {
    const password = this.formUser.value.password;
    const confirmPassword = this.formUser.value.confirmPassword


    if (confirmPassword.length === 6) {

      const loading = this.overlayService.loading();

      try {

        if (password !== this.praUp) {
          this.formUser.reset()
          this.overlayService.toast({ message: 'Senha digitada diferente com a cadastrada' });          
        }

        else if (password !== confirmPassword) {
          this.formUser.reset()
          this.overlayService.toast({ message: 'Senha e Confirme Senha não são iguais' });
        }

        else {
          document.getElementById('passwordChangeBox').classList.remove('passwordChangeBox');
          document.getElementById('passwordChangeBox2').classList.remove('passwordChangeBox');
        }

      } finally {
        (await loading).dismiss();
      }
    }
  }

  async onPassKeyPress(keycode: any) {      
    if (keycode === 13) {      
      if (this.formConfirmPassword.value.newConfirmPassword !== '' && this.formConfirmPassword.value.newConfirmPassword.length === 6){        
        await this.registerNewPasword()        
      } 
    }
  }

  async registerNewPasword() {

    const password = this.formUser.value.password;

    const newPassword = this.formPassword.value.newPassword
    const newConfirmPassword = this.formConfirmPassword.value.newConfirmPassword

    const data = this.formPassword.value

    const userData = JSON.parse(localStorage.getItem('token'))

    const loading = this.overlayService.loading();    

    try {
      if (newPassword === password) {
        this.formPassword.reset()
        this.formConfirmPassword.reset()
        this.overlayService.toast({ message: 'Nova Senha igual senha já cadastrada' });
      }

      else if (newPassword !== newConfirmPassword) {
        this.formPassword.reset()
        this.formConfirmPassword.reset()
        this.overlayService.toast({ message: 'Nova Senha e Nova Confirmação de Senha não são iguais' });
      }

      else {
        this.apiService.updatePassword(data, userData.driver.id).then((result: any) => {
          this.overlayService.toast({ message: 'Atualização Realizada' });

          localStorage.setItem('praUp', JSON.stringify(newPassword));
          
          this.formUser.reset()

          this.formPassword.reset()

          this.formConfirmPassword.reset()

          this.router.navigate(['/orders']);
        })
      }

    } finally {
      (await loading).dismiss();
    }
  }
}



