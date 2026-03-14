import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReview, getAllReviews } from "../state/review/Action";
import {
  TextField,
  Button,
  Typography,
  Box,
  Rating,
  Alert,
  CircularProgress,
  Paper,
  Slide,
  Fade,
} from "@mui/material";

const ReviewForm = ({ listingId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [animateStars, setAnimateStars] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state || {});

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === "") {
      alert("Please provide a rating and comment.");
      return;
    }

    try {
      await dispatch(createReview({ listingId, review: rating, comment }));
      dispatch(getAllReviews());
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Review creation failed:", error);
    }
  };

  return (
    <Fade in={fadeIn} timeout={800}>
      <Paper
        elevation={0}
        className="relative mt-10 rounded-[2rem] p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_30px_80px_rgba(99,102,241,0.4)]"
      >
        {/* Inner Glass Card */}
        <div className="rounded-[2rem] bg-black/70 backdrop-blur-2xl p-8 sm:p-10 text-white space-y-6">

          {/* Title */}
          <Typography
            variant="h5"
            className="font-extrabold tracking-wide bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent"
          >
            Share Your Experience
          </Typography>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center py-2">
              <CircularProgress sx={{ color: "#a78bfa" }} />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert
              severity="error"
              sx={{
                background: "rgba(239,68,68,0.1)",
                color: "#fecaca",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Success Message */}
          <Slide direction="down" in={showSuccess} mountOnEnter unmountOnExit>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                background: "rgba(34,197,94,0.1)",
                color: "#bbf7d0",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              Review submitted successfully!
            </Alert>
          </Slide>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-6">

            {/* Rating */}
            <Box>
              <Typography className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                Rating
              </Typography>
              <div
                className={`inline-block transition-transform duration-300 ${
                  animateStars ? "scale-110" : ""
                }`}
              >
                <Rating
                  name="rating"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                    setAnimateStars(true);
                    setTimeout(() => setAnimateStars(false), 200);
                  }}
                  size="large"
                  precision={1}
                  sx={{
                    "& .MuiRating-iconFilled": {
                      color: "#facc15",
                      filter: "drop-shadow(0 0 6px rgba(250,204,21,0.6))",
                    },
                    "& .MuiRating-iconHover": {
                      color: "#fde047",
                    },
                  }}
                />
              </div>
            </Box>

            {/* Comment Input */}
            <TextField
              id="comment"
              label="Your Review"
              variant="outlined"
              multiline
              fullWidth
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              InputProps={{
                style: {
                  borderRadius: "16px",
                  backgroundColor: "rgba(255,255,255,0.9)",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                },
                "& label.Mui-focused": {
                  color: "#a78bfa",
                },
                "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                  borderColor: "#a78bfa",
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: "14px",
                paddingY: "14px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "none",
                background:
                  "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                boxShadow:
                  "0 20px 60px rgba(99,102,241,0.6)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow:
                    "0 25px 80px rgba(139,92,246,0.7)",
                  background:
                    "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                },
                "&:active": {
                  transform: "scale(0.97)",
                },
              }}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </Paper>
    </Fade>
  );
};

export default ReviewForm;
