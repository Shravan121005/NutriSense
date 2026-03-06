import { useState, useCallback } from "react";
import api from "../services/api";

export const useAnalytics = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchDailyCalories = useCallback(async (start, end) => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/daily", { params: { start, end } });
            setData((prev) => ({ ...prev, daily: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchWeeklyTrend = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/weekly");
            setData((prev) => ({ ...prev, weekly: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTopFoods = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/top-foods");
            setData((prev) => ({ ...prev, topFoods: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAvgRating = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/avg-rating");
            setData((prev) => ({ ...prev, avgRating: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTodaySummary = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/today");
            setData((prev) => ({ ...prev, today: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTrends = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get("/analytics/trends");
            setData((prev) => ({ ...prev, trends: res.data.data }));
            return res.data.data;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, fetchDailyCalories, fetchWeeklyTrend, fetchTopFoods, fetchAvgRating, fetchTodaySummary, fetchTrends };
};
