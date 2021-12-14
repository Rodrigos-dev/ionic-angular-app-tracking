import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OverlayService } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public apiLink: string = 'https://api-staging.4logistica.com.br/'

  constructor(public http: HttpClient, private overlayService: OverlayService) { }

  headersOption() {
    const token = JSON.parse(localStorage.getItem('token'));
    const headersOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token.access_token
      }
    }
    console.log('retorno', token.user, token.access_token)
    return headersOptions
  }

  login(data: any) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`${this.apiLink}user/login`, JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }).subscribe((result: any) => {
          resolve(result)
        }, (error) => {
          reject(error)
          console.log(error)
          this.overlayService.toast({ message: 'Usuario não encontrado' })
        })
    })
  }

  getAllOrders(cpf: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.get(`${this.apiLink}order/orders-customer/${cpf}`, this.headersOption()).subscribe((result: any) => {
        resolve(result)
      }, (error) => {
        reject(error)
        console.log(error)
      })
    })
  }
  
}
