import { Component, OnInit } from '@angular/core';
import {AuthNoticeService} from '../../../../core/23blocks/gateway';

@Component({
  selector: 'app-gateway-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {

  constructor(private authNoticeService: AuthNoticeService) { }

  ngOnInit() {
    this.authNoticeService.setNotice('Gracias por confirmar tu correo. Bienvenido');
  }

}
