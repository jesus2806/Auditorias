// BackgroundCarousel.js
import React from 'react';
import Slider from 'react-slick';

// Importa los CSS de slick-carousel
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './css/Carrusel.css'

// Importa tus imágenes (ajusta las rutas según tu estructura de carpetas)
import image1 from '../../assets/img/img1.jpg';
import image2 from '../../assets/img/img2.jpeg';
import image3 from '../../assets/img/img3.jpg';

const BackgroundCarousel = () => {
  // Configuración del slider
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 10000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="background-carousel">
      <Slider {...settings}>
        <div>
          <img src={image1} alt="Imagen 1" />
        </div>
        <div>
          <img src={image2} alt="Imagen 2" />
        </div>
        <div>
          <img src={image3} alt="Imagen 3" />
        </div>
      </Slider>
    </div>
  );
};

export default BackgroundCarousel;