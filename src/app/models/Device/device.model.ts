export interface Device {
  id?: number;
  user_id?: number[];
  ip?: string;
  name?: string;
  operating_system?: string;
  created_at?: Date | string | null;
  updated_at?: Date | string | null;
}
