export interface ContactData {
  id: number;
  title: string;
  description: { type: string; children: { type: string; text: string }[] }[];
  address: string;
  email: string;
  phone: string;
  google_map_embed: { type: string; children: { type: string; text: string }[] }[];
  form_enabled: boolean;
}