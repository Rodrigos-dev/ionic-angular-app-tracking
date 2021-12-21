import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.page.html',
  styleUrls: ['./update-user.page.scss'],
})
export class UpdateUserPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ordersPag() {    
    this.router.navigate(['/orders']);
  }

}
