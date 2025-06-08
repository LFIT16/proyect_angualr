import { User } from '../Users/user.model';
export class Password {
    id?: number;
    user_id?: User[];
    content?: string;
    startAt?: Date;
    endAt?: Date;
    created_at?: Date;
    updated_at?: Date;
}
