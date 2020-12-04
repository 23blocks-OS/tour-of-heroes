// NGRX
import {EntityState, EntityAdapter, createEntityAdapter} from '@ngrx/entity';
// Actions
import {CompanyActions, CompanyActionTypes} from '../actions/company.actions';
// Models
import {Company, User} from '..';
import {QueryParamsModel} from '../../tools/query-params.model';

export interface CompaniesState extends EntityState<Company> {
  isAllCompaniesLoaded: boolean;
  companies: Company[];
  isCompanyLoaded: boolean;
  company: Company;
  isAccessGranted: boolean;
  companyToken: string;
  appId: string;
  userName: string;
  queryRowsCount: number;
  queryResult: Company[];
  lastCreatedCompanyId: number;
  listLoading: boolean;
  actionsloading: boolean;
  lastQuery: QueryParamsModel;
  showInitWaitingMessage: boolean;
}

export const adapter: EntityAdapter<Company> = createEntityAdapter<Company>();

export const initialCompaniesState: CompaniesState = adapter.getInitialState({
  isAllCompaniesLoaded: false,
  companies: undefined,
  isCompanyLoaded: false,
  company: undefined,
  isAccessGranted: false,
  companyToken: '',
  appId: '',
  userName: '',
  queryRowsCount: 0,
  queryResult: [],
  lastCreatedCompanyId: undefined,
  listLoading: false,
  actionsloading: false,
  lastQuery: new QueryParamsModel({}),
  showInitWaitingMessage: true
});

export function companyReducer(state = initialCompaniesState, action: CompanyActions): CompaniesState {
  switch (action.type) {
    // case CompanyActionTypes.RolesPageToggleLoading: return {
    //         ...state, listLoading: action.payload.isLoading, lastCreatedCompanyId: undefined
    // };
    // case CompanyActionTypes.RolesActionToggleLoading: return {
    //     ...state, actionsloading: action.payload.isLoading
    // };
    // case CompanyActionTypes.RoleOnServerCreated: return {
    //     ...state
    // };
    // case CompanyActionTypes.RoleCreated: return adapter.addOne(action.payload.role, {
    //     ...state, lastCreatedRoleId: action.payload.role.id
    // });
    // case CompanyActionTypes.RoleUpdated: return adapter.updateOne(action.payload.partialrole, state);
    // case CompanyActionTypes.RoleDeleted: return adapter.removeOne(action.payload.id, state);
    case CompanyActionTypes.CompaniesLoaded: {
      // console.log('Reducer Companies Loaded');
      // console.log(action.payload.companies.length);

      // return adapter.setAll(action.payload.companies, {
      //   ...state, isAllCompaniesLoadedLoaded: true
      // });
      return {
        ...state,
        isAllCompaniesLoaded: true,
        companies: action.payload.companies
      };
    }

    case CompanyActionTypes.CompanyLoaded: {
      // console.log('Reducer Company Loaded');
      // console.log(action.payload.companies.length);
      return {
        ...state,
        isCompanyLoaded: true,
        company: action.payload.company
      }
    }
    case CompanyActionTypes.AccessGranted: {
      console.log('Reducer - Access Granted');
      console.log(action.payload);
      return {
        ...state,
        isAccessGranted: true,
        companyToken: action.payload.companyToken,
        appId: action.payload.appId
      }
    }
    // case CompanyActionTypes.RolesPageCancelled: return {
    //     ...state, listLoading: false, queryRowsCount: 0, queryResult: [], lastQuery: new QueryParamsModel({})
    // };
    // case CompanyActionTypes.RolesPageLoaded: return adapter.addMany(action.payload.roles, {
    //     ...initialCompaniesState,
    //     listLoading: false,
    //     queryRowsCount: action.payload.totalCount,
    //     queryResult: action.payload.roles,
    //     lastQuery: action.payload.page,
    //     showInitWaitingMessage: false
    // });
    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
