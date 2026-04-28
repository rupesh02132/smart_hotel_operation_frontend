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

import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, 
  FaUser, 
  FaCalendar, 
  FaThumbsUp, 
  FaRegSmile,
  FaQuoteLeft,
  FaTrash,
  FaCheckCircle
} from "react-icons/fa";

const ReviewForm = ({ listingId }) => {
  const dispatch = useDispatch();
  console.log("id", listingId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const { loading, error, success, reviews } = useSelector(
    (state) => state.review
  );

  const { user } = useSelector((state) => state.auth);

  const averageRating = reviews?.length > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews?.filter(r => Math.floor(r.rating) === star).length || 0,
    percentage: reviews?.length > 0 
      ? (reviews.filter(r => Math.floor(r.rating) === star).length / reviews.length) * 100 
      : 0
  }));

  useEffect(() => {
    dispatch(getListingReviews(listingId));
  }, [dispatch, listingId]);

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

  const deleteHandler = (id) => {
    if (window.confirm("Delete review?")) {
      dispatch(deleteReview(id));
    }
  };

  const visibleReviews = showAll ? reviews : reviews?.slice(0, 3);
  const hasUserReviewed = reviews?.some(r => r.user?._id === user?.user?._id);

  return (
    <Fade in timeout={500}>
      <div className="relative">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 left-4 sm:left-auto z-50"
            >
              <Alert 
                icon={<FaCheckCircle />}
                severity="success" 
                sx={{ 
                  backgroundColor: '#10b981',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              >
                Review submitted successfully!
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {reviews?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 sm:mb-8 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{averageRating}</div>
                  <div>
                    <Rating value={parseFloat(averageRating)} readOnly precision={0.5} sx={{ color: '#facc15', fontSize: '1rem' }} />
                    <div className="text-gray-400 text-xs sm:text-sm mt-1">
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <div className="w-10 sm:w-12 text-gray-400">{star} stars</div>
                    <div className="flex-1 h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: star * 0.1 }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                      />
                    </div>
                    <div className="w-8 sm:w-12 text-gray-400 text-right">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 md:mb-10"
        >
          <Typography className="text-white font-bold text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
            <FaQuoteLeft className="text-yellow-500 text-base sm:text-lg" />
            Share Your Experience
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4" sx={{ borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {hasUserReviewed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 sm:py-8 px-4 rounded-xl sm:rounded-2xl bg-yellow-500/10 border border-yellow-500/30"
            >
              <FaCheckCircle className="text-yellow-500 text-3xl sm:text-4xl mx-auto mb-2 sm:mb-3" />
              <p className="text-gray-300 text-sm sm:text-base">You've already reviewed this property</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Thank you for your feedback!</p>
            </motion.div>
          ) : (
            <form onSubmit={submitHandler} className="space-y-4 sm:space-y-5 md:space-y-6">
              <Box>
                <p className="text-gray-300 text-xs sm:text-sm mb-2 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Your Rating
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Rating
                    value={rating}
                    onChange={(e, v) => setRating(v)}
                    onChangeActive={(e, v) => setHoverRating(v)}
                    size="large"
                    sx={{
                      fontSize: { xs: 28, sm: 36, md: 48 },
                      "& .MuiRating-iconFilled": { color: "#facc15" },
                      "& .MuiRating-iconHover": { color: "#fbbf24" },
                      "& .MuiRating-iconEmpty": { color: "#4b5563" },
                    }}
                  />
                  {hoverRating > 0 && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-yellow-500 font-semibold text-xs sm:text-sm"
                    >
                      {hoverRating === 1 && "Poor"}
                      {hoverRating === 2 && "Fair"}
                      {hoverRating === 3 && "Good"}
                      {hoverRating === 4 && "Very Good"}
                      {hoverRating === 5 && "Excellent!"}
                    </motion.span>
                  )}
                </div>
              </Box>

              <TextField
                placeholder="Tell us about your stay..."
                multiline
                rows={4}
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "16px",
                    color: "#fff",
                    fontSize: { xs: "13px", sm: "14px" },
                    transition: "all 0.3s",
                    "&:hover": {
                      background: "rgba(255,255,255,0.08)",
                    },
                    "&.Mui-focused": {
                      background: "rgba(255,255,255,0.1)",
                      boxShadow: "0 0 0 2px rgba(59,130,246,0.3)",
                    },
                  },
                  "& textarea": { color: "#fff" },
                  "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                }}
              />

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  className="py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 transition-all disabled:opacity-50"
                  sx={{
                    borderRadius: '14px',
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #3b82f6, #4f46e5)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #2563eb, #4338ca)',
                    }
                  }}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={18} sx={{ color: 'white' }} />
                      <span className="text-xs sm:text-sm">Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FaThumbsUp className="text-sm sm:text-base" />
                      <span className="text-sm sm:text-base">Submit Review</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          )}
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <Typography className="text-white font-semibold text-base sm:text-lg">
              What guests say ({reviews?.length || 0})
            </Typography>
          </div>

          <AnimatePresence>
            {visibleReviews?.map((r, index) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-yellow-500/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-4xl sm:text-5xl md:text-6xl text-yellow-500/5 group-hover:text-yellow-500/10 transition-all">
                  <FaQuoteLeft />
                </div>

                <div className="relative z-10">
                  <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-white text-xs sm:text-sm" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base">
                          {r.user?.firstname} {r.user?.lastname}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
                          <Rating value={r.rating} readOnly size="small" sx={{ color: "#facc15", fontSize: '0.75rem' }} />
                          <span className="text-gray-500 text-[10px] sm:text-xs flex items-center gap-1">
                            <FaCalendar className="text-[8px] sm:text-[10px]" />
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {(user?.user?.role === "admin" || user?.user?._id === r.user?._id) && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteHandler(r._id)}
                        className="text-red-400 hover:text-red-300 transition p-1 self-start xs:self-center"
                      >
                        <FaTrash className="text-xs sm:text-sm" />
                      </motion.button>
                    )}
                  </div>

                  <p className="text-gray-300 mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed">
                    {r.comment}
                  </p>

                  <div className="mt-2 sm:mt-3 flex justify-end">
                    <button className="text-[10px] sm:text-xs text-gray-500 hover:text-yellow-500 transition flex items-center gap-1">
                      <FaThumbsUp className="text-[10px] sm:text-xs" />
                      Helpful
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {reviews?.length > 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 sm:mt-6"
            >
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-blue-600 hover:to-purple-600 text-white font-semibold text-xs sm:text-sm transition-all"
              >
                {showAll ? "Show Less" : `View All ${reviews.length} Reviews`}
              </button>
            </motion.div>
          )}

          {(!reviews || reviews.length === 0) && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-10 md:py-12"
            >
              <FaRegSmile className="text-gray-600 text-3xl sm:text-4xl md:text-5xl mx-auto mb-2 sm:mb-3" />
              <p className="text-gray-500 text-sm sm:text-base">No reviews yet. Be the first to share!</p>
            </motion.div>
          )}

          {loading && (
            <div className="flex justify-center py-6 sm:py-8">
              <CircularProgress sx={{ color: "#facc15" }} />
            </div>
          )}
        </div>
      </div>
    </Fade>
  );
};

export default ReviewForm;