import * as bcrypt from 'bcrypt';

export async function hashing(data: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);

  return bcrypt.hash(data, salt);
}

export async function verify(encrypt: string, data: string): Promise<boolean> {
  return bcrypt.compareSync(data, encrypt);
}
