import React, { useEffect, useState } from "react";
import { Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { httpVendor } from "../../../services/api-client";

const ProfilePic = ({ setBrandInfo, brandInfo, disabled }) => {
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    brandInfo && brandInfo.profilePic
      ? setFileList([
          {
            uid: "-1",
            name: "image.png",
            status: "done",
            url: brandInfo.profilePic,
          },
        ])
      : null;
  }, [brandInfo]);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const formData = new FormData();
    formData.append(
      "files",
      newFileList[0]?.originFileObj,
      newFileList[0]?.originFileObj?.name
    );

    httpVendor
      .post("/api/upload/multiple-image", formData)
      .then((res) => {
        const link = res.data.links[0];
        setFileList(newFileList);
        setBrandInfo((prev) => ({ ...prev, profilePic: link }));
      })
      .catch((err) => console.log(err));
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <div>
      <ImgCrop rotationSlider>
        <Upload
          action="#"
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          disabled={disabled}
        >
          {fileList.length == 0 && "+ Upload"}
        </Upload>
      </ImgCrop>
    </div>
  );
};

export default ProfilePic;
