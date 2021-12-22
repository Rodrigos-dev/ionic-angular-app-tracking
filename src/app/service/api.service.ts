import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayService } from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public apiLink: string = 'https://api-staging.4logistica.com.br/'

  public urlCEP: 'https://viacep.com.br/ws/'

  private options: any = { headers: new HttpHeaders({'Content-type': 'application/json; charset=UTF-8' })}

  private api: string = 'http://localhost:3000/'

  constructor(public http: HttpClient, private overlayService: OverlayService, private router: Router) { }

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

  createUserLocal(data : any) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`http://localhost:3000/company`, JSON.stringify(data),
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

  createUser(data : any) {
    return new Promise<void>((resolve, reject) => {
      this.http.post(`${this.apiLink}user`, JSON.stringify(data),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }).subscribe((result: any) => {
          resolve(result)
        }, (error) => {
          reject(error)
          console.log(error)
          this.overlayService.toast({ message: 'Ocorreu algum erro com seu Cadastro' })
        })
    })
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
        this.overlayService.toast({ message: 'Ocorreu algum erro ou seu Token expirou' })
        localStorage.clear()
        this.router.navigate(['/login']);        
      })
    })
  }

  async buscaCep(cep: string) {
    return new Promise<void>((resolve, reject) => {
      this.http.get('https://viacep.com.br/ws/' + cep + '/json').subscribe((result: any) => {
        resolve(result)
      }, (error) => {
        reject(error)
        this.overlayService.toast({ message: 'Cep não encontrado' })        
      })
    })
  } 

  updateUser(data: any, id: string){
    return new Promise<void>((resolve, reject) => {
      this.http.put(`${this.apiLink}user/${id}`, JSON.stringify(data),this.headersOption()).subscribe((result: any) => {
          resolve(result)
        }, (error) => {
          reject(error)
          console.log(error)
          this.overlayService.toast({ message: 'Ocorreu algum erro tente novamente mais tarde' })
        })        
    })
  }  

  async deleteUser(id) {
    try {
      return await this.http
        .delete(`${this.apiLink}user/${id}`, this.headersOption())
        .toPromise();
    } catch (error) {
      return error;
    }
  }
    
}
