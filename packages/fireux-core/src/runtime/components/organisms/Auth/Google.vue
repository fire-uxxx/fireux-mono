<template>
  <button class="google-btn" @click="handleGoogleSignIn">
    <img :src="logoSrc" alt="Sign in with Google" />
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../../composables/firebase/useAuth'

const router = useRouter()
const { signInWithGoogle } = useAuth()
const isDark = computed(() => useColorMode().value === 'dark')

const logoSrc = computed(() =>
  isDark.value ? '/img/sign-in-dark.svg' : '/img/sign-in-light.svg'
)

const handleGoogleSignIn = async () => {
  const user = await signInWithGoogle()
  if (user?.uid) {
    console.log('[handleGoogleSignIn] ✅ Got UID:', user.uid)
    try {
      const { ensureApp } = await useAppEnsure()
      await ensureApp(user)
      router.push('/dashboard')
    } catch (error) {
      console.error('[handleGoogleSignIn] ❌ Error ensuring app:', error)
    }
  } else {
    console.warn('[handleGoogleSignIn] ❌ No UID returned from Google sign-in')
  }
}
</script>

<style scoped>
.google-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}
</style>
