// Mock data for the application

export const NEARBY_STORES = [
  {
    id: 1,
    name: "Aling Myrna Sari-sari store",
    distance: "2.5 km",
    needs: "100 kg Rice, 20 kg Tomatoes",
    image: require("../assets/images/myrna.png"),
    phone: "+63 912 345 6789",
    address: "123 Main Street, Cabanatuan City",
    ownerName: "Myrna Santos",
    businessHours: "7:00 AM - 9:00 PM",
    landmarks: "Near Central School",
    coordinates: {
      latitude: 15.4859,
      longitude: 120.9670
    }
  },
  {
    id: 2,
    name: "Kimilovie Store",
    distance: "1 km",
    needs: "50 kg Corn, 20 kg Onions",
    image: require("../assets/images/kimilovie.png"),
    phone: "+63 917 123 4567",
    address: "456 Maharlika Highway, Cabanatuan City",
    ownerName: "Kim Santos",
    businessHours: "6:00 AM - 8:00 PM",
    landmarks: "Beside Mercury Drug",
    coordinates: {
      latitude: 15.4900,
      longitude: 120.9720
    }
  },
  {
    id: 3,
    name: "Neyni Store",
    distance: "1 km",
    needs: "50 cabbages, 10 kg Carrots",
    image: require("../assets/images/neyni-store.jpg"),
    phone: "+63 918 765 4321",
    address: "789 Liberty Street, Cabanatuan City",
    ownerName: "Neil Garcia",
    businessHours: "8:00 AM - 7:00 PM",
    landmarks: "Near Public Market",
    coordinates: {
      latitude: 15.4820,
      longitude: 120.9650
    }
  },
  {
    id: 4,
    name: "Cris Talipapa",
    distance: "0.5 km",
    needs: "10 boxes Eggs, 20 kg Onions, 10 kg Carrots",
    image: require("../assets/images/cris-talipapa.jpg"),
    phone: "+63 919 999 8888",
    address: "321 Freedom Road, Cabanatuan City",
    ownerName: "Cristina Reyes",
    businessHours: "5:00 AM - 6:00 PM",
    landmarks: "Corner of Freedom and Liberty",
    coordinates: {
      latitude: 15.4880,
      longitude: 120.9680
    }
  },
  {
    id: 5,
    name: "K Mini Mart",
    distance: "0.5 km",
    needs: "100 kg Rice, 100 kg Banana, 50 kg Carrots",
    image: require("../assets/images/k mini mart.png"),
    phone: "+63 915 777 6666",
    address: "567 Progress Street, Cabanatuan City",
    ownerName: "Karen Cruz",
    businessHours: "7:00 AM - 10:00 PM",
    landmarks: "Across from the Church",
    coordinates: {
      latitude: 15.4840,
      longitude: 120.9690
    }
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