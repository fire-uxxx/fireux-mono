import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { useFirestore, useCurrentUser } from 'vuefire'
import type { App } from '../../models/app.model'
import { useFireUXConfig } from '../FireUXConfig'
import { useFirestoreManager } from '../firestore/useFirestoreManager'

export async function useAppEnsure() {
  const db = useFirestore()
  const { waitForCurrentUser, setDocument } = useFirestoreManager()
  const { tenantId, appName } = useFireUXConfig()

  async function ensureApp() {
    const currentUser = (await waitForCurrentUser()) as NonNullable<
      ReturnType<typeof useCurrentUser>['value']
    >
    const uid = currentUser.uid

    const appDocRef = doc(db, 'apps', tenantId)
    const appSnap = await getDoc(appDocRef)

    if (appSnap.exists()) {
      const createdAt = appSnap.data()?.created_at || 'unknown date'
      console.log(
        `✅ [ensureApp] App '${tenantId}' already exists. Created on ${createdAt}.`
      )
      return
    }

    const appData: Partial<App> = {
      id: tenantId,
      app_name: appName,
      admin_ids: [uid],
    }
    // Create the app document (includes created_at, created_in automatically)
    await setDocument('apps', tenantId, appData)

    // ✅ Update Core User to reflect admin role
    const coreUserRef = doc(db, 'users', uid)
    await updateDoc(coreUserRef, {
      adminOf: arrayUnion(tenantId),
    })

    console.log(
      `🎉 [ensureApp] App '${tenantId}' created and user '${uid}' added as admin.`
    )
    return tenantId
  }

  return { ensureApp }
}
