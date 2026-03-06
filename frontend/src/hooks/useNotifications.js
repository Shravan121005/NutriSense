import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../services/firebase";
import { vapidKey } from "../config/firebaseConfig";
import api from "../services/api";

const REMINDERS = [
    { label: "Breakfast", hour: 8, minute: 0 },
    { label: "Lunch", hour: 13, minute: 0 },
    { label: "Dinner", hour: 19, minute: 0 },
];

const scheduleLocalReminder = (label, hour, minute) => {
    const now = new Date();
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const ms = next - now;
    return setTimeout(() => {
        if (Notification.permission === "granted") {
            new Notification("NutriSense Reminder 🥗", {
                body: `Time for ${label}! Don't forget to log your meal.`,
                icon: "/favicon.svg",
            });
        }
    }, ms);
};

export const useNotifications = () => {
    const timers = useRef([]);

    useEffect(() => {
        const init = async () => {
            if (!("Notification" in window)) return;
            const permission = await Notification.requestPermission();
            if (permission !== "granted") return;

            // Schedule local browser notifications
            REMINDERS.forEach(({ label, hour, minute }) => {
                const t = scheduleLocalReminder(label, hour, minute);
                timers.current.push(t);
            });

            // Register FCM token with backend for server-side use
            try {
                const messaging = await getFirebaseMessaging();
                if (messaging && vapidKey) {
                    const token = await getToken(messaging, { vapidKey });
                    if (token) {
                        await api.put("/users/profile", { fcmToken: token });
                    }
                }
            } catch (err) {
                console.warn("FCM token registration skipped:", err.message);
            }
        };

        init();
        return () => timers.current.forEach(clearTimeout);
    }, []);
};
