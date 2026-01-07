import {useState } from 'react';
import VerifyMail from '../components/auth/verify-mail.form'
import OtpForm from '../components/auth/otp.form';
import { useAppSelector } from '../redux/hook';
import Loading from '../components/loading';
import ChangePasswordForm from '../components/auth/change-password.form';


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
