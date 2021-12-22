import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, Animation, Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/service/api.service';
import { OverlayService } from 'src/app/service/overlay.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  @ViewChild('blocks') blocks: any;
  public initialStep: number = 100
  private maxTranslate: number;
  private animation: Animation;

  userName: string = ''
  userId: string = ''
  orders: any[];
  order: any;
  orderId: any = ''

  constructor(
    private apiService: ApiService,
    private router: Router,
    private overlayService: OverlayService,
    private animationCtrl: AnimationController,
    private platform: Platform,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    
    this.maxTranslate = this.platform.height() - 200;    
  }

  ngOnInit() {    
  }  

  ionViewWillEnter() {
    this.orders = []
    this.getUserData()
    this.getAllOrders(this.order.cpf)
    console.log(this.order)
    console.log('aaasasasa2', this.order.cpf)

    this.createAnimation();
  }

  toogleBlocks() {
    this.initialStep = this.initialStep === 0 ? this.maxTranslate : 0

    this.animation.direction(this.initialStep === 0 ? 'reverse' : 'normal').play();
  }

  createAnimation() {
    this.animation = this.animationCtrl.create()
      .addElement(this.blocks.nativeElement)
      .duration(500)
      .fromTo('height', 'auto', `0`);
  }

  logout() {
    this.toogleBlocks()
    localStorage.clear()
    this.router.navigate(['/login']);
  }

  getUserData() {
    const userData = JSON.parse(localStorage.getItem('token'))
    this.userName = userData.driver.name
    this.userId = userData.driver.id

    this.order = userData.driver
  }

  async getAllOrders(cpf: string) {
    const loading = this.overlayService.loading()
    try {
      this.apiService.getAllOrders(cpf).then((result: any) => {
        for (let i = 0; i < result.length; i++) {
          let order = result[i];
          this.orders.push(order)
        }
      })
    } finally {
      (await loading).dismiss()
    }
  }

  async openTracking(id) {
    this.orderId = id
    const loading = this.overlayService.loading()
    try {
      const order = this.orders.find(result => result.id === this.orderId)
      this.router.navigateByUrl('tracking', {
        state: { order: order }
      }).catch((error: any) => {
        this.overlayService.toast({ message: 'Erro: ' + error.error, position: 'bottom', duration: 3000 })
      })
    } finally {
      (await loading).dismiss()
    }
  }

  updateUser(){
    this.toogleBlocks()
    this.router.navigate(['/update-user']);
  }

  async deleteUser(id) {
    id = this.userId
    const alert = await this.alertCtrl.create({
      header: 'Exclusão de conta',
      message: 'Você deseja solicitar <b>exclusão</b> de sua conta? </br>Saiba que se selecionar sim, <b>todos os dados serão apagados</b>',
      cssClass: 'ion-text-center',
      buttons: [{
        text: 'NÃO',
        handler: () => {
          console.log("Cancelou")
        }
      },
      {
        text: 'SIM',
        cssClass: 'primary',
        handler: async () => {
          const deleteUser = await this.apiService.deleteUser(id)

          if (deleteUser === null || undefined) {
            const toast = await this.toastCtrl.create({
              message: 'Usuário deletado com sucesso !',
              cssClass: 'ion-text-center',
              duration: 2000
            })

            toast.present()
            this.logout()
          }
          else {
            console.log('Erro no delete do User')
          }
        }
      }]
    })
    alert.present()
  }


}
