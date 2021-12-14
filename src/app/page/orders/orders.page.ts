import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { OverlayService } from 'src/app/service/overlay.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  userName: string = ''
  orders: any[];
  order: any;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private overlayService: OverlayService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav.extras.state.delivery
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.orders = []
    this.getUserData()
    this.getAllOrders(this.order.driver.cpf)
    console.log(this.order)
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

  getUserData() {
    const userData = JSON.parse(localStorage.getItem('token'))
    this.userName = userData.driver.name
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
    const loading = this.overlayService.loading()
    console.log('asdf', this.orders)
    try {
      const order = (this.orders.find(result => result.id))      
      this.router.navigateByUrl('tracking', {
        state: { order: order }
      }).catch((error: any) => {
        this.overlayService.toast({ message: 'Erro: ' + error.error, position: 'bottom', duration: 3000 })
      })
    } finally {
      (await loading).dismiss()
    }
  }

}
