import { useEffect, useState } from "react";
import { LogIn, Mail } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { Button } from "../ui/Button";
import { Field, UnderlineInput } from "../ui/Field";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("游客模式可使用核心工具，登录后可接入云端保存。");

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) {
        setStatus(`已登录：${data.session.user.email}`);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session?.user.email ? `已登录：${session.user.email}` : "游客模式可使用核心工具，登录后可接入云端保存。");
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleMagicLink() {
    if (!supabase || !email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus(error ? error.message : "登录邮件已发送，请在邮箱中完成验证。");
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>认证与保存</CardTitle>
          <CardDescription>{status}</CardDescription>
        </div>
        <LogIn aria-hidden="true" className="h-5 w-5 text-primary-700" strokeWidth={1.5} />
      </CardHeader>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <Field label="邮箱">
          <UnderlineInput
            type="email"
            value={email}
            placeholder="name@company.com"
            disabled={!isSupabaseConfigured}
            onChange={(event) => setEmail(event.target.value)}
          />
        </Field>
        <Button onClick={handleMagicLink} disabled={!isSupabaseConfigured || !email}>
          <Mail aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          发送登录邮件
        </Button>
      </div>
      {!isSupabaseConfigured ? (
        <p className="mt-4 text-xs text-slate-400">
          当前未配置 VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY，MVP 使用本地保存入口。
        </p>
      ) : null}
    </Card>
  );
}
