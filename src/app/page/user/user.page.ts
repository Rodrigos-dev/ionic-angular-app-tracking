import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/service/api.service';
import { ValidarCpf } from 'src/app/service/cpf-validator';
import { OverlayService } from 'src/app/service/overlay.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  public user: User = {
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',

    postalcode: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    city: '',
    state: '',
    type: '',
    status: '',
    companyDocument: '',
  };

  public formUser: FormGroup;

  constructor(
    private fBuider: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private overlayService: OverlayService
  ) {}

  ngOnInit() {
    this.formUser = this.fBuider.group({
      name: [this.user.name, [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      cpf: [this.user.cpf, [Validators.required]],
      password: [this.user.password,[Validators.required, Validators.minLength(6)]],
      confirmPassword: [this.user.confirmPassword,[Validators.required, Validators.minLength(6)]],

      postalcode: [this.user.postalcode, [Validators.required]],
      street: [this.user.street, [Validators.required]],
      number: [this.user.number, [Validators.required]],
      neighborhood: [this.user.neighborhood, [Validators.required]],
      complement: [this.user.complement],
      city: [this.user.city, [Validators.required]],
      state: [this.user.state, [Validators.required]],
      type: ['FINAL_USER'],
      status: ['active'],
      companyDocument: ['3722971900010'],
    });
  }

  backPag() {
    this.router.navigate(['/login']);
  }  


  async onPassKeyPress(keycode: any) {    
    if (keycode === 13) {
      if (this.formUser.dirty && this.formUser.valid){
        this.createUser()
      }      
    }
  }

  async createUser() {
    const loading = this.overlayService.loading();
    try {
      this.formUser.value.phone = this.formUser.value.phone.replace(
        /[^0-9]/g,
        ''
      );
      this.formUser.value.cpf = this.formUser.value.cpf.replace(/[^0-9]/g, '');
      this.formUser.value.postalcode = this.formUser.value.postalcode.replace(
        /[^0-9]/g,
        ''
      );

      const data = this.formUser.value;

      console.log(this.formUser.value);
      const verifyCPF = ValidarCpf.cpf(data.cpf);

      if (data.password !== data.confirmPassword) {
        this.overlayService.toast({
          message: 'Senha e confirmar senha devem ser iguais',
        });
      } else if (!verifyCPF) {
        this.overlayService.toast({ message: 'Cpf invalido' });
      } else {
        const { confirmPassword, ...rest } = data;
        console.log('confirm', confirmPassword, 'rest', rest);
        this.apiService.createUser(rest).then((result: any) => {
          this.overlayService.toast({
            message: 'Obrigado!!! Cadastro realizado com sucesso',
          });
          this.formUser.reset();
          this.router.navigate(['/login']);
        });
        console.log(this.formUser.value);
      }
    } finally {
      (await loading).dismiss();
    }
  }

  async buscaCep() {
    const cep = this.formUser.value.postalcode.replace(/[^0-9]/g, '');

    if (cep.length === 8) {
      return this.apiService.buscaCep(cep).then((result: any) => {

        if (result.erro === true) {
          this.overlayService.toast({ message: 'Cep não encontrado' })
        }

        let street = <HTMLInputElement>document.getElementById('street');
        street.value = result.logradouro;

        let neighborhood = <HTMLInputElement>(document.getElementById('neighborhood'));
        neighborhood.value = result.bairro;

        let city = <HTMLInputElement>document.getElementById('city');
        city.value = result.localidade;

        let state = <HTMLInputElement>document.getElementById('state');
        state.value = result.uf;
      });

    } else {

      let street = <HTMLInputElement>document.getElementById('street');
      street.value = '';

      let neighborhood = <HTMLInputElement>(document.getElementById('neighborhood'));
      neighborhood.value = '';

      let city = <HTMLInputElement>document.getElementById('city');
      city.value = '';

      let state = <HTMLInputElement>document.getElementById('state');
      state.value = '';
    }
  }
}
