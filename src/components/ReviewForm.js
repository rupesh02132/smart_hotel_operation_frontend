import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createReview,
  getListingReviews,
  deleteReview,
} from "../state/review/Action";

import {
  TextField,
  Button,
  Typography,
  Box,
  Rating,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";

const ReviewForm = ({ listingId }) => {
  const dispatch = useDispatch();
  console.log("id", listingId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { loading, error, success, reviews } = useSelector(
    (state) => state.review
  );

  const { user } = useSelector((state) => state.auth);

  /* ⭐ load reviews */
  useEffect(() => {
    dispatch(getListingReviews(listingId));
  }, [dispatch, listingId]);

  /* ⭐ refresh after submit */
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      dispatch(getListingReviews(listingId));
      setRating(0);
      setComment("");

      const t = setTimeout(() => {
        setShowSuccess(false);
        dispatch({ type: "REVIEW_RESET" });
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [success, dispatch, listingId]);

  /* ⭐ submit */
  const submitHandler = (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      alert("Please give rating & comment");
      return;
    }

    dispatch(
      createReview({
        listing: listingId,
        rating,
        comment,
      })
    );
  };

  /* ⭐ delete */
  const deleteHandler = (id) => {
    if (window.confirm("Delete review?")) {
      dispatch(deleteReview(id));
    }
  };

  const visibleReviews = showAll
    ? reviews
    : reviews?.slice(0, 2);

  return (
    <Fade in timeout={500}>
      <div
        className="
        bg-gradient-to-br from-black/50 to-slate-2000

        border-0 sm:border sm:border-white/10
        rounded-none sm:rounded-3xl
        shadow-none sm:shadow-xl

        px-4 py-5 sm:p-5
      "
      >

        {/* ⭐ TITLE */}
        <Typography className="text-white font-extrabold text-lg sm:text-xl md:text-2xl mb-6">
          Guest Reviews
        </Typography>

        {/* ⭐ LOADER */}
        {loading && (
          <div className="flex justify-center mb-4">
            <CircularProgress sx={{ color: "#facc15" }} />
          </div>
        )}

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {showSuccess && (
          <Alert severity="success" className="mb-4">
            Review submitted successfully
          </Alert>
        )}

        {/* ⭐ FORM */}
        <form onSubmit={submitHandler} className="space-y-6">

          {/* ⭐ RATING */}
          <Box>
            <p className="text-gray-400 text-sm mb-2">
              Your Rating
            </p>

            <Rating
              value={rating}
              onChange={(e, v) => setRating(v)}
              size="small"
              sx={{
                fontSize: 30,
                "& .MuiRating-iconFilled": {
                  color: "#facc15",
                },
                "& .MuiRating-iconEmpty": {
                  color: "#555",
                },
              }}
            />
          </Box>

          {/* ⭐ COMMENT */}
          <TextField
            placeholder="Share your stay experience..."
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "rgba(255,255,255,0.06)",
                borderRadius: "16px",
                color: "#fff",
                fontSize: "14px",
              },
              "& textarea": {
                color: "#fff",
              },
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.15)",
              },
            }}
          />

          {/* ⭐ BUTTON */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            className=" py-3 rounded-xl  !text-black font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-700 hover:scale-[1.02] transition disabled:opacity-40"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>

        </form>

        {/* ⭐ REVIEW LIST */}
        <div className="mt-10 space-y-3">

          {visibleReviews?.map((r) => (
            <div
              key={r._id}
              className="
              bg-white/5 border border-white/10
              rounded-xl sm:rounded-2xl
              p-3 sm:p-5
              backdrop-blur
              hover:bg-white/10 transition
            "
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">

                <div>
                  <p className="text-white font-semibold text-sm sm:text-base break-words">
                    {r.user?.firstname}
                  </p>

                  <Rating
                    value={r.rating}
                    readOnly
                    size="small"
                    sx={{
                      "& .MuiRating-iconFilled": {
                        color: "#facc15",
                      },
                    }}
                  />
                </div>

                {(user?.user?.role === "admin" ||
                  user?.user?._id === r.user?._id) && (
                  <button
                    onClick={() => deleteHandler(r._id)}
                    className="text-red-400 text-xs sm:text-sm hover:text-red-300 pl-20"
                  >
                    Remove
                  </button>
                )}

              </div>

              <p className="
                text-gray-300 mt-3
                text-xs sm:text-sm md:text-base
                leading-relaxed
                break-words whitespace-pre-wrap
              ">
                {r.comment}
              </p>
            </div>
          ))}

          {/* ⭐ SHOW MORE */}
          {reviews?.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-yellow-400 font-semibold text-sm hover:text-yellow-300"
              >
                {showAll ? "Show Less" : "View All Reviews"}
              </button>
            </div>
          )}

        </div>

      </div>
    </Fade>
  );
};

export default ReviewForm;