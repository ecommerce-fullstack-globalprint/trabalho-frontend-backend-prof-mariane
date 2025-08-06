// Dados compartilhados das artes de camisas

export const camisaImages = [
  "camisa-1.jpeg",
  "camisa-2.jpeg",
  "camisa-3.jpeg",
  "camisa-4.jpeg",
  "camisa-5.jpeg",
  "camisa-6.jpeg",
  "camisa-7.jpeg",
  "camisa-8.jpeg",
  "camisa-9.jpeg",
  "camisa-10.jpeg",
  "camisa-11.jpeg",
  "camisa-12.jpeg",
  "camisa-13.jpeg",
  "camisa-14.jpeg",
];

export const realArts = camisaImages.map((img, idx) => ({
  id: idx + 1,
  title: `Arte Camisa ${idx + 1}`,
  price: 19.9,
  category: "Camisas",
  type: "Pronto",
  rating: 5.0,
  downloads: 0,
  image: `/artes_camisas/${img}`,
}));
