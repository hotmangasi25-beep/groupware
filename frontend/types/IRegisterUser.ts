export interface IRegisterUser {
  nip: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  metaToken: string | null;
  bornDate: string | null; // atau Date jika backend support
  gender: string | null;
  avatarUrl: string | null;
  signatureUrl: string | null;
}
