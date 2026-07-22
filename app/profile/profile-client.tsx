"use client";

import { useState, useRef } from "react";
import { updateUserProfile } from "@/app/actions/user";
import { User, Package, MapPin, CheckCircle2, Clock, Truck, XCircle, Camera, Edit2, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

type ProfileClientProps = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    hasPassword: boolean;
  };
  productOrders: any[];
  tourBookings: any[];
};

export default function ProfileClient({ user: initialUser, productOrders, tourBookings }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "tours">("profile");
  const [user, setUser] = useState(initialUser);
  const { update } = useSession();

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-4">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 shrink-0">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-primary/5 overflow-hidden sticky top-28 shadow-xl shadow-black/[0.02]">
          
          <div className="p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-0" />
            <div className="relative z-10">
              <div className="size-28 mx-auto mb-5 rounded-full ring-4 ring-white shadow-lg overflow-hidden relative group bg-white flex items-center justify-center">
                {user.image ? (
                  <Image src={user.image} alt={user.name || "Avatar"} fill className="object-cover" />
                ) : (
                  <User className="size-12 text-primary/40" />
                )}
              </div>
              <h2 className="font-serif font-bold text-2xl text-foreground mb-1">{user.name || "Người dùng"}</h2>
              <p className="text-sm font-medium text-foreground/50">{user.email}</p>
            </div>
          </div>
          
          <div className="p-4 flex flex-col gap-2">
            <TabButton 
              active={activeTab === "profile"} 
              onClick={() => setActiveTab("profile")}
              icon={<Edit2 size={18} />}
              label="Chỉnh sửa hồ sơ"
            />
            <TabButton 
              active={activeTab === "orders"} 
              onClick={() => setActiveTab("orders")}
              icon={<Package size={18} />}
              label="Đơn hàng của tôi"
              badge={productOrders.length}
            />
            <TabButton 
              active={activeTab === "tours"} 
              onClick={() => setActiveTab("tours")}
              icon={<MapPin size={18} />}
              label="Tour đã đặt"
              badge={tourBookings.length}
            />
            <div className="h-px bg-border/50 my-2" />
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-semibold text-red-500/80 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0">
        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProfileForm user={user} onUpdate={(updated) => setUser({ ...user, ...updated })} updateSession={update} />
            </motion.div>
          )}
          
          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <OrdersList orders={productOrders} />
            </motion.div>
          )}

          {activeTab === "tours" && (
            <motion.div
              key="tours"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <ToursList tours={tourBookings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, badge }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, badge?: number }) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 text-sm font-semibold ${
        active 
          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
          : "text-foreground/60 hover:bg-black/5 hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      <div className="flex items-center gap-2">
        {badge !== undefined && badge > 0 && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-white/20 text-white" : "bg-black/5 text-foreground/50"}`}>
            {badge}
          </span>
        )}
        <ChevronRight className={`size-4 transition-transform ${active ? "translate-x-1" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
      </div>
    </button>
  );
}

function ProfileForm({ user, onUpdate, updateSession }: { user: ProfileClientProps["user"], onUpdate: (data: any) => void, updateSession: () => Promise<any> }) {
  const [name, setName] = useState(user.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Kích thước ảnh tối đa là 2MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const payload: any = { name };
    if (previewImage) {
      payload.image = previewImage;
    }
    if (currentPassword && newPassword) {
      payload.password = currentPassword;
      payload.newPassword = newPassword;
    }

    const res = await updateUserProfile(payload);

    if (res.success) {
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
      setCurrentPassword("");
      setNewPassword("");
      onUpdate({ name, image: previewImage || user.image });
      // Cập nhật lại session của NextAuth để Navbar hiển thị ảnh mới ngay lập tức
      await updateSession();
    } else {
      setMessage({ type: "error", text: res.error || "Có lỗi xảy ra" });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-primary/5 p-8 shadow-xl shadow-black/[0.02]">
      <h3 className="text-2xl font-serif font-bold text-foreground mb-8">Thông tin cá nhân</h3>
      
      {message.text && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-2xl mb-8 text-sm font-medium flex items-center gap-2 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
          {message.type === "success" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Avatar Upload */}
        <div className="flex items-center gap-6 pb-8 border-b border-border/50">
          <div className="relative group">
            <div className="size-24 rounded-full overflow-hidden bg-muted flex items-center justify-center ring-4 ring-primary/5">
              {(previewImage || user.image) ? (
                <Image src={previewImage || user.image!} alt="Avatar" fill className="object-cover" />
              ) : (
                <User className="size-10 text-primary/40" />
              )}
            </div>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Camera size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange}
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Ảnh đại diện</h4>
            <p className="text-sm text-foreground/50">Định dạng PNG, JPG (Tối đa 2MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Địa chỉ Email</label>
            <input 
              type="email" 
              value={user.email || ""} 
              disabled 
              className="w-full px-5 py-3.5 rounded-2xl border border-primary/10 bg-black/5 text-foreground/60 font-medium cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground/80">Họ và tên</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-primary/20 bg-white font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-foreground/30"
              placeholder="Nhập họ và tên..."
            />
          </div>
        </div>

        {user.hasPassword && (
          <div className="pt-8 border-t border-border/50">
            <h4 className="font-serif font-bold text-lg text-foreground mb-6">Đổi mật khẩu</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Mật khẩu hiện tại</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-primary/20 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-foreground/30"
                  placeholder="Nhập mật khẩu cũ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Mật khẩu mới</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-2xl border border-primary/20 bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-foreground/30"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-2xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "PENDING":
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-wide"><Clock size={12} /> Chờ xử lý</span>;
    case "PROCESSING":
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide"><Package size={12} /> Đang chuẩn bị</span>;
    case "SHIPPED":
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wide"><Truck size={12} /> Đang giao</span>;
    case "DELIVERED":
    case "COMPLETED":
    case "CONFIRMED":
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide"><CheckCircle2 size={12} /> Hoàn thành</span>;
    case "CANCELLED":
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide"><XCircle size={12} /> Đã hủy</span>;
    default:
      return <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wide">{status}</span>;
  }
}

function OrdersList({ orders }: { orders: any[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-xl shadow-black/[0.02]">
        <div className="size-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="size-10 text-foreground/30" />
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">Chưa có đơn hàng nào</h3>
        <p className="text-foreground/50 font-medium">Khám phá các đặc sản Trà Vinh và đặt mua ngay!</p>
        <a href="/#products" className="inline-block mt-6 px-6 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors">
          Mua sắm ngay
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Lịch sử đơn hàng</h3>
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-3xl border border-primary/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
          <div className="bg-black/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-foreground/50 mb-1">Đơn hàng #{order.id.slice(-8)}</p>
              <p className="text-sm font-medium text-foreground/80">Đặt ngày: {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    <div className="size-14 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
                      <Package className="size-6 text-primary/60" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.productName}</p>
                      <p className="text-sm font-medium text-foreground/50">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="font-bold text-foreground">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex justify-between items-end">
              <span className="font-semibold text-foreground/60 uppercase text-xs tracking-widest">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-primary">{order.totalAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ToursList({ tours }: { tours: any[] }) {
  if (tours.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-primary/5 p-16 text-center shadow-xl shadow-black/[0.02]">
        <div className="size-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="size-10 text-foreground/30" />
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">Chưa có chuyến đi nào</h3>
        <p className="text-foreground/50 font-medium">Khám phá các điểm đến tại Trà Vinh ngay hôm nay!</p>
        <a href="/#tours" className="inline-block mt-6 px-6 py-3 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors">
          Xem các Tour
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif font-bold text-foreground mb-6">Tour đã đặt</h3>
      {tours.map((tour) => (
        <div key={tour.id} className="bg-white rounded-3xl border border-primary/5 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/[0.03] transition-all duration-300">
          <div className="bg-primary/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/60 mb-1">Mã đặt chỗ #{tour.id.slice(-8)}</p>
              <p className="text-sm font-medium text-foreground/80">Đặt ngày: {new Date(tour.createdAt).toLocaleDateString("vi-VN")}</p>
            </div>
            <div>
              {getStatusBadge(tour.status)}
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="size-24 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                <MapPin className="size-10 text-primary/60" />
              </div>
              <div className="flex-1">
                <h4 className="font-serif font-bold text-xl text-foreground leading-tight mb-3">{tour.tourName}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 rounded-xl p-3">
                    <p className="text-xs text-foreground/50 font-semibold uppercase mb-1">Khởi hành</p>
                    <p className="font-bold text-foreground">{tour.tourDate}</p>
                  </div>
                  <div className="bg-black/5 rounded-xl p-3">
                    <p className="text-xs text-foreground/50 font-semibold uppercase mb-1">Số khách</p>
                    <p className="font-bold text-foreground">{tour.participants} người</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border flex justify-between items-end">
              <span className="font-semibold text-foreground/60 uppercase text-xs tracking-widest">Tổng chi phí</span>
              <span className="text-2xl font-bold text-primary">{tour.totalAmount.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
