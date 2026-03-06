import { useState, useCallback } from "react";
import api from "../services/api";

export const useMeals = () => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMeals = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/meals", { params });
            setMeals(res.data.meals);
            return res.data;
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load meals");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMealHistory = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get("/meals/history", { params });
            setMeals(res.data.meals);
            return res.data; // includes { meals, total, page, totalPages }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to load meal history");
        } finally {
            setLoading(false);
        }
    }, []);

    const logMeal = useCallback(async (mealData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/meals", mealData);
            setMeals((prev) => [res.data.meal, ...prev]);
            return res.data.meal;
        } catch (err) {
            setError(err.response?.data?.error || "Failed to log meal");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteMeal = useCallback(async (id) => {
        try {
            await api.delete(`/meals/${id}`);
            setMeals((prev) => prev.filter((m) => m._id !== id));
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete meal");
        }
    }, []);

    return { meals, loading, error, fetchMeals, fetchMealHistory, logMeal, deleteMeal };
};
