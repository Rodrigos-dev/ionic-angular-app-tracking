import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {  

  public user: User = {}

  public formUser: FormGroup  

  constructor(private fBuider: FormBuilder,private router: Router, private apiService: ApiService) { }

  ngOnInit() {
    this.formUser = this.fBuider.group({
      'name': [this.user.name],
      'email': [this.user.email],
      'phone': [this.user.phone],
      'cpf': [this.user.cpf],
      'password': [this.user.password],
      'confirmPassword': [this.user.confirmPassword],

      'postalcode':[this.user.postalcode],
      'street': [this.user.street],
      'number': [this.user.number],
      'neighborhood': [this.user.neighborhood],
      'complement': [this.user.complement],
      'city': [this.user.city],
      'state': [this.user.state],
      'type': ['FINAL_USER'],
      'status': ['active'],
      'companyDocument': ['37229719000109']      
    })   
  }   
  ionViewWillEnter() {
    
  }

  backPag() {    
    this.router.navigate(['/login']);
  }

  createUser(){
    const data = this.formUser.value

    console.log(data)
  }

  async buscaCep(){ 
    
    document.getElementById('street').innerHTML = '...'
    document.getElementById('neighborhood').innerHTML = '...'
    document.getElementById('city').innerHTML = '...'
    document.getElementById('state').innerHTML = '...'
    
    const cep = this.formUser.value.postalcode
      console.log(cep)
      
      return this.apiService.buscaCep(cep).then((result: any) => {
       console.log('aaa', result)

      document.getElementById('street').innerHTML = result.logradouro
      document.getElementById('neighborhood').innerHTML = result.bairro
      document.getElementById('city').innerHTML = result.localidade
      document.getElementById('state').innerHTML = result.uf
      })
      
    }
}





