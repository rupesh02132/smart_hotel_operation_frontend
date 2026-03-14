import { useEffect, useRef } from "react";

const Map = ({ listings }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 5,
      mapTypeControl: false,
      streetViewControl: false,
    });

    listings?.forEach((listing) => {
      const coords = listing?.location?.coordinates;

      if (!coords || coords.length < 2) return;

      const [lng, lat] = coords;

      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: listing.title,
      });

      /* Build room list HTML */

      const roomsHTML =
        listing.rooms?.slice(0, 3).map(
          (room) => `
          <div style="margin-bottom:8px;border-bottom:1px solid #eee;padding-bottom:5px">
            <strong>${room.roomType}</strong><br/>
            👥 ${room.guests} Guests<br/>
            💰 ₹${room.basePrice}/night<br/>
            <a href="/booking/${room._id}" 
               style="color:#059669;font-size:12px">
               Book Room
            </a>
          </div>
        `
        ).join("") || "No rooms available";

      /* Info window */

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
        <div style="width:230px;font-family:Arial">

          <img 
            src="${listing.images?.[0] || ""}" 
            style="width:100%;height:120px;object-fit:cover;border-radius:6px"
          />

          <div style="padding:10px">

            <h3 style="margin:0;font-size:15px">
              ${listing.title}
            </h3>

            <p style="font-size:12px;color:#666">
              📍 ${listing.city}, ${listing.country}
            </p>

            <div style="margin-top:10px">
              ${roomsHTML}
            </div>

            <a href="/hotel/${listing._id}/rooms" 
               style="
               display:block;
               margin-top:10px;
               font-size:12px;
               text-align:center;
               background:#059669;
               color:white;
               padding:6px;
               border-radius:6px;
               text-decoration:none">
               View All Rooms
            </a>

          </div>

        </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        map.panTo({ lat, lng });
        map.setZoom(12);
      });
    });
  }, [listings]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[600px] rounded-xl shadow-lg"
    />
  );
};

export default Map;