import React, { useState } from "react";
import { Star } from "lucide-react";

import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

export const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hoveredStar, setHoveredStar] = useState(0);

  const activeValue = hoveredStar || rating;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHoveredStar(star)}
          onMouseLeave={() => !readonly && setHoveredStar(0)}
          className={`transition-all ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            className={`h-6 w-6 sm:h-8 sm:w-8 ${
              star <= activeValue
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const RatingDisplay = ({ rating, totalRatings }) => {
  if (!totalRatings) {
    return (
      <span className="text-sm text-muted-foreground">
        No ratings yet
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "fill-none text-gray-300"
            }`}
          />
        ))}
      </div>

      <span className="text-sm font-semibold text-[#1C1917]">
        {rating.toFixed(1)}
      </span>

      <span className="text-sm text-muted-foreground">
        ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
      </span>
    </div>
  );
};

export const RatingModal = ({
  isOpen,
  onClose,
  job,
  ratee,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ratingText = {
    1: "Poor",
    2: "Below Average",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  const handleSubmit = async () => {
    if (!rating) return;

    setSubmitting(true);
    await onSubmit({ rating, review });
    setSubmitting(false);

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Rate {ratee.role === "worker" ? "Worker" : "Employer"}
          </DialogTitle>

          <DialogDescription>
            How was your experience with {ratee.name} for "
            {job.title}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col items-center gap-3">
            <StarRating rating={rating} onRatingChange={setRating} />

            <p className="text-sm text-muted-foreground">
              {rating ? ratingText[rating] : "Select your rating"}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1C1917] block mb-2">
              Review (Optional)
            </label>

            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-20"
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              className="btn-primary flex-1"
              disabled={submitting || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
