import pb from '@/lib/pocketbase/client'

export function getCurrentUser() {
  return pb.authStore.record
}

export function isAuthenticated(): boolean {
  return pb.authStore.isValid
}

export async function loginWithPassword(email: string, pass: string) {
  const authData = await pb.collection('users').authWithPassword(email.trim(), pass)
  return authData
}

export function logout() {
  pb.authStore.clear()
}
