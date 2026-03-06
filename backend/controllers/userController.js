const User = require("../models/User");

// GET /api/users/profile
const getProfile = async (req, res) => {
    const { uid } = req.user;
    try {
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
    const { uid } = req.user;
    const { displayName, dailyCalorieGoal, fcmToken } = req.body;

    try {
        const update = {};
        if (displayName !== undefined) update.displayName = displayName;
        if (dailyCalorieGoal !== undefined) update.dailyCalorieGoal = Number(dailyCalorieGoal);
        if (fcmToken !== undefined) update.fcmToken = fcmToken;

        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            { $set: update },
            { new: true }
        );

        if (!user) return res.status(404).json({ error: "User not found" });
        return res.json({ user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getProfile, updateProfile };
