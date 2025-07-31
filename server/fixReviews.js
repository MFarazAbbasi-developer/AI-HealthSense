import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(`${process.env.MONGODB_URI}/healthsense-auth`);
const db = mongoose.connection.db;

const fixReviewIds = async () => {
  try {
    const doctorsCollection = db.collection("doctors");
    const doctors = await doctorsCollection.find().toArray();

    for (const doc of doctors) {
      let updated = false;

      const fixedReviews = (doc.reviews || []).map((review) => {
        if (!review._id) {
          updated = true;
          return { ...review, _id: new mongoose.Types.ObjectId() };
        }
        return review;
      });

      if (updated) {
        await doctorsCollection.updateOne(
          { _id: doc._id },
          { $set: { reviews: fixedReviews } }
        );
        console.log(`✅ Fixed reviews for doctor: ${doc.name?.firstName} ${doc.name?.lastName}`);
      }
    }

    console.log("🎉 Done fixing all reviews.");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error fixing reviews:", err);
    mongoose.disconnect();
  }
};

fixReviewIds();
