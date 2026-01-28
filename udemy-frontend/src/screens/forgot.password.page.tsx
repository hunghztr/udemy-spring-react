import ChangePasswordForm from '@/components/auth/change-password.form';
import OtpForm from '@/components/auth/otp.form';
import VerifyMail from '@/components/auth/verify-mail.form';
import Loading from '@/components/loading';
import { useAppSelector } from '@/redux/hook';
import {useState } from 'react';

export default function ForgotPasswordPage() {
  const [mode,setMode] = useState<"mail"|"otp"|"change">("mail")
  const isLoading = useAppSelector(state => state.loading.pendingCount);
  if(isLoading > 0) return <Loading />
  return (
    <div>
      {
        mode === 'mail' ? (
          <VerifyMail setMode={setMode} />
        ) : mode == 'otp' ? (
          <OtpForm setMode={setMode} />
        ) : (
          <ChangePasswordForm />
        )
      }
      </div>
  )
}
