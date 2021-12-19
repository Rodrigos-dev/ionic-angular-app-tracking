import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  order: any
  user: any
  userName: any

  items: any[]

  trackingStatus: string = ''
  shippingStatus: string = ''
  companyDocument: string = ''

  step0: string = ''
  step1: string = ''
  step2: string = ''
  step3: string = ''


  public form: FormGroup;

  constructor(private router: Router, private fBuider: FormBuilder) {
    const nav = this.router.getCurrentNavigation();
    this.order = nav.extras.state.order
  }

  ngOnInit() {
    console.log('akiiii', this.order)
  }

  ionViewWillEnter() {
    this.items = []
    this.getItens()
    this.verifyStepStatus();
    this.companyDocument = this.order.companyDocument
    console.log('company document', this.items)
  }

  getItens() {
    this.items = this.order.items
    console.log(this.items)
  }

  ordersPag() {
    this.order = {}
    this.router.navigate(['/orders']);
  }  

  logout() {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

  verifyStepStatus() {
    this.companyDocument = this.order.companyDocument
    this.trackingStatus = this.order.statusCode//para os quenao sao whiteCloudes 
    this.shippingStatus = this.order.shippingStatus //para whiteCloud

    if (this.companyDocument === '33841875807') {//se for white cloud
      this.step0 = 'Criado';
      this.step1 = 'Embalado';
      this.step2 = 'Enviado';
      this.step3 = 'Entregue';

      if (this.shippingStatus === '') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

      } else if (this.shippingStatus === 'unpacked') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

      } else if (this.shippingStatus === 'unshipped') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');

      } else if (this.shippingStatus === 'shipped') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');

        document.getElementById('thirth').classList.add('active');
        document.getElementById('thirthIcon').classList.add('active');

      } else {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');

        document.getElementById('thirth').classList.add('active');
        document.getElementById('thirthIcon').classList.add('active');

        document.getElementById('four').classList.add('active');
        document.getElementById('fourIcon').classList.add('active');      
      }

    }else{

      if ((this.trackingStatus === 'new')||(this.trackingStatus === 'occurrence')||(this.trackingStatus === 'undelivered')||(this.trackingStatus === '')) {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

      } else if (this.trackingStatus === 'on-planned-route') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');
      } else if (this.trackingStatus === 'on-route') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');

        document.getElementById('thirth').classList.add('active');
        document.getElementById('thirthIcon').classList.add('active');
      } else if (this.trackingStatus === 'delivered') {
        document.getElementById('first').classList.add('active');
        document.getElementById('firstIcon').classList.add('active');

        document.getElementById('second').classList.add('active');
        document.getElementById('secondIcon').classList.add('active');

        document.getElementById('thirth').classList.add('active');
        document.getElementById('thirthIcon').classList.add('active');

        document.getElementById('four').classList.add('active');
        document.getElementById('fourIcon').classList.add('active');
      }
    }
  }

}



