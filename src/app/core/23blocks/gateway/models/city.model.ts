import {County} from './county.model';

export class City {
  id: number;
  name: string;
  countyId: string;
  countyName: string;
  stateId: string;
  stateName: string;
  countryId: string;
  countryName: string;
  county: County;
}
