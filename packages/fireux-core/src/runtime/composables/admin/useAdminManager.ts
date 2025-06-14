import {
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { useFireUXConfig } from '../FireUXConfig'

export function useAdminManager() {
  const db = useFirestore()
  const { appName, appId } = useFireUXConfig()

  async function promoteAdmin(uid: string): Promise<void> {
    await updateAppProfileRole(uid, 'admin')
    await updateAppAdmins(uid, true)
    console.log(`✅ User ${uid} promoted to admin for ${appName}`)
  }

  async function demoteAdmin(uid: string): Promise<void> {
    await updateAppProfileRole(uid, 'user')
    await updateAppAdmins(uid, false)
    console.log(`✅ User ${uid} demoted from admin for ${appName}`)
  }

  async function updateAppProfileRole(uid: string, role: 'user' | 'admin') {
    const profileRef = doc(db, `users/${uid}/profiles`, appId)
    await setDoc(profileRef, { role }, { merge: true })
  }

  async function updateAppAdmins(uid: string, add: boolean) {
    const appRef = doc(db, 'apps', appId)
    await updateDoc(appRef, {
      admins: add ? arrayUnion(uid) : arrayRemove(uid),
    })
  }

  return {
    promoteAdmin,
    demoteAdmin,
  }
}
