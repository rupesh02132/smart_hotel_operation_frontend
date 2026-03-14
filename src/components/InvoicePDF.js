import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 10 },
  row: { marginBottom: 6 },
  label: { color: "#555" },
  value: { fontWeight: "bold" },
});

const InvoicePDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      <Text style={styles.title}>Hotel Invoice</Text>

      <Text style={styles.row}>
        Booking ID: {booking._id}
      </Text>

      <Text style={styles.row}>
        Guest: {booking.user?.firstname} {booking.user?.lastname}
      </Text>

      <Text style={styles.row}>
        Room: {booking.assignedRoomNumber}
      </Text>

      <Text style={styles.row}>
        Check-in: {new Date(booking.checkIn).toDateString()}
      </Text>

      <Text style={styles.row}>
        Check-out: {new Date(booking.checkOut).toDateString()}
      </Text>

      <Text style={styles.row}>
        Payment Method: {booking.paymentMethod}
      </Text>

      <Text style={styles.row}>
        Total Amount: ₹{booking.totalPrice}
      </Text>

      <Text style={{ marginTop: 20 }}>
        Thank you for choosing our hotel.
      </Text>

    </Page>
  </Document>
);

export default InvoicePDF;
