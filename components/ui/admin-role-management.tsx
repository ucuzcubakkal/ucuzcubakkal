"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, User, Crown, Headphones, Eye, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Role = "super_admin" | "moderator" | "destek" | "izleyici";

interface Permission { id: string; label: string; description: string; }
interface AdminUser  { id: string; name: string; email: string; role: Role; active: boolean; }

const PERMISSIONS: Permission[] = [
  { id: "users_manage",    label: "Kullanici Yonetimi",   description: "Kullanicilari goruntule, duzenle, engelle"  },
  { id: "sellers_manage",  label: "Satici Yonetimi",      description: "Satici basvurularini onayla/reddet"         },
  { id: "products_manage", label: "Urun Moderasyonu",     description: "Urunleri onayla, kaldır"                   },
  { id: "orders_manage",   label: "Siparis Yonetimi",     description: "Siparis detaylarini goruntule ve guncelle"  },
  { id: "finance_manage",  label: "Finans Yonetimi",      description: "Odeme onay ve raporlara erisim"            },
  { id: "content_manage",  label: "Icerik Yonetimi",      description: "Banner, blog, kampanya yonet"              },
  { id: "settings_manage", label: "Sistem Ayarlari",      description: "Platform ayarlarini degistir"              },
  { id: "reports_view",    label: "Rapor Goruntumleme",   description: "Tum raporlara salt okunur erisim"          },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: PERMISSIONS.map(p => p.id),
  moderator:   ["users_manage","sellers_manage","products_manage","orders_manage","reports_view"],
  destek:      ["users_manage","orders_manage","reports_view"],
  izleyici:    ["reports_view"],
};

const ROLE_CFG: Record<Role, { label: string; color: string; icon: React.ReactNode }> = {
  super_admin: { label: "Super Admin",  color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30", icon: <Crown       className="h-3.5 w-3.5"/> },
  moderator:   { label: "Moderator",   color: "bg-blue-100   text-blue-700   dark:bg-blue-900/30",   icon: <ShieldCheck className="h-3.5 w-3.5"/> },
  destek:      { label: "Destek",      color: "bg-green-100  text-green-700  dark:bg-green-900/30",  icon: <Headphones  className="h-3.5 w-3.5"/> },
  izleyici:    { label: "Izleyici",    color: "bg-slate-100  text-slate-600  dark:bg-slate-800",     icon: <Eye         className="h-3.5 w-3.5"/> },
};

const INIT_ADMINS: AdminUser[] = [
  { id:"A1", name:"Hanedan A.",  email:"hanedan@ucuzcubakkal.com", role:"super_admin", active:true  },
  { id:"A2", name:"Sercan M.",   email:"sercan@ucuzcubakkal.com",  role:"moderator",   active:true  },
  { id:"A3", name:"Lale K.",     email:"lale@ucuzcubakkal.com",    role:"destek",      active:true  },
  { id:"A4", name:"Burak T.",    email:"burak@ucuzcubakkal.com",   role:"izleyici",    active:false },
];

export function AdminRoleManagement() {
  const [admins,      setAdmins]      = useState<AdminUser[]>(INIT_ADMINS);
  const [selectedRole, setSelectedRole] = useState<Role>("moderator");
  const { toast } = useToast();

  const permissionsForRole = ROLE_PERMISSIONS[selectedRole];

  function toggleActive(id: string) {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    toast({ title: "Admin durumu guncellendi", duration: 2000 });
  }

  function changeRole(id: string, role: Role) {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, role } : a));
    toast({ title: "Rol guncellendi", duration: 2000 });
  }

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" /> Admin Rol Yonetimi
            </CardTitle>
            <CardDescription className="text-xs">Farkli yetki seviyeleri ve erisim kontrol paneli</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Yeni Admin
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Admin kullanicilari */}
        <div className="space-y-2">
          {admins.map(admin => (
            <div key={admin.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/20 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {admin.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{admin.name}</p>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              </div>
              <select
                value={admin.role}
                onChange={e => changeRole(admin.id, e.target.value as Role)}
                disabled={admin.id === "A1"}
                className="text-xs border border-border rounded-lg px-2 py-1 bg-background disabled:opacity-50"
              >
                {(Object.keys(ROLE_CFG) as Role[]).map(r => (
                  <option key={r} value={r}>{ROLE_CFG[r].label}</option>
                ))}
              </select>
              <Switch checked={admin.active} onCheckedChange={() => toggleActive(admin.id)} disabled={admin.id === "A1"} />
              {admin.id !== "A1" && (
                <button onClick={() => { setAdmins(prev => prev.filter(a => a.id !== admin.id)); toast({ title: "Admin kaldirildi", duration: 2000 }); }}
                  className="text-red-500 hover:text-red-600 transition-colors flex-shrink-0">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Rol izinleri */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Rol Izinleri</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {(Object.keys(ROLE_CFG) as Role[]).map(r => (
              <button key={r} onClick={() => setSelectedRole(r)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                  ${selectedRole === r ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                {ROLE_CFG[r].icon}
                {ROLE_CFG[r].label}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {PERMISSIONS.map(p => {
              const has = permissionsForRole.includes(p.id);
              return (
                <div key={p.id} className={`flex items-start gap-2 p-2.5 rounded-lg border text-xs ${has ? "border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-900" : "border-border bg-muted/20 opacity-60"}`}>
                  <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${has ? "bg-green-500" : "bg-muted-foreground"}`}>
                    {has ? <User className="h-2.5 w-2.5 text-white"/> : <span className="text-white text-[8px]">-</span>}
                  </div>
                  <div>
                    <p className="font-semibold">{p.label}</p>
                    <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
