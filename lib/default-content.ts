// Dữ liệu mặc định cho trang landing.
// Được dùng cho: (1) fallback khi CHƯA kết nối database Neon,
// và (2) dữ liệu nạp mẫu trong prisma/seed.ts.

export type SiteContent = {
  heroKicker: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  logoImage: string
  aboutHeading: string
  aboutBody: string
  contactHeading: string
  contactBody: string
  contactEmail: string
  contactPhone: string
  mapEmbedUrl: string
}

export type Location = {
  id: string
  title: string
  description: string
  content?: string
  image: string
  tag: string
  order: number
}

export type Festival = {
  id: string
  title: string
  description: string
  content?: string
  image: string
  season: string
  order: number
}

export type Food = {
  id: string
  title: string
  description: string
  image: string
  order: number
}

export type GalleryImage = {
  id: string
  image: string
  caption: string
  order: number
}

export const defaultSiteContent: SiteContent = {
  heroKicker: "Miền đất chín rồng",
  heroTitle: "Trà Vinh",
  heroSubtitle:
    "Nơi phù sa sông Hậu gặp gỡ hồn Khmer, những hàng cây cổ thụ và mùi biển mặn Ba Động.",
  heroImage: "/images/hero-tra-vinh.png",
  logoImage: "/logo.png",
  aboutHeading: "Vùng đất của cây và nước",
  aboutBody:
    "Trà Vinh nằm giữa hai dòng sông Tiền và sông Hậu, là nơi giao thoa của ba dân tộc Kinh - Khmer - Hoa. Những ngôi chùa Khmer trăm tuổi, hàng cây sao dầu cổ thụ và những vườn dừa sáp trĩu quả tạo nên một bản sắc không nơi nào có được.",
  contactHeading: "Ghé thăm Trà Vinh",
  contactBody:
    "Cách TP. Hồ Chí Minh khoảng 130km về phía Tây Nam. Thời điểm đẹp nhất để ghé thăm là vào mùa lễ Ok Om Bok (tháng 10 âm lịch).",
  contactEmail: "hello@travinh.travel",
  contactPhone: "+84 294 3862 xxx",
  mapEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=106.20%2C9.85%2C106.45%2C9.98&layer=mapnik",
}

export const defaultLocations: Location[] = [
  {
    id: "loc-1",
    title: "Ao Bà Om",
    description:
      "Hồ nước cổ hình chữ nhật được bao quanh bởi những cây sao, cây dầu hàng trăm năm tuổi với bộ rễ nổi kỳ vĩ trên mặt đất.",
    image: "/images/ao-ba-om.png",
    tag: "Danh thắng",
    order: 0,
  },
  {
    id: "loc-2",
    title: "Chùa Âng",
    description:
      "Ngôi chùa Khmer cổ nhất Trà Vinh với kiến trúc mái cong, hoa văn rắn thần Naga và sắc vàng son rực rỡ giữa rừng cây xanh.",
    image: "/images/chua-ang.png",
    tag: "Di tích",
    order: 1,
  },
  {
    id: "loc-3",
    title: "Biển Ba Động",
    description:
      "Bãi biển hoang sơ với hàng phi lao rì rào, cát vàng mịn trải dài và những cơn sóng hiền hòa của vùng cửa biển.",
    image: "/images/bien-ba-dong.png",
    tag: "Biển",
    order: 2,
  },
]

export const defaultFestivals: Festival[] = [
  {
    id: "fes-1",
    title: "Lễ hội Ok Om Bok",
    description:
      "Lễ cúng trăng của đồng bào Khmer để tạ ơn thần Mặt Trăng, cầu cho mùa màng bội thu, diễn ra vào rằm tháng 10 âm lịch.",
    image: "/images/dua-ghe-ngo.png",
    season: "Tháng 10 âm lịch",
    order: 0,
  },
  {
    id: "fes-2",
    title: "Đua ghe Ngo",
    description:
      "Cuộc đua thuyền truyền thống sôi động trên sông, những chiếc ghe Ngo dài rực rỡ cùng hàng chục tay chèo tạo nên khí thế hào hùng.",
    image: "/images/gallery-market.png",
    season: "Mùa lễ hội",
    order: 1,
  },
]

export const defaultFoods: Food[] = [
  {
    id: "food-1",
    title: "Dừa sáp Cầu Kè",
    description:
      "Đặc sản trứ danh với phần cơm dừa dày, mềm dẻo như sáp, béo ngậy - chỉ ngon nhất khi trồng trên đất Trà Vinh.",
    image: "/images/dua-sap.png",
    order: 0,
  },
  {
    id: "food-2",
    title: "Bún nước lèo",
    description:
      "Món bún đậm đà hồn Khmer với nước lèo nấu từ mắm bò hóc, tôm, thịt heo quay và rau sống miệt vườn tươi mát.",
    image: "/images/bun-nuoc-leo.png",
    order: 1,
  },
]

export const defaultGallery: GalleryImage[] = [
  { id: "gal-1", image: "/images/gallery-coconut-road.png", caption: "Đường dừa quê", order: 0 },
  { id: "gal-2", image: "/images/gallery-monks.png", caption: "Sư sãi khất thực", order: 1 },
  { id: "gal-3", image: "/images/gallery-ricefield.png", caption: "Đồng lúa bình minh", order: 2 },
  { id: "gal-4", image: "/images/gallery-market.png", caption: "Chợ nổi ven sông", order: 3 },
  { id: "gal-5", image: "/images/ao-ba-om.png", caption: "Rễ cây Ao Bà Om", order: 4 },
  { id: "gal-6", image: "/images/chua-ang.png", caption: "Mái chùa Khmer", order: 5 },
]

export type Tour = {
  id: string
  title: string
  description: string
  price: string
  duration: string
  image: string
  order: number
}

export type Product = {
  id: string
  title: string
  description: string
  price: string
  image: string
  order: number
}

export const defaultTours: Tour[] = [
  {
    id: "tour-1",
    title: "Tour Khám Phá Văn Hóa Khmer",
    description: "Tham quan Chùa Âng, Ao Bà Om và thưởng thức đặc sản địa phương.",
    price: "850.000 VNĐ",
    duration: "1 Ngày",
    image: "/images/chua-ang.png",
    order: 0,
  }
]

export const defaultProducts: Product[] = [
  {
    id: "prod-1",
    title: "Dừa Sáp Trà Vinh (Loại 1)",
    description: "Trái dừa sáp đặc ruột, béo ngậy được tuyển chọn kỹ từ nhà vườn Cầu Kè.",
    price: "150.000 VNĐ/Trái",
    image: "/images/dua-sap.png",
    order: 0,
  },
  {
    id: "prod-2",
    title: "Bánh Tét Trà Cuôn",
    description: "Bánh tét nổi tiếng với nếp dẻo, nhân thịt mỡ trứng muối đậm đà.",
    price: "90.000 VNĐ/Đòn",
    image: "/placeholder.svg", // Dùng tạm placeholder
    order: 1,
  }
]
