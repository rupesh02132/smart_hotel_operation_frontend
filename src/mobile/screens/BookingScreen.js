import { useState } from "react";
import { View, Text, Button } from "react-native";
import api from "../config/api";

const BookingScreen = ({ route, navigation }) => {
  const { listingId } = route.params;
  const [price, setPrice] = useState(null);

  const fetchPrice = async () => {
    const res = await api.get(`/api/pricing?listingId=${listingId}`);
    setPrice(res.data.finalPrice);
  };

  const confirmBooking = async () => {
    const res = await api.post("/api/bookings", {
      listing: listingId,
      totalPrice: price,
      paymentMethod: "Razorpay",
    });

    navigation.navigate("QRCode", { bookingId: res.data._id });
  };

  return (
    <View>
      <Text>Dynamic Price: ₹{price}</Text>
      <Button title="Get Price" onPress={fetchPrice} />
      <Button title="Book Now" onPress={confirmBooking} />
    </View>
  );
};

export default BookingScreen;
