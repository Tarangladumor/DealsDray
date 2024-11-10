import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { token } = useAppSelector((state) => state.Admin);

    if (token !== null) {
        return <>{children}</>;
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
