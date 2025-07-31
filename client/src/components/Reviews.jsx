import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaUserCircle,
  FaStar,
  FaRegStar,
  FaPaperPlane,
  FaTrashAlt,
} from "react-icons/fa";

const Reviews = (props) => {
  const { backendUrl, doctors, userData, getAllDoctors } =
    useContext(AppContext);
  const [doctor, setDoctor] = useState([]);
  // const [allReviews, setAllReviews] = useState([]);
  const [reload, setReload] = useState(false);

  //  Tesing for review
  const [ratingInput, setRatingInput] = useState(0);
  const [hover, setHover] = useState(0);

  //   Tesing for review
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(Number);

  const [reviewLength, setReviewLength] = useState(0);

  useEffect(() => {
    let docInfo = doctors.find((doc) => doc._id === props.docId)?.reviews;
    console.log(docInfo);
    setReviewLength(docInfo?.length);
    setDoctor(docInfo);
    checkReviewSubmission()
  }, [reload, doctors, props.docId]);

  const [visibleCount, setVisibleCount] = useState(3);
  // Load more reviews functionality
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  //   Submit review function
  const reviewSubmit = async (e) => {
    e.preventDefault();

    if (ratingInput === 0) {
      toast.error("Please select rating");
      return;
    }

    console.log(userData);

    const { data } = await axios.post(`${backendUrl}/api/admin/add-review`, {
      comment,
      rating: ratingInput,
      docId: props.docId,
      patientId: userData.userId,
    });

    console.log(userData);

    if (data.success) {
      toast.success(data.message);
      setComment("");
      setRatingInput(0);
      setHover(0);

      setReload(!reload);
      getAllDoctors();
    } else {
      toast.error(data.message);
    }
  };

  // Delete Review by Admin
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const handleDeleteReview = async () => {
    try {
      const res = await axios.delete(
        `${backendUrl}/api/admin/delete-review/${selectedReviewId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        getAllDoctors();
      } else {
        toast.error(res.data.message || "Deletion failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setShowConfirmModal(false);
      setSelectedReviewId(null);
    }
  };

  const [hasUserAlreadySubmittedReview, setHasUserAlreadySubmittedReview] = useState()
  const checkReviewSubmission = async () => {
    let reviews = await doctors.find((doc) => doc._id === props.docId)?.reviews;
    let user = await reviews.filter((review) => review.patientId?._id === userData.userId)
    console.log(!(user.length === 0))
    
    setHasUserAlreadySubmittedReview(!(user.length === 0))
  }

  return (
    <div>
      {/* Updated Review Section */}
      <div className="bg-white shadow-xl border border-gray-300 rounded-3xl p-6 sm:p-10  mx-auto mt-10 ">
        {/* ⭐ Heading */}
        <h3 className="text-xl sm:text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          Patient Reviews ({doctor.length})
        </h3>

        {/* 🔄 Display existing reviews */}
        <div className="space-y-5 mb-4">
          {doctor.length > 0 ? (
            doctor.slice(0, visibleCount).map((review, idx) => (
              <div
                key={idx}
                className="relative group border-b border-gray-200 pb-5 pt-4 px-1 hover:bg-gray-100 transition rounded-md"
              >
                <div className="flex items-start gap-4">
                  {/* User Icon */}
                  <FaUserCircle className="text-3xl text-gray-400 mt-1 shrink-0" />

                  {/* Review Content */}
                  <div className="w-full">
                    {/* Name & Date */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                      <span className="font-semibold text-gray-800">
                        {review.patientId?.name?.firstName}{" "}
                        {review.patientId?.name?.lastName}
                      </span>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} className="text-yellow-500 text-sm" />
                        ) : (
                          <FaRegStar
                            key={i}
                            className="text-gray-300 text-sm"
                          />
                        )
                      )}
                    </div>

                    {/* Comment */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Delete Button (Only for Admin) */}
                {userData?.role === "admin" && (
                  <button
                    onClick={() => {
                      setSelectedReviewId(review._id);
                      setShowConfirmModal(true);
                    }}
                    className="absolute top-10 right-3 shadow bg-white text-red-600  hover:bg-red-100 hover:scale-105 p-2 rounded-full transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-300"
                    title="Delete Review"
                  >
                    <FaTrashAlt size={16} />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          )}
        </div>

        {/* Delete Confirmation Component*/}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md text-center "
              style={{ animation: "fadeIn 0.2s ease-out" }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the review from{" "}
                <span className="font-bold text-red-600">
                  {" "}
                  '
                  {
                    doctor.find((doc) => doc._id === selectedReviewId).patientId
                      ?.name?.firstName
                  }{" "}
                  {
                    doctor.find((doc) => doc._id === selectedReviewId).patientId
                      ?.name?.lastName
                  }
                  '
                </span>
                ? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedReviewId(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteReview}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirm
                </button>
              </div>
            </div>
            {/* CSS animation */}
            <style>{`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `}</style>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < doctor.length && (
          <div className="text-center mt-4 mb-6">
            <button
              onClick={handleLoadMore}
              className="inline-block px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full shadow hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Load More Reviews
            </button>
          </div>
        )}

        {/* ✍️ Write a Review */}
        {userData.role === 'patient' && !hasUserAlreadySubmittedReview && (
        <form
          onSubmit={reviewSubmit}
          className="border-t pt-8 mt-10 space-y-4 sm:space-y-6"
        >
          <h4 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <FaPaperPlane className="text-lg" />
            Write a Review
          </h4>

          {/* ⭐ Rating Stars */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRatingInput(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(ratingInput)}
                className="text-2xl transition-transform hover:scale-110 focus:outline-none"
              >
                {i < (hover || ratingInput) ? (
                  <FaStar className="text-yellow-500" />
                ) : (
                  <FaRegStar className="text-gray-400" />
                )}
              </button>
            ))}
          </div>

          {/* 📝 Comment Textarea */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder="Share your experience with this doctor..."
            className="w-full p-4 border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          ></textarea>

          {/* 📩 Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-full hover:bg-blue-700 transition duration-200 shadow"
            >
              Submit Review
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default Reviews;
