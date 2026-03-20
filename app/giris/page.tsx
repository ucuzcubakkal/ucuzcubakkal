"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, Sparkles, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, status, errorMessage, loginWithPi } = useAuth();

  // Giriş tamamlanınca profil sayfasına yönlendir
  useEffect(() => {
    if (!isLoggedIn) return;
    // URL'de redirect parametresi varsa oraya git, yoksa profile
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirect = params.get("redirect") ?? "/profil";
    router.replace(redirect);
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Üst dekoratif şerit */}
      <div className="h-1 w-full bg-primary" />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo ve başlık */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <span className="text-3xl font-serif font-bold text-primary">U</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Ucuzcubakkal</h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Pi topluluğu için global alışveriş platformu. Pi hesabınızla saniyeler içinde giriş yapın.
          </p>
        </div>

        {/* Ana giriş kartı */}
        <div className="w-full max-w-sm">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">

            {/* Pi butonu - ana aksiyon */}
            {status !== "authenticated" && (
              <Button
                className="w-full h-13 text-base font-semibold gap-3 rounded-xl"
                size="lg"
                onClick={loginWithPi}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Pi Network bağlanıyor...
                  </>
                ) : (
                  <>
                    {/* Pi logosu */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm.75 14.25h-1.5v-5.5h1.5v5.5zm0-7h-1.5v-1.5h1.5v1.5z"/>
                    </svg>
                    Pi ile Devam Et
                  </>
                )}
              </Button>
            )}

            {/* Yükleniyor durumu */}
            {isLoading && (
              <div className="flex flex-col items-center gap-2 py-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Pi Browser üzerinden kimliğiniz doğrulanıyor...
                </p>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hata durumu */}
            {status === "error" && errorMessage && (
              <div className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-destructive">Giriş yapılamadı</p>
                  <p className="text-xs text-destructive/80 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Başarı durumu */}
            {status === "authenticated" && (
              <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Giriş başarılı, yönlendiriliyorsunuz...
                </p>
              </div>
            )}

            {/* Ayırıcı */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">Kayıt gerekmez</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Avantajlar listesi */}
            <ul className="space-y-2.5">
              {[
                { icon: Zap, text: "Tek tıkla anında giriş — şifre yok, form yok" },
                { icon: Shield, text: "Pi Network güvenliği ile korunan hesabınız" },
                { icon: Users, text: "Pi kullanıcı adınız profil olarak kullanılır" },
                { icon: Sparkles, text: "Özel Pi topluluğu fiyatları ve kampanyalar" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alt bilgi */}
          <p className="text-xs text-muted-foreground text-center mt-4 px-2 leading-relaxed">
            Devam ederek{" "}
            <span className="text-primary cursor-pointer hover:underline">Kullanım Şartları</span>
            {" "}ve{" "}
            <span className="text-primary cursor-pointer hover:underline">Gizlilik Politikası</span>
            {"'nı"} kabul etmiş olursunuz.
          </p>
        </div>
      </div>

      {/* Alt bilgi çubuğu */}
      <div className="border-t border-border py-4 px-4 text-center">
        <p className="text-xs text-muted-foreground">
          Pi Browser'da tam deneyim · Normal tarayıcıda demo mod etkin
        </p>
      </div>
    </div>
  );
}
