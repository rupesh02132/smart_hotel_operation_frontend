const InvoiceButton = ({ bookingId }) => {
  const downloadInvoice = () => {
    window.open(`/api/invoice/${bookingId}`, "_blank");
  };

  return (
    <button
      onClick={downloadInvoice}
      className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
    >
      Download Invoice PDF
    </button>
  );
};

export default InvoiceButton;
