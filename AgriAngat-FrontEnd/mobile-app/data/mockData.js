// Mock data for the application

export const NEARBY_STORES = [
  {
    id: 1,
    name: "Aling Myrna Sari-sari store",
    distance: "2.5 km",
    needs: "100 kg Rice, 20 kg Tomatoes",
    image: require("../assets/images/myrna.png")
  },
  {
    id: 2,
    name: "Kimilovie Store",
    distance: "1 km",
    needs: "50 kg Corn, 20 kg Onions",
    image: require("../assets/images/kimilovie.png")
  },
  {
    id: 3,
    name: "Neyni Store",
    distance: "1 km",
    needs: "50 cabbages, 10 kg Carrots",
    image: require("../assets/images/neyni-store.jpg")
  },
  {
    id: 4,
    name: "Cris Talipapa",
    distance: "0.5 km",
    needs: "10 boxes Eggs, 20 kg Onions, 10 kg Carrots",
    image: require("../assets/images/cris-talipapa.jpg")
  },
  {
    id: 5,
    name: "K Mini Mart",
    distance: "0.5 km",
    needs: "100 kg Rice, 100 kg Banana, 50 kg Carrots",
    image: require("../assets/images/k mini mart.png")
  }
];

export const USER_LISTINGS = {
  active: [
    {
      id: 1,
      name: "Saging",
      price: "P50",
      status: "Available",
      image: require("../assets/images/banana.png"),
      description: "Fresh bananas from our farm"
    },
    {
      id: 2,
      name: "Mangga",
      price: "P80",
      status: "Available", 
      image: require("../assets/images/mango.png"),
      description: "Sweet ripe mangoes"
    },
    {
      id: 3,
      name: "Orange",
      price: "P60",
      status: "Available",
      image: require("../assets/images/oranges.png"),
      description: "Juicy oranges"
    }
  ],
  sold: [],
  expired: []
};
