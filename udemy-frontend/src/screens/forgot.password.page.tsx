import ChangePasswordForm from '@/components/auth/change-password.form'
import OtpForm from '@/components/auth/otp.form'
import VerifyMail from '@/components/auth/verify-mail.form'
import Loading from '@/components/loading'
import { useAppSelector } from '@/redux/hook'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [mode, setMode] = useState<"mail" | "otp" | "change">("mail")
  const isLoading = useAppSelector(state => state.loading.pendingCount)

  if (isLoading > 0) return <Loading />

  return (
    <div>
      <AnimatePresence mode="wait">
        {mode === "mail" && (
          <motion.div
            key="mail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
          >
            <VerifyMail setMode={setMode} />
          </motion.div>
        )}

        {mode === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
          >
            <OtpForm setMode={setMode} />
          </motion.div>
        )}

        {mode === "change" && (
          <motion.div
            key="change"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
          >
            <ChangePasswordForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}