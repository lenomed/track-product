export interface ContactRequest {
  message: string;
  email: string;
  name: string;
  subject: string;
}

export interface ContactResponse extends ContactRequest {
  id: string;
}
