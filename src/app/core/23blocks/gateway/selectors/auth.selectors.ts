// NGRX
import { createSelector } from '@ngrx/store';
// // Lodash
import { each, find, some } from 'lodash';
// Selectors
import { selectAllRoles } from './role.selectors';
import { selectAllPermissions } from './permission.selectors';
// Models
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';

export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
    selectAuthState,
    auth => auth.loggedIn
);

export const isLoggedOut = createSelector(
    isLoggedIn,
    loggedIn => !loggedIn
);

export const currentAuthToken = createSelector(
    selectAuthState,
    auth => auth.authToken
);


export const isUserLoaded = createSelector(
    selectAuthState,
    auth => auth.isUserLoaded
);

export const isAvatarLoaded = createSelector(
	selectAuthState,
	auth => auth.isAvatarLoaded
);

export const currentAuthUser = createSelector(
    selectAuthState,
    auth => auth.user
);

export const currentAuthAvatar = createSelector(
	selectAuthState,
	auth => auth.avatar
);

export const currentAuthUserId = createSelector(
	selectAuthState,
	auth => auth.user.unique_id
);

export const currentUserRoleIds = createSelector(
	currentAuthUser,
    user => {
		if (!user) {
			return [];
        }
		// console.log('User Roles:' + user.roles);
        // return user.roles;
		return [user.roleId];
    }
);

export const currentUserPermissionsIds = createSelector(
    currentUserRoleIds,
    selectAllRoles,
    (userRoleIds: number[], allRoles: Role[]) => {
		// console.log('matching Roles');
		const result = getPermissionsIdsFrom(userRoleIds, allRoles);
		return result;
    }
);
//
export const checkHasUserPermission = (permissionId: number) => createSelector(
    currentUserPermissionsIds,
    (ids: number[]) => {
        return ids.some(id => id === permissionId);
    }
);

export const currentUserPermissions = createSelector(
    currentUserPermissionsIds,
    selectAllPermissions,
    (permissionIds: number[], allPermissions: Permission[]) => {
    	// console.log('matching permissions');
        const result: Permission[] = [];
        each(permissionIds, id => {
            const userPermission = find(allPermissions, elem => elem.id === id);
            if (userPermission) {
                result.push(userPermission);
            }
        });
        return result;
    }
);
//
function getPermissionsIdsFrom(userRolesIds: number[] = [], allRoles: Role[] = []): number[] {
    const userRoles: Role[] = [];
    each(userRolesIds, (_id: number) => {
       const userRole = find(allRoles, (_role: Role) => _role.id === _id);
       if (userRole) {
           userRoles.push(userRole);
       }
    });

    const result: number[] = [];
    each(userRoles, (_role: Role) => {
        each(_role.permissions, id => {
            if (!some(result, _id => _id === id)) {
                result.push(id);
            }
        });
    });
    return result;
}
