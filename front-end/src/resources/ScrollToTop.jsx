import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Restablece el scroll al inicio en cada cambio de ruta
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;