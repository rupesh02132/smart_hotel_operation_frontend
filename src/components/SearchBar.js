import { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Autocomplete,
  Tooltip,
  Slider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MicIcon from "@mui/icons-material/Mic";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const TRENDING_CITIES = ["Goa", "Dubai", "Paris", "London", "Bali", "New York"];

const SearchBar = ({ searchHandler }) => {
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [listening, setListening] = useState(false);

  const handleClear = () => setCity("");

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setListening(true);

    recognition.onresult = (e) => {
      setCity(e.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  const submit = (e) => {
    e.preventDefault();
    searchHandler({
      city,
      guests,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      checkIn,
      checkOut,
    });
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-500 via-cyan-400 to-sky-400 p-[2px] rounded-2xl shadow-2xl max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl p-4 space-y-4">

        {/* CITY */}
        <Autocomplete
          freeSolo
          options={TRENDING_CITIES}
          inputValue={city}
          onInputChange={(e, v) => setCity(v)}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Search city or destination..."
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-indigo-500" />
                  </InputAdornment>
                ),
                endAdornment: city && (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear} size="small">
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* DATE PICKERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DatePicker
            label="Check-in"
            value={checkIn}
            onChange={setCheckIn}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
          <DatePicker
            label="Check-out"
            value={checkOut}
            onChange={setCheckOut}
            slotProps={{ textField: { size: "small", fullWidth: true } }}
          />
        </div>

        {/* GUESTS + BUDGET */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <TextField
            type="number"
            size="small"
            label="Guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            inputProps={{ min: 1, max: 10 }}
          />

          <div>
            <label className="text-xs text-gray-500">
              Budget (₹{priceRange[0]} - ₹{priceRange[1]})
            </label>
            <Slider
              value={priceRange}
              min={0}
              max={20000}
              step={500}
              onChange={(e, v) => setPriceRange(v)}
              valueLabelDisplay="auto"
            />
          </div>

        </div>

        {/* ACTION BAR */}
        <div className="flex justify-between items-center gap-2">

          <Tooltip title="Voice Search">
            <IconButton
              onClick={startVoiceSearch}
              className={`${
                listening ? "animate-pulse text-red-500" : "text-indigo-600"
              }`}
            >
              <MicIcon />
            </IconButton>
          </Tooltip>

          <Button
            type="submit"
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={submit}
            sx={{
              borderRadius: "9999px",
              px: 4,
              py: 1.2,
              fontWeight: 600,
              background:
                "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
            }}
          >
            Search
          </Button>

        </div>

      </div>
    </div>
  );
};

export default SearchBar;
