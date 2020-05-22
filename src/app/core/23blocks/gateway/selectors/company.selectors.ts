import {Company} from '..';
// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';
// CRUD
import {QueryResultsModel} from '../../tools/query-results.model';
// State
import { CompaniesState } from '../reducers/company.reducers';
import * as fromCompany from '../reducers/company.reducers';
import { each } from 'lodash';
import {ArrayTools} from '../../tools/array-tools';


export const selectCompanyState = createFeatureSelector<CompaniesState>('companies');

export const selectCompanyById = (companyId: string) => createSelector(
  selectCompanyState,
    companiesState => companiesState.entities[companyId]
);

export const selectAllCompanies = createSelector(
    selectCompanyState,
  companies => companies.companies
    // fromCompany.selectAll
);

export const selectAllCompaniesIds = createSelector(
  selectCompanyState,
  fromCompany.selectIds
);

export const isCompaniesLoaded = createSelector(
  selectCompanyState,
    companiesState => companiesState.isAllCompaniesLoaded
);

export const selectCompany = createSelector(
  selectCompanyState,
  companies => companies.company
);

export const isCompanyLoaded = createSelector(
  selectCompanyState,
  companiesState => companiesState.isCompanyLoaded
);

// export const selectRolesPageLoading = createSelector(
//   selectCompanyState,
//   companiesState => companiesState.listLoading
// );
//
// export const selectRolesActionLoading = createSelector(
//   selectCompanyState,
//     rolesState => rolesState.actionsloading
// );
//
// export const selectLastCreatedRoleId = createSelector(
//   selectCompanyState,
//     rolesState => rolesState.lastCreatedRoleId
// );
//
// export const selectRolesShowInitWaitingMessage = createSelector(
//   selectCompanyState,
//     rolesState => rolesState.showInitWaitingMessage
// );


export const selectQueryResult = createSelector(
  selectCompanyState,
    companiesState => {
        const items: Company[] = [];
        each(companiesState.entities, element => {
            items.push(element);
        });
        const httpExtension = new ArrayTools();
        const result: Company[] = httpExtension.sortArray(items, companiesState.lastQuery.sortField, companiesState.lastQuery.sortOrder);

        return new QueryResultsModel(companiesState.queryResult, companiesState.queryRowsCount);
    }
);
