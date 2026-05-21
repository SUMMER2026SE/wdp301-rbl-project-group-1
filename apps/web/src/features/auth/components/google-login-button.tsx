"use client";

import { authApi, useLoginGoogleMutation } from "@/src/features/auth/authApi";
import { setAuth } from "@/src/features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/src/shared/store/hooks";

export default function GoogleLoginButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginGoogle] = useLoginGoogleMutation();

  return (
    <div className="flex w-full items-center justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (credentialResponse.credential) {
            try {
              const response = await loginGoogle({
                loginGoogleDto: { idToken: credentialResponse.credential },
              }).unwrap();

              dispatch(
                setAuth({
                  accessToken: response.data.accessToken,
                }),
              );

              dispatch(
                authApi.util.upsertQueryData("getMe", undefined, {
                  success: true,
                  message: response.message,
                  data: response.data.user,
                }),
              );

              router.push("/student/home");
            } catch {
              toast.error("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
            }
          }
        }}
        onError={() => {
          toast.error("Đăng nhập bằng Google thất bại.");
        }}
        text="signin_with"
        shape="rectangular"
      />
    </div>
  );
}
