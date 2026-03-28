import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#f3f4f6",
  },

  /* ===== HEADER ===== */
  header: {
    backgroundColor: "#0f172a",
    color: "white",
    padding: 25,
  },

  hotelName: {
    fontSize: 26,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 11,
    marginTop: 4,
    color: "#eab308",
  },

  container: {
    padding: 25,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1 solid #e5e7eb",
  },

  label: {
    color: "#6b7280",
  },

  value: {
    fontWeight: "bold",
    color: "#111827",
  },

  /* ===== TOTAL ===== */
  totalCard: {
    backgroundColor: "#16a34a",
    color: "white",
    padding: 18,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },

  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 10,
    color: "#6b7280",
  },
});

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString() : "-";

const InvoicePDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* ⭐ HEADER */}
      <View style={styles.header}>
        <Text style={styles.hotelName}>Smart Hotel</Text>
        <Text style={styles.subtitle}>
          Luxury Stay Experience • www.smarthotel.com
        </Text>
      </View>

      <View style={styles.container}>

        {/* ⭐ BOOKING CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Booking Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.value}>{booking._id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Guest</Text>
            <Text style={styles.value}>
              {booking.user?.firstname} {booking.user?.lastname}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Room</Text>
            <Text style={styles.value}>
              {booking.roomNumber}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>
              {formatDate(booking.checkIn)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>
              {formatDate(booking.checkOut)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>
              {booking.paymentMethod}
            </Text>
          </View>
        </View>

        {/* ⭐ TOTAL */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>
            Total Amount
          </Text>

          <Text style={styles.totalValue}>
            ₹ {booking.totalPrice}
          </Text>
        </View>

        {/* ⭐ FOOTER */}
        <Text style={styles.footer}>
          Thank you for choosing Smart Hotel Platform.
          We hope you enjoy your stay.
        </Text>

      </View>

    </Page>
  </Document>
);

export default InvoicePDF;