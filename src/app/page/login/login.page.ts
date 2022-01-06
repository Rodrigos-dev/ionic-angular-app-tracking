import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserLogin } from 'src/app/interfaces/userLogin';
import { ApiService } from 'src/app/service/api.service';
import { OverlayService } from 'src/app/service/overlay.service';
import { environment } from 'src/environments/environment';

import { AlertController, LoadingController, Platform} from '@ionic/angular';

import { FileOpener } from '@ionic-native/file-opener/ngx'
import { AppVersion } from '@ionic-native/app-version/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {  

  public userloginAndRegister: UserLogin = {}

  public formLogin: FormGroup;

  appVersion: string;

  ionPackageName: string;

  constructor(
    private fBuider: FormBuilder,
    private overlayService: OverlayService,
    private apiService: ApiService,
    private router: Router,
    private fileOpener: FileOpener,
    private AppVersion: AppVersion,
    public platform: Platform,
    private alertCtrl: AlertController,
    private loading: LoadingController,    
    private file: File,
    private nativeHTTP: HTTP
    
  ) { 
    platform.ready().then(() => {
      this.AppVersion.getPackageName()
        .then((res) => {
          this.ionPackageName = res;
        })
        .catch((error) => {
          alert(error);
        });

      this.AppVersion.getVersionNumber()
        .then((res) => {
          this.appVersion = res;
        })
        .catch((error) => {
          alert(error);
        });
    });
  }

  ngOnInit() {
    this.formLogin = this.fBuider.group({
      'username': [this.userloginAndRegister.cpf, [Validators.required]],
      'password': [this.userloginAndRegister.password, [Validators.required, Validators.minLength(6)]],
    })

    if (environment.production) {
      this.updateApp(this.ionPackageName);
    } else {
      this.appVersion = 'DEV';
    }
  }
    

  async onPassKeyPress(keycode: any) {    
    if (keycode === 13) {
      if (this.formLogin.value.password !== '' && this.formLogin.value.password.length === 6){
        await this.login()        
      } 
    }
  }

  async login() {
    const loading = this.overlayService.loading()
    try {
      const data = this.formLogin.value
      this.apiService.login(data).then((result: any) => {
        this.overlayService.toast({ message: 'Login Realizado com Sussesso' })
        localStorage.setItem('token', JSON.stringify(result));
        localStorage.setItem('praUp', JSON.stringify(this.formLogin.value.password))
        this.formLogin.reset()
        this.router.navigate(['/orders'])
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

  async updateApp(id) {
    const updateApp = await this.apiService.getUpdateApp(
      'tracking.innovation.com' || id
    );//tracking.innovation.com appid do apk

    if (environment.production) {
      if (
        parseInt(updateApp.appVersion.replace(/[^0-9]/g, '')) >
        parseInt(this.appVersion.replace(/[^0-9]/g, ''))
      ) {
        const alert = await this.alertCtrl.create({
          header: 'Atenção',
          message: `Nova versão disponível (${updateApp.appVersion})\nDeseja atualizar agora?`,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              },
            },
            {
              text: 'Atualizar',
              handler: async () => {
                await this.overlayService.loading({message:'Aguarde. Baixando atualização!'});
                const url = updateApp.urlUpdate;                
                const filePath =
                  this.file.dataDirectory +
                  `4log-app-tracking-${updateApp.appVersion}.apk`;

                this.nativeHTTP
                  .downloadFile(url, {}, {}, filePath)
                  .then((response) => {
                    const nativePath = response.toURL();
                    this.fileOpener.open(
                      nativePath,
                      'application/vnd.android.package-archive'
                    );
                    this.loading.dismiss();
                  })
                  .catch((err) => {
                    this.overlayService.toastMiddle({message:
                      'Não foi possível baixar a atualização ' + err},
                      4000
                    );
                    this.loading.dismiss();
                  });
              },
            },
          ],
        });

        await alert.present();
      }
    }
  }

}
//fecha classe da pagina
