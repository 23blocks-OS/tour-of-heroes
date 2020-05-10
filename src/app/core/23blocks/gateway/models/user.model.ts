import { Role } from './role.model';
import { Subscription } from './subscription.model';
import { Avatar } from './avatar.model';


export class User {
	id: number;
	email: string;
	provider: string;
	uid: string;
	roleId: number;
	username: string;
	bio: string;
	allowPasswordChange: boolean;
	name: string;
	nickname: string;
	uniqueId: string;
	lastSignInAt: Date;
	roles: Role[];
	subscription: Subscription;
	avatar: Avatar;
}
