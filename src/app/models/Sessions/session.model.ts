import { User } from '../Users/user.model';
export class Session {
    id?: String;
    user_id?: User[];
    token?: String;
    expiration?: Date;
    FACode?: String;
    state?: String;
    created_at?: Date;
    updated_at?: Date;
}
