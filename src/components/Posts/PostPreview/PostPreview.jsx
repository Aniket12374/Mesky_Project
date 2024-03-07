import dummypostImg from "@/assets/images/dummypost.png";
import meskyLogo from "@/assets/mesky-logos/mesky-circle.png";
import { BiDotsVerticalRounded } from "react-icons/bi";
import {
  FaRegCommentDots,
  FaRegHeart,
  FaShare,
  FaShareSquare,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { Carousel } from "react-responsive-carousel";
import { linkTpe } from "../../../utils";

const TEXT_LENGTH_MAX = 125;

const PostPreview = ({ post, images = [] }) => {
  const getDescription = (description) => {
    if (!description || description === null || description.length === 0)
      return "Description will appear here...";
    if (post.description.length < TEXT_LENGTH_MAX) return post.description;
    else return `${post.description.slice(0, TEXT_LENGTH_MAX)} ...more`;
  };

  return (
    <section className="px-40">
      <div className="flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-200 rounded-t-md flex justify-between items-center">
          <div className="flex space-x-3 ">
            <img height="30" width="30" src={meskyLogo} alt="mesky logo" />
            <div className="fredoka-700 text-xl">MESKY</div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="badge badge-outline">+ Follow</div>
            <BiDotsVerticalRounded />
          </div>
        </div>
        {/* Main */}
        <div className="p-3 bg-gray-300">
          <div className="flex justify-center pt-4 pb-12">
            {images.length <= 0 ? (
              <img src={dummypostImg} alt="dummy image" />
            ) : (
              <Carousel
                showThumbs={false}
                infiniteLoop={true}
                dynamicHeight={false}
                showArrows={false}
                showIndicators={images.length > 1}
                showStatus={false}
              >
                {images.map((img, index) => (
                  <div key={index}>
                    {linkTpe(img) == "image" ? (
                      <img src={img} />
                    ) : (
                      <video>
                        <source src={img} alt={img} />
                      </video>
                    )}
                  </div>
                ))}
              </Carousel>
            )}
          </div>
        </div>
        {/* Footer */}
        <div className="p-4 rounded-b-md bg-gray-200">
          <div className="w-64 break-words">
            {getDescription(post.description)}
          </div>
          <div className="flex justify-between pt-4">
            <div className="flex space-x-4">
              <FaRegHeart size={25} />
              <FaRegCommentDots size={25} />
              <FaShare size={25} />
            </div>
            <div>
              <FaShareSquare size={25} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

PostPreview.propTypes = {
  post: PropTypes.object,
};

export default PostPreview;
