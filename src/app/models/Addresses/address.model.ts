import { User } from '../Users/user.model';
export class Address {
    id?: number; 
    user_id?: User[]; 
    street?: string;
    number?: string;
    latitude?: number; 
    longitude?: number;
    created_at?: Date;
    updated_at?: Date;  
}
