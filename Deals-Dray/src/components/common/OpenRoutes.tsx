import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface OpenRouteProps {
    children: ReactNode;
}

const OpenRoute: React.FC<OpenRouteProps> = ({ children }) => {
    const { token } = useAppSelector((state) => state.Admin);

    if (token === null) {
        return <>{children}</>;
    } else {
        return <Navigate to="/dashboard/my-profile" />;
    }
};

export default OpenRoute;
