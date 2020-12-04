import { Role } from './role.model';
import { Subscription } from './subscription.model';
import { Avatar } from './avatar.model';
import { Profile } from './profile.model';
import { SubscriptionModel } from './subscription-model.model';

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
  userSubscription: Subscription;
  subscriptionModel: SubscriptionModel;
  userAvatar: Avatar;
  userProfile: Profile;
  phone?: string;
}
