import React, { useEffect, useState } from "react";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { useNavigate } from "react-router-dom";
import { Box } from "@cloudscape-design/components";

export const withAdminAuth = (WrappedComponent: any) => {
    return function AdminProtected(props: any) {
        const navigate = useNavigate()
        const [isAdmin, setIsAdmin] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAdminStatus = async () => {
                try {
                   setIsAdmin(await AuthTokenStateController.isAdmin())
                } catch (error) {
                    window.location.href = '/forbidden';
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            };
            checkAdminStatus();
        }, [navigate]);

        if (loading || !isAdmin) {
            return <div>
                <Box textAlign="center">
                    <h1>Forbidden: 403</h1>
                </Box>
            </div>;
        }

        if (!isAdmin) {
            window.location.href = '/forbidden';
        }

        return <WrappedComponent {...props} />;
    };
};