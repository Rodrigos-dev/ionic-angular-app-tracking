import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';

import { UserLogin } from 'src/app/interfaces/userLogin';
import { ApiService } from 'src/app/service/api.service';
import { OverlayService } from 'src/app/service/overlay.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {  

  public userloginAndRegister: UserLogin = {}

  public formLogin: FormGroup

  constructor(
    private fBuider: FormBuilder,
    private overlayService: OverlayService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formLogin = this.fBuider.group({
      'username': [this.userloginAndRegister.cpf, [Validators.required]],
      'password': [this.userloginAndRegister.password, [Validators.required, Validators.minLength(6)]],
    })
  }

  ionViewWillEnter() {
  }  

  async login() {
    const loading = this.overlayService.loading()
    try {
      const data = this.formLogin.value
      this.apiService.login(data).then((result: any) => {
        this.overlayService.toast({ message: 'Login Realizado com Sussesso' })
        localStorage.setItem('token', JSON.stringify(result));
        this.formLogin.reset()
        this.router.navigateByUrl('/orders', {
          state: { order: result }
        })
      })
      console.log(this.formLogin.value)
    }
    finally {
      (await loading).dismiss()
    }
  }

  toRegister() {
    this.router.navigate(['/user']);
  }

}//fecha classe da pagina
