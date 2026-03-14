// src/screens/user/MyListings.js
import { Table, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Message from "../components/Message";

const MyListings = ({ listings }) => {
  const list = listings?.listing || [];

  return (
    <div className="rounded-3xl bg-white shadow-lg p-4 p-md-5">

      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">My Listings</h3>
          <p className="text-muted mb-0">
            Manage your hotel rooms, pricing, and availability
          </p>
        </div>

        <Button
          as={Link}
          to="/host/listings/new"
          variant="primary"
          className="mt-3 mt-md-0 px-4"
        >
          + Create New Listing
        </Button>
      </div>

      {/* EMPTY STATE */}
      {list.length === 0 ? (
        <Message variant="info">
          You haven’t created any listings yet.
        </Message>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Room</th>
                <th>Location</th>
                <th>Category</th>
                <th>Pricing</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((listing) => (
                <tr key={listing._id}>

                  {/* ROOM */}
                  <td>
                    <div className="fw-semibold">{listing.title}</div>
                    <div className="text-muted small">
                      Room {listing.roomNumber} · Floor {listing.floor || "-"}
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td>
                    <div>{listing.city}</div>
                    <div className="text-muted small">
                      {listing.country}
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td>
                    <Badge bg="info" className="text-uppercase">
                      {listing.category}
                    </Badge>
                  </td>

                  {/* PRICING */}
                  <td>
                    <div className="fw-semibold">
                      ₹{listing.price}
                      <span className="text-muted small"> / night</span>
                    </div>
                    {listing.basePrice && (
                      <div className="text-muted small">
                        Base: ₹{listing.basePrice}
                      </div>
                    )}
                  </td>

                  {/* STATUS */}
                  <td>
                    <Badge
                      bg={
                        listing.status === "Vacant"
                          ? "success"
                          : listing.status === "Occupied"
                          ? "danger"
                          : "warning"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </td>

                  {/* AVAILABILITY */}
                  <td>
                    <Badge bg={listing.isAvailable ? "success" : "secondary"}>
                      {listing.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </td>

                  {/* CREATED */}
                  <td className="text-muted small">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">

                      <Button
                        as={Link}
                        to={`/listing/${listing._id}`}
                        size="sm"
                        variant="outline-primary"
                        title="View"
                      >
                        <FaEye />
                      </Button>

                      <Button
                        as={Link}
                        to={`/host/listings/${listing._id}/edit`}
                        size="sm"
                        variant="outline-warning"
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        title="Delete"
                        // onClick={() => deleteHandler(listing._id)}
                      >
                        <FaTrash />
                      </Button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyListings;
