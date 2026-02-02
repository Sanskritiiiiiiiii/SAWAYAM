import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

export const StarRating = ({ rating, onRatingChange, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          className={`transition-all ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
          data-testid={`star-${star}`}
        >
          <Star
            className={`h-6 w-6 sm:h-8 sm:w-8 ${
              star <= (hover || rating)
                ? 'fill-[#F59E0B] text-[#F59E0B]'
                : 'fill-none text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const RatingDisplay = ({ rating, totalRatings }) => {
  if (!totalRatings || totalRatings === 0) {
    return <span className="text-sm text-muted-foreground">No ratings yet</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-none text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-[#1C1917]">{rating.toFixed(1)}</span>
      <span className="text-sm text-muted-foreground">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
    </div>
  );
};

export const RatingModal = ({ isOpen, onClose, job, rater, ratee, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    await onSubmit({ rating, review });
    setSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {ratee.role === 'worker' ? 'Worker' : 'Employer'}</DialogTitle>
          <DialogDescription>
            How was your experience with {ratee.name} for "{job.title}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex flex-col items-center gap-3">
            <StarRating rating={rating} onRatingChange={setRating} />
            <p className="text-sm text-muted-foreground">
              {rating === 0 && 'Select your rating'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Below Average'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          <div>
            <label className="text-sm font-semibold text-[#1C1917] mb-2 block">
              Review (Optional)
            </label>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-20"
              data-testid="review-textarea"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="btn-primary flex-1"
              disabled={submitting || rating === 0}
              data-testid="submit-rating-button"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
