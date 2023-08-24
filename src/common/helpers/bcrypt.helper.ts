import * as bcrypt from 'bcrypt';

export function hashing(data: string): string {
  const salt: string = bcrypt.genSaltSync(10);

  return bcrypt.hashSync(data, salt);
}

export function verify(encrypt: string, data: string): boolean {
  return bcrypt.compareSync(data, encrypt);
}
