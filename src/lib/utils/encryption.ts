import * as argon2 from 'argon2'

export async function hash(password: string): Promise<string> {
  return await argon2.hash(password)
}

export async function verify(
  hashed: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(hashed, password)
}
