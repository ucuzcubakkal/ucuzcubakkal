"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Clock, AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";

type Priority = "dusuk" | "orta" | "yuksek";
type TaskStatus = "bekliyor" | "devam_ediyor" | "tamamlandi";

interface AdminTask {
  id: string; title: string; assignee: string; priority: Priority;
  status: TaskStatus; due: string; note?: string;
}

const INIT_TASKS: AdminTask[] = [
  { id: "T1", title: "Gecen hafta iade taleplerini incele",    assignee: "hanedan",  priority: "yuksek", status: "bekliyor",       due: "Bugün"       },
  { id: "T2", title: "Yeni satici basvurularini onayla",       assignee: "moderator",priority: "yuksek", status: "devam_ediyor",    due: "Bugun"       },
  { id: "T3", title: "Haftalik gelir raporunu hazirla",        assignee: "hanedan",  priority: "orta",   status: "bekliyor",        due: "Yarin"       },
  { id: "T4", title: "Sahte yorum sirdlarini gozden gecir",    assignee: "hanedan",  priority: "orta",   status: "bekliyor",        due: "2 gun sonra" },
  { id: "T5", title: "Ana sayfa banner'ı guncelle",            assignee: "moderator",priority: "dusuk",  status: "tamamlandi",      due: "Dun"         },
  { id: "T6", title: "Pi Network API entegrasyon testi",       assignee: "dev",      priority: "yuksek", status: "devam_ediyor",    due: "3 gun sonra" },
];

const PRIORITY_BADGE: Record<Priority, string> = {
  yuksek: "bg-red-100 text-red-700",
  orta:   "bg-amber-100 text-amber-700",
  dusuk:  "bg-blue-100 text-blue-700",
};

const STATUS_BADGE: Record<TaskStatus, string> = {
  bekliyor:       "bg-muted text-muted-foreground",
  devam_ediyor:   "bg-blue-100 text-blue-700",
  tamamlandi:     "bg-green-100 text-green-700",
};

export function AdminTaskManager() {
  const { toast } = useToast();
  const [tasks,   setTasks]   = useState<AdminTask[]>(INIT_TASKS);
  const [adding,  setAdding]  = useState(false);
  const [filter,  setFilter]  = useState<TaskStatus | "hepsi">("hepsi");
  const [newTask, setNewTask] = useState<Partial<AdminTask>>({ priority: "orta", assignee: "hanedan" });

  const filtered = filter === "hepsi" ? tasks : tasks.filter(t => t.status === filter);

  const toggleStatus = (id: string) =>
    setTasks(prev => prev.map(t => t.id === id ? {
      ...t,
      status: t.status === "tamamlandi" ? "bekliyor" : t.status === "bekliyor" ? "devam_ediyor" : "tamamlandi"
    } : t));

  const del = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({ title: "Gorev silindi." });
  };

  const save = () => {
    if (!newTask.title) return;
    setTasks(prev => [...prev, { ...newTask, id: `T${Date.now()}`, status: "bekliyor", due: newTask.due ?? "Belirsiz" } as AdminTask]);
    setAdding(false);
    setNewTask({ priority: "orta", assignee: "hanedan" });
    toast({ title: "Gorev eklendi." });
  };

  const counts = {
    bekliyor:     tasks.filter(t => t.status === "bekliyor").length,
    devam_ediyor: tasks.filter(t => t.status === "devam_ediyor").length,
    tamamlandi:   tasks.filter(t => t.status === "tamamlandi").length,
  };

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-primary" />Admin Gorev Yoneticisi
            </CardTitle>
            <CardDescription className="text-xs">Adminler arasi gorev atama ve takip</CardDescription>
          </div>
          <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setAdding(a => !a)}>
            <Plus className="h-3.5 w-3.5" />Gorev Ekle
          </Button>
        </div>
        {/* Ozet */}
        <div className="flex gap-2 mt-2">
          {([["hepsi", "Hepsi", tasks.length, "bg-muted text-muted-foreground"],
            ["bekliyor", "Bekliyor", counts.bekliyor, "bg-red-100 text-red-700"],
            ["devam_ediyor", "Devam", counts.devam_ediyor, "bg-blue-100 text-blue-700"],
            ["tamamlandi", "Tamam", counts.tamamlandi, "bg-green-100 text-green-700"],
          ] as const).map(([val, label, count, cls]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${filter === val ? "ring-2 ring-primary/50 " + cls : "border-border hover:bg-muted"}`}>
              {label} <span className="font-bold ml-0.5">{count}</span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Yeni gorev formu */}
        {adding && (
          <div className="border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3 mb-3">
            <p className="text-xs font-semibold text-primary">Yeni Gorev</p>
            <Input className="h-8 text-sm" placeholder="Gorev basligini yaz..." value={newTask.title ?? ""} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} />
            <div className="grid grid-cols-3 gap-2">
              <Select value={newTask.assignee} onValueChange={v => setNewTask(n => ({ ...n, assignee: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["hanedan","moderator","dev","support"].map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={newTask.priority} onValueChange={v => setNewTask(n => ({ ...n, priority: v as Priority }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yuksek">Yuksek</SelectItem>
                  <SelectItem value="orta">Orta</SelectItem>
                  <SelectItem value="dusuk">Dusuk</SelectItem>
                </SelectContent>
              </Select>
              <Input className="h-8 text-xs" placeholder="Son tarih..." value={newTask.due ?? ""} onChange={e => setNewTask(n => ({ ...n, due: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => setAdding(false)}>Iptal</Button>
              <Button size="sm" className="text-xs h-8" onClick={save}>Kaydet</Button>
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Bu kategoride gorev yok.</p>
          </div>
        )}

        {filtered.map(t => (
          <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors hover:bg-muted/10 ${t.status === "tamamlandi" ? "opacity-60" : ""}`}>
            <Checkbox
              checked={t.status === "tamamlandi"}
              onCheckedChange={() => toggleStatus(t.id)}
              className="flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${t.status === "tamamlandi" ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="text-xs text-muted-foreground">@{t.assignee}</span>
                <span className="text-muted-foreground">·</span>
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t.due}</span>
              </div>
            </div>
            <Badge className={`text-xs flex-shrink-0 ${PRIORITY_BADGE[t.priority]}`}>{t.priority}</Badge>
            <Badge className={`text-xs flex-shrink-0 hidden sm:flex ${STATUS_BADGE[t.status]}`}>{t.status.replace("_", " ")}</Badge>
            <button onClick={() => del(t.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
