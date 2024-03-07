import React, { useEffect } from "react";
import DragDropImage from "../../Common/DragDropImage/DragDropImage";
import { linkTpe } from "../../../utils";

const MediaTab = ({
  previewImages,
  previewVideos,
  setPreviewImages,
  getProductValues,
  setPreviewVideos,
  setImageLinks,
  setVideoLinks,
  getImages,
  getVideos,
  disabled,
  cancelBtnClicked,
}) => {
  useEffect(() => {
    let productImages = getProductValues("imagesList");
    let productVideos = getProductValues("videoUrls");
    const images = productImages.map((media, index) => {
      return {
        id: index.toString(),
        name: index.toString(),
        thumb: media,
        type: linkTpe(media),
      };
    });
    const videos =
      productVideos &&
      productVideos.map((link, index) => ({
        id: index.toString(),
        name: index.toString(),
        thumb: link,
        type: linkTpe(link),
      }));

    setPreviewImages(images ?? []);
    setPreviewVideos(videos ?? []);
  }, [cancelBtnClicked, disabled]);

  return (
    <div className="mt-5 flex space-x-5">
      <DragDropImage
        preview={previewImages}
        setPreview={setPreviewImages}
        setImageLinks={setImageLinks}
        getImages={getImages}
        label="Add Images"
        allow={["image/jpg", "image/jpeg", "image/png"]}
        disabled={disabled}
      />
      <DragDropImage
        preview={previewVideos}
        setPreview={setPreviewVideos}
        setImageLinks={setVideoLinks}
        getImages={getVideos}
        label="Add Videos"
        allow={["video/mp4"]}
        disabled={disabled}
      />
    </div>
  );
};

export default MediaTab;
