import { Navigate, useParams, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../Utils/supabase"
import Loading from "../Components/Loading"

export default function Protected() {
    const {user_id} = useParams<{user_id: string}>()
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setAuthorized(false);
            } else if (user_id && session.user.id !== user_id) {
                setAuthorized(false);
            } else {
                setAuthorized(true);
            }
            setLoading(false);
        };

        verifyAuth();
    }, [user_id]);
    
    if (loading) return <Loading message="Loading User..." />
    return authorized ? <Outlet /> : <Navigate to="/register" replace />;
}