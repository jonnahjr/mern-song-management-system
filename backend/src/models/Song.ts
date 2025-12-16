import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

const SongSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title cannot be empty'],
      maxlength: [120, 'Title too long'],
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
      minlength: [1, 'Artist cannot be empty'],
      maxlength: [80, 'Artist name too long'],
    },
    album: {
      type: String,
      required: [true, 'Album is required'],
      trim: true,
      minlength: [1, 'Album cannot be empty'],
      maxlength: [120, 'Album name too long'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      minlength: [1, 'Genre cannot be empty'],
      maxlength: [50, 'Genre name too long'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
    versionKey: false,
  }
);

// Indexes for efficient querying and aggregation
// Index on artist for stats like songs per artist, albums per artist
SongSchema.index({ artist: 1 });
// Index on album for songs per album
SongSchema.index({ album: 1 });
// Index on genre for songs per genre
SongSchema.index({ genre: 1 });
// Compound index for artist and album to optimize albums per artist queries
SongSchema.index({ artist: 1, album: 1 });

SongSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    // Provide both id and _id to keep frontend compatibility
    // eslint-disable-next-line no-underscore-dangle
    ret.id = ret._id;
    return ret;
  },
});

export default mongoose.model<ISong>('Song', SongSchema);