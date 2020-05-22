import {ExchangeSetting} from './exchange-setting.model';
import {CompanyDetail} from './company-detail.model';
import {CompanyKeys} from './company-keys.model';


export class Company {
	id: number;
	uniqueId: string;
	urlId: string;
  name: string;
  code: string;

  preferredLanguage: string;
  preferredDomain: string;
  apiAccessKey: string;
  apiUrl: string;
  payload: string;

  slackHook: string;
  slackChannel: number;
  slackUsername: string;

  status: string;

  createdAt: Date;
  updatedAt: Date;

  companyKeys: CompanyKeys[];
	companyDetail: CompanyDetail;
	exchangeSettings: ExchangeSetting[];
}
