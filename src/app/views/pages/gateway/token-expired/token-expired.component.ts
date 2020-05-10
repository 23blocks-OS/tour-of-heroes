import { Component, OnInit } from '@angular/core';
import { AuthNoticeService} from '../../../../core/23blocks/gateway';

@Component({
  selector: 'app-gateway-token-expired',
  templateUrl: './token-expired.component.html',
  styleUrls: ['./token-expired.component.scss']
})
export class TokenExpiredComponent implements OnInit {

  constructor(private authNoticeService: AuthNoticeService) { }

  ngOnInit() {
    this.authNoticeService.setNotice('Lo sentimos, tu Token ha expirado.', 'warning');
  }

}
