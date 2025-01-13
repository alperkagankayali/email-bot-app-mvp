"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import { ArrowRightOutlined } from "@ant-design/icons";

type Props = {
  children: React.ReactNode;
  slidesToShow?: number;
};
const ResponsiveSlider: React.FC<Props> = ({ children, slidesToShow }) => {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow || 4,
    slidesToScroll: slidesToShow || 4,
    initialSlide: 0,
    nextArrow: <div className="bg-black"> <ArrowRightOutlined color="red" className="text-3xl !text-red" /></div>,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>{children}</Slider>
    </div>
  );
};

export default ResponsiveSlider;
