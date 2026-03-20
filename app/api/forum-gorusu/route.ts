// Forum görüşlerini in-memory store'a kaydeder.
// Admin paneli GET ile okur, müşteri/satıcı paneli POST ile gönderir.

export type ForumMessage = {
  id: string;
  from: "musteri" | "satici";
  userName: string;
  userId: string;
  subject: string;
  message: string;
  category: "oneri" | "sikayet" | "tesekkur" | "diger";
  createdAt: string;
  read: boolean;
};

// Sunucu tarafında paylaşılan basit in-memory store
// (production'da veritabanına taşınmalıdır)
const store: ForumMessage[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const msg: ForumMessage = {
      id: `FRM-${Date.now()}`,
      from: body.from ?? "musteri",
      userName: body.userName ?? "Anonim",
      userId: body.userId ?? "",
      subject: (body.subject ?? "").slice(0, 120),
      message: (body.message ?? "").slice(0, 2000),
      category: body.category ?? "diger",
      createdAt: new Date().toISOString(),
      read: false,
    };
    store.push(msg);
    return Response.json({ success: true, id: msg.id }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: "Geçersiz istek" }, { status: 400 });
  }
}

export async function GET() {
  return Response.json(store.slice().reverse());
}
