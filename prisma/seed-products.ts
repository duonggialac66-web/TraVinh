import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

const traVinhProducts = [
  {
    title: "Dừa sáp Cầu Kè",
    description: "Đặc sản nổi tiếng nhất Trà Vinh, cơm dừa dẻo sáp béo ngậy, thơm lừng. Giống dừa quý hiếm chỉ có ở huyện Cầu Kè, Trà Vinh. Thích hợp ăn trực tiếp hoặc làm sinh tố, kem dừa sáp.",
    price: "120.000đ",
    image: "https://images.unsplash.com/photo-1580984969071-a8da8060da06?w=800&q=80",
    order: 1,
  },
  {
    title: "Mứt dừa sáp cuộn",
    description: "Mứt được làm từ cơm dừa sáp nguyên chất, cuộn thành từng thanh nhỏ, dẻo dai, ngọt thanh. Sản phẩm thủ công truyền thống, quà biếu ý nghĩa từ Trà Vinh.",
    price: "85.000đ",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&q=80",
    order: 2,
  },
  {
    title: "Kẹo dừa Trà Vinh",
    description: "Kẹo dừa mềm dẻo, thơm béo vị nước cốt dừa tươi. Được sản xuất theo phương pháp truyền thống với nhiều hương vị: sầu riêng, đậu phộng, lá dứa, sô cô la.",
    price: "45.000đ",
    image: "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=800&q=80",
    order: 3,
  },
  {
    title: "Bánh tét lá cẩm",
    description: "Bánh tét truyền thống nhuộm màu tím tự nhiên từ lá cẩm, nhân đậu xanh thịt heo. Nét đẹp ẩm thực ngày Tết của người dân Trà Vinh, dẻo thơm đặc biệt.",
    price: "70.000đ",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80",
    order: 4,
  },
  {
    title: "Bún nước lèo khô",
    description: "Gói gia vị nấu bún nước lèo chuẩn vị Trà Vinh, gồm mắm bò hóc, sả, ớt và các loại gia vị đặc trưng. Chỉ cần thêm nước là có tô bún nước lèo đậm đà ngay tại nhà.",
    price: "55.000đ",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80",
    order: 5,
  },
  {
    title: "Mắm bò hóc Khmer",
    description: "Loại mắm cá lên men đặc trưng của người Khmer Trà Vinh, được ủ từ cá đồng tự nhiên theo công thức cổ truyền. Dùng nấu canh, lẩu, bún nước lèo tuyệt ngon.",
    price: "65.000đ",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80",
    order: 6,
  },
  {
    title: "Rượu dừa sáp Cầu Kè",
    description: "Rượu lên men tự nhiên từ nước và cơm dừa sáp, nồng độ nhẹ, thơm ngọt. Đặc sản quà tặng cao cấp Trà Vinh, đóng chai dừa nguyên trái rất đẹp mắt.",
    price: "180.000đ",
    image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    order: 7,
  },
  {
    title: "Dầu dừa nguyên chất",
    description: "Dầu dừa ép lạnh từ dừa Trà Vinh, giữ nguyên dưỡng chất tự nhiên. Sử dụng trong nấu ăn, chăm sóc da và tóc. Sản phẩm hữu cơ, không chất bảo quản.",
    price: "95.000đ",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&q=80",
    order: 8,
  },
  {
    title: "Cốm dẹp Khmer",
    description: "Cốm dẹp giã tay từ nếp mới, đặc sản quan trọng trong lễ Ok Om Bok của người Khmer. Ăn kèm dừa nạo, đường thốt nốt, vừa dẻo vừa thơm hương lúa mới.",
    price: "50.000đ",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
    order: 9,
  },
  {
    title: "Đường thốt nốt",
    description: "Đường nấu từ nước thốt nốt tươi, màu nâu cánh gián, vị ngọt thanh tự nhiên. Dùng nấu chè, làm bánh hoặc pha nước uống giải khát, tốt cho sức khỏe.",
    price: "60.000đ",
    image: "https://images.unsplash.com/photo-1604431696980-07e518647bec?w=800&q=80",
    order: 10,
  },
  {
    title: "Bánh canh Bến Có",
    description: "Gói bánh canh bột gạo tươi nổi tiếng từ xã Bến Có, sợi dai mềm. Ăn kèm nước lèo hầm xương heo, tôm tươi. Gói kèm gia vị pha chế sẵn tiện lợi.",
    price: "40.000đ",
    image: "https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=800&q=80",
    order: 11,
  },
  {
    title: "Trà mãng cầu",
    description: "Trà túi lọc từ lá mãng cầu xiêm Trà Vinh phơi khô tự nhiên, hỗ trợ ngủ ngon, thanh lọc cơ thể. Sản phẩm thảo dược thuần tự nhiên, không phụ gia.",
    price: "35.000đ",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    order: 12,
  },
  {
    title: "Khô cá lóc đồng",
    description: "Cá lóc đồng tươi xẻ phơi nắng tự nhiên, thịt chắc, vị ngọt thanh. Đặc sản miền Tây dùng nướng mỡ hành, chiên giòn hoặc kho tộ đều tuyệt vời.",
    price: "150.000đ",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80",
    order: 13,
  },
  {
    title: "Nước màu dừa",
    description: "Nước màu (nước hàng) nấu từ nước cốt dừa tươi và đường thốt nốt, tạo màu nâu đẹp cho các món kho. Đặc trưng ẩm thực miền Tây sông nước.",
    price: "30.000đ",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    order: 14,
  },
  {
    title: "Bánh tráng dừa nướng",
    description: "Bánh tráng rắc dừa nạo, hành lá, tôm khô nướng giòn trên bếp than. Ăn vặt dân dã nổi tiếng Trà Vinh, giòn rụm thơm lừng, đóng gói giữ giòn lâu.",
    price: "25.000đ",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80",
    order: 15,
  },
  {
    title: "Mật ong hoa dừa",
    description: "Mật ong nguyên chất từ vùng dừa Trà Vinh, ong hút mật hoa dừa tự nhiên. Vị ngọt dịu đặc trưng, giàu khoáng chất. Dùng pha nước chanh, trộn salad, làm đẹp.",
    price: "140.000đ",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
    order: 16,
  },
  {
    title: "Tinh dầu sả Trà Vinh",
    description: "Tinh dầu sả chanh chiết xuất nguyên chất, xông phòng chống muỗi, thư giãn tinh thần. Sản phẩm thảo dược địa phương, an toàn cho trẻ nhỏ và phụ nữ mang thai.",
    price: "75.000đ",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&q=80",
    order: 17,
  },
  {
    title: "Combo quà Trà Vinh",
    description: "Hộp quà tặng gồm: kẹo dừa, mứt dừa sáp, đường thốt nốt và trà mãng cầu. Đóng hộp sang trọng, lý tưởng làm quà biếu sau chuyến du lịch Trà Vinh.",
    price: "250.000đ",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238f760?w=800&q=80",
    order: 18,
  },
  {
    title: "Xà bông dừa handmade",
    description: "Xà bông thủ công từ dầu dừa nguyên chất Trà Vinh, thêm tinh dầu tràm trà và bột nghệ. Dưỡng da mềm mịn, kháng khuẩn tự nhiên, thân thiện môi trường.",
    price: "55.000đ",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&q=80",
    order: 19,
  },
  {
    title: "Nước cốt dừa tươi đóng lon",
    description: "Nước cốt dừa tươi ép từ dừa xiêm Trà Vinh, đóng lon tiện lợi, giữ nguyên hương vị tự nhiên. Dùng nấu chè, cà ri, làm bánh hoặc uống trực tiếp giải khát.",
    price: "28.000đ",
    image: "https://images.unsplash.com/photo-1525385133512-2f3bdd39f781?w=800&q=80",
    order: 20,
  },
]

async function main() {
  console.log("🌴 Đang thêm 20 sản phẩm đặc trưng Trà Vinh vào database...")

  let count = 0
  for (const product of traVinhProducts) {
    await prisma.product.create({ data: product })
    count++
    console.log(`  ✅ [${count}/20] ${product.title}`)
  }

  console.log(`\n🎉 Hoàn tất! Đã thêm ${count} sản phẩm vào database.`)
}

main()
  .catch((e) => {
    console.error("❌ Lỗi:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
