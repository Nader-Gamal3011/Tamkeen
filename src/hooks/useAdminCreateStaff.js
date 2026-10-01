import { apiRequest } from "../utils/apiClient";

export const useAdminCreateStaff = () => {
    const createDoctor = async (data) => {
        try {
            const res = await apiRequest("/admin/doctors", {
                method: "POST",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    const createReceptionist = async (data) => {
        try {
            const res = await apiRequest("/admin/receptionists", {
                method: "POST",
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!result.success) return { success: false, message: result.message };
            return { success: true, data: result.data };
        } catch (err) { return { success: false, message: err.message }; }
    };

    return { createDoctor, createReceptionist };
};