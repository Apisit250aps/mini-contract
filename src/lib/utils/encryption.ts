import * as argon2 from 'argon2'

export async function hash(password: string): Promise<string> {
  return await argon2.hash(password)
}

export async function verify(
  hashed: string,
  password: string,
): Promise<boolean> {
  const v = await argon2.verify(hashed, password)
  return v
}
