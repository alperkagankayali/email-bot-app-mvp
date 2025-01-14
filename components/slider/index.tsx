"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import { Badge, Card, Radio, Tag } from "antd";
import clsx from "clsx";
import Image from "next/image";
import { languageColor, languageEnum } from "@/constants";
import { ICourse } from "@/types/courseType";

const { Meta } = Card;

type IRelation = {
  author: string;
  authorType: string;
  created_at: Date;
  educations: ICourse;
  isDelete: boolean;
  languages: string[];
  _id: string;
};

type Props = {
  children: React.ReactNode;
  slidesToShow?: number;
  selected: string;
  setSelected: (x: string) => void;
  relationEducationList: IRelation[];
};

const ResponsiveSlider: React.FC<Props> = ({
  children,
  slidesToShow,
  selected,
  setSelected,
  relationEducationList,
}) => {
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow || 5,
    slidesToScroll: slidesToShow || 5,
    initialSlide: 0,
    // nextArrow: <div className="bg-black"> <ArrowRightOutlined color="red" className="text-3xl !text-red" /></div>,
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
    <div className="slider-container w-full h-115">
      <h2 className="text-3xl text-black-2 font-bold">Related similar educations</h2>
      <Slider {...settings} className="!h-115">
        {relationEducationList.map((item, index: number) => {
          return (
            <Radio.Group
              onChange={(e) => {
                setSelected(e.target.value);
              }}
              key={item._id}
              buttonStyle="solid"
              rootClassName="h-full"
              className={
                "!h-full !flex" + selected === item._id
                  ? "template-list selected"
                  : "template-list"
              }
              value={selected}
            >
              <Radio
                value={item._id}
                className="h-full flex"
                rootClassName="h-full"
              >
                <Badge.Ribbon
                  className={clsx("card-title-ribbon")}
                  color={item?.authorType === "superadmin" ? "green" : "red"}
                  text={item?.authorType === "superadmin" ? "Global" : "Local"}
                  key={item._id}
                >
                  <Card
                    key={item._id}
                    hoverable
                    className={clsx("h-full flex", {
                      "!border !border-blue-700": selected === item._id,
                    })}
                    style={{ width: 240, height: 305 }}
                    cover={
                      <Image
                        width={240}
                        height={100}
                        className="h-30 object-contain bg-[#03162b]"
                        alt={item?.educations?.title}
                        src={item?.educations?.img}
                      />
                    }
                  >
                    <Meta
                      className="card-meta"
                      title={item?.educations?.title}
                      description={
                        <div className="mt-auto">
                          <div className="my-4">
                            {!!item?.educations?.levelOfDifficulty && (
                              <Tag
                                className="!m-0 !pl-1"
                                color={
                                  item?.educations?.levelOfDifficulty === "hard"
                                    ? "#cd201f"
                                    : item?.educations?.levelOfDifficulty ===
                                        "medium"
                                      ? "#108ee9"
                                      : "#87d068"
                                }
                              >
                                {item?.educations?.levelOfDifficulty}
                              </Tag>
                            )}
                          </div>
                          <div className="my-4">
                            {item.languages.map((e: any) => (
                              <Tag
                                key={e}
                                color={
                                  languageColor[e as languageEnum] ?? "blue"
                                }
                              >
                                {e}
                              </Tag>
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Badge.Ribbon>
              </Radio>
            </Radio.Group>
          );
        })}
      </Slider>
    </div>
  );
};

export default ResponsiveSlider;
