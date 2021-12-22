import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { ApiService } from 'src/app/service/api.service';
import { ValidarCpf } from 'src/app/service/cpf-validator';
import { OverlayService } from 'src/app/service/overlay.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {
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

  userDados: any = ''

  public formUser: FormGroup;

  constructor(private fBuider: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private overlayService: OverlayService) { }

  ngOnInit() {
    this.createForm(this.user);

    this.getUserData()

    console.log(this.user, 'wwwwwww')

    this.formUser.get('name').setValue(this.user.name)
    this.formUser.get('email').setValue(this.user.email)
    this.formUser.get('phone').setValue(this.user.phone)
    this.formUser.get('cpf').setValue(this.user.cpf)

    this.formUser.get('postalcode').setValue(this.user.postalcode)
    this.formUser.get('street').setValue(this.user.street)
    this.formUser.get('number').setValue(this.user.number)
    this.formUser.get('neighborhood').setValue(this.user.neighborhood)
    this.formUser.get('complement').setValue(this.user.complement)
    this.formUser.get('city').setValue(this.user.city)
    this.formUser.get('state').setValue(this.user.state)
  }

  ordersPag() {
    this.router.navigate(['/orders']);
  }

  getUserData() {
    const userData = JSON.parse(localStorage.getItem('token'))
    this.user = userData.driver
    console.log('tese', this.user.name)
  }

  createForm(user): void {
    user = this.user
    this.formUser = this.fBuider.group({
      name: [this.user.name, [Validators.required, Validators.minLength(2)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      phone: [this.user.phone, [Validators.required]],
      cpf: [this.user.cpf, [Validators.required]],

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

  async updateUser() {
    
    const userData = JSON.parse(localStorage.getItem('token'))

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

      const verifyCPF = ValidarCpf.cpf(data.cpf);


      if (!verifyCPF) {
        this.overlayService.toast({ message: 'Cpf invalido' });
      } else {
        this.apiService.updateUser(data, userData.driver.id).then((result: any) => {
          this.overlayService.toast({
            message: 'Atualização Realizada',
          });

          //inicio da atualizacao do driver(user) no localStorage => const userData criada na 1 linha do metodo buscando os dados do localstorage
          userData.driver.name = this.formUser.value.name
          userData.driver.email = this.formUser.value.email
          userData.driver.phone = this.formUser.value.phone.replace(/[^0-9]/g, '');
          userData.driver.cpf = this.formUser.value.cpf.replace(/[^0-9]/g, '');
          userData.driver.postalcode = this.formUser.value.postalcode.replace(/[^0-9]/g, '');
          userData.driver.street = this.formUser.value.street
          userData.driver.number = this.formUser.value.number
          userData.driver.neighborhood = this.formUser.value.neighborhood
          userData.driver.complement = this.formUser.value.complement
          userData.driver.city = this.formUser.value.city
          userData.driver.state = this.formUser.value.state

          localStorage.setItem('token', JSON.stringify(userData));
          //fim da atualizacao do driver(user) no localStorage

          this.router.navigate(['/orders']);
        });
      }
    } finally {
      (await loading).dismiss();
    }
  }


  async buscaCep() {
    const cep = this.formUser.value.postalcode.replace(/[^0-9]/g, '');

    if (cep.length === 8) {
      return this.apiService.buscaCep(cep).then((result: any) => {
        console.log('aaa', result);

        let street = <HTMLInputElement>document.getElementById('street');
        street.value = result.logradouro;

        let neighborhood = <HTMLInputElement>(
          document.getElementById('neighborhood')
        );
        neighborhood.value = result.bairro;

        let city = <HTMLInputElement>document.getElementById('city');
        city.value = result.localidade;

        let state = <HTMLInputElement>document.getElementById('state');
        state.value = result.uf;
      });
    }
  }

}
