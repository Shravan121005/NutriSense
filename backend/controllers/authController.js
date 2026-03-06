const User = require("../models/User");

// POST /api/auth/sync
// Called after Firebase login to ensure user exists in MongoDB
const syncUser = async (req, res) => {
    const { uid, email } = req.user;
    const { displayName, photoURL } = req.body;

    try {
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                email,
                displayName: displayName || "",
                photoURL: photoURL || "",
            });
        } else {
            // Update profile fields if provided
            if (displayName) user.displayName = displayName;
            if (photoURL) user.photoURL = photoURL;
            await user.save();
        }

        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { syncUser };
