"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Mail, Plus, Trash2, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailEntry { id: string; email: string; active: boolean; }

const SECTIONS = [
  { id: "revenue",   label: "Haftalik Gelir Ozeti"        },
  { id: "orders",    label: "Siparis Istatistikleri"       },
  { id: "members",   label: "Yeni Uye & Kullanici Verisi"  },
  { id: "sellers",   label: "Satici Performansi"           },
  { id: "returns",   label: "Iade & Sikayet Ozeti"         },
  { id: "traffic",   label: "Site Trafik Ozeti"            },
];

const SCHEDULE_OPTIONS = ["Pazartesi 09:00","Cuma 17:00","Pazar 10:00"];

export function AdminWeeklyEmail() {
  const [recipients, setRecipients] = useState<EmailEntry[]>([
    { id:"R1", email:"hanedan@ucuzcubakkal.com", active:true  },
    { id:"R2", email:"sercan@ucuzcubakkal.com",  active:true  },
    { id:"R3", email:"lale@ucuzcubakkal.com",    active:false },
  ]);
  const [newEmail,      setNewEmail]      = useState("");
  const [sections,      setSections]      = useState<string[]>(["revenue","orders","members"]);
  const [schedule,      setSchedule]      = useState(SCHEDULE_OPTIONS[0]);
  const [emailEnabled,  setEmailEnabled]  = useState(true);
  const [testSent,      setTestSent]      = useState(false);
  const { toast } = useToast();

  function addRecipient() {
    if (!newEmail.includes("@")) return;
    setRecipients(prev => [...prev, { id: `R${Date.now()}`, email: newEmail, active: true }]);
    setNewEmail("");
  }
  function toggleSection(id: string) {
    setSections(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }
  function sendTest() {
    setTestSent(true);
    toast({ title: "Test e-postasi gonderildi", description: "Aktif alıcılara ornek ozet gonderildi", duration: 3000 });
    setTimeout(() => setTestSent(false), 4000);
  }

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Otomatik Haftalik Ozet E-postasi
            </CardTitle>
            <CardDescription className="text-xs">Platform KPI ozetini belirlenen adminlere otomatik gonder</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{emailEnabled ? "Aktif" : "Kapali"}</span>
            <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
          </div>
        </div>
      </CardHeader>
      <CardContent className={`space-y-5 ${!emailEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        {/* Zamanlama */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gonderim Zamani</p>
          <div className="flex gap-2 flex-wrap">
            {SCHEDULE_OPTIONS.map(opt => (
              <button key={opt} onClick={() => setSchedule(opt)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${schedule === opt ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* E-posta icerik secimi */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">E-posta Icerigi</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => toggleSection(s.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs text-left transition-all
                  ${sections.includes(s.id) ? "border-primary bg-primary/5 text-primary font-medium" : "border-border hover:bg-muted text-muted-foreground"}`}>
                <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors
                  ${sections.includes(s.id) ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                  {sections.includes(s.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
                </div>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Alıcılar */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Alicilar</p>
          <div className="space-y-2 mb-2">
            {recipients.map(r => (
              <div key={r.id} className="flex items-center gap-2">
                <Switch checked={r.active} onCheckedChange={() => setRecipients(prev => prev.map(x => x.id === r.id ? { ...x, active: !x.active } : x))} className="flex-shrink-0" />
                <span className={`text-sm flex-1 ${r.active ? "" : "line-through text-muted-foreground"}`}>{r.email}</span>
                <button onClick={() => setRecipients(prev => prev.filter(x => x.id !== r.id))} className="text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="yeni@email.com" className="h-8 text-xs flex-1" onKeyDown={e => e.key === "Enter" && addRecipient()} />
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={addRecipient}>
              <Plus className="h-3.5 w-3.5" /> Ekle
            </Button>
          </div>
        </div>

        {/* Test gonder */}
        <Button className="w-full gap-2 text-sm" onClick={sendTest} disabled={testSent}>
          {testSent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
          {testSent ? "Test Gonderildi" : "Test E-postasi Gonder"}
        </Button>
      </CardContent>
    </Card>
  );
}
