
// Models
export { Role } from './models/role.model';
export { Subscription} from './models/subscription.model';
export { User } from './models/user.model';
export { Avatar } from './models/avatar.model';
export { Permission } from './models/permission.model';

// // SERVICES
export { GatewayService } from './services/gateway.service';
export { AuthNoticeService } from '../gateway/auth-notice/auth-notice.service';

// ACTIONS
export {
	Login,
	Logout,
	Register,
	UserRequested,
	UserLoaded,
	AvatarLoaded,
	AvatarRequested,
	AuthActionTypes,
	AuthActions
} from '../gateway/actions/auth.actions';
export {
	AllPermissionsRequested,
	AllPermissionsLoaded,
	PermissionActionTypes,
	PermissionActions
} from '../gateway/actions/permission.actions';
export {
	RoleOnServerCreated,
	RoleCreated,
	RoleUpdated,
	RoleDeleted,
	RolesPageRequested,
	RolesPageLoaded,
	RolesPageCancelled,
	AllRolesLoaded,
	AllRolesRequested,
	RoleActionTypes,
	RoleActions
} from '../gateway/actions/role.actions';
// export {
//     UserCreated,
//     UserUpdated,
//     UserDeleted,
//     UserOnServerCreated,
//     UsersPageLoaded,
//     UsersPageCancelled,
//     UsersPageToggleLoading,
//     UsersPageRequested,
//     UsersActionToggleLoading
// } from './actions/user.actions';
//
// // EFFECTS
export { AuthEffects } from '../gateway/effects/auth.effects';
export { PermissionEffects } from '../gateway/effects/permission.effects';
export { RoleEffects } from '../gateway/effects/role.effects';
// export { UserEffects } from './effects/user.effects';
//
// REDUCERS
export { authReducer } from '../gateway/reducers/auth.reducers';
export { permissionsReducer } from '../gateway/reducers/permission.reducers';
export { rolesReducer } from '../gateway/reducers/role.reducers';
// export { usersReducer } from './reducers/user.reducers';
//
// SELECTORS
export {
	isLoggedIn,
	isLoggedOut,
	isUserLoaded,
	isAvatarLoaded,
	currentAuthToken,
	currentAuthUser,
	currentAuthAvatar,
	currentAuthUserId,
	currentUserRoleIds,
	currentUserPermissionsIds,
	currentUserPermissions,
	checkHasUserPermission
} from '../gateway/selectors/auth.selectors';
export {
	selectPermissionById,
	selectAllPermissions,
	selectAllPermissionsIds,
	allPermissionsLoaded
} from '../gateway/selectors/permission.selectors';
export {
	selectRoleById,
	selectAllRoles,
	selectAllRolesIds,
	allRolesLoaded,
	selectLastCreatedRoleId,
	selectRolesPageLoading,
	selectQueryResult,
	selectRolesActionLoading,
	selectRolesShowInitWaitingMessage
} from '../gateway/selectors/role.selectors';
// export {
//     selectUserById,
//     selectUsersPageLoading,
//     selectLastCreatedUserId,
//     selectUsersInStore,
//     selectHasUsersInStore,
//     selectUsersPageLastQuery,
//     selectUsersActionLoading,
//     selectUsersShowInitWaitingMessage
// } from './selectors/user.selectors';
//
// GUARDS
export { GatewayGuard } from './guards/gateway.guard';
// export { ModuleGuard } from './guards/module.guard';
//

export { AuthNotice } from '../gateway/auth-notice/auth-notice.interface';

