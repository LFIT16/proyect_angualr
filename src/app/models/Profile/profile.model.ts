import { User } from "../Users/user.model";

export class Profile {
    id?: number;
    user_id: User[];
    phone?: string;
    photo?: string;
    created_at?: Date;
    updated_at?: Date;
}
