import React, { useState } from "react";
import uploadIcon from "../../../public/uploadIcon.png";
import downloadIcon from "../../../public/downloadIcon.png";
import viewIcon from "../../../public/viewIcon.png";
import tickMark from "../../../public/tickMark.png";
import { Image } from "antd";

function FileAction({
  name,
  upload,
  display,
  download,
  fileKey,
  fileState,
  setFile,
}) {
  const [fileType, setFileType] = useState(null); // Track the file type

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    const fileUrl = URL.createObjectURL(selectedFile);

    setFile((prevFiles) => ({
      ...prevFiles,
      [fileKey]: fileUrl, // Update the specific file in state
    }));

    setFileType(selectedFile.type); // Track the file type
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileState;
    link.download = name; // Set the download name (you can customize it)
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div>
      <div className="w-48 border border-gray rounded-md shadow-md py-2">
        <p className="flex justify-center pt-1">
          <div className="text-center text-xs font-semibold w-32">{name}</div>
          {upload && fileState && (
            <Image src={tickMark} width={15} height={15} preview={false} />
          )}
        </p>
        <div className="flex justify-center space-x-6 pt-1">
          {upload && (
            <>
              <input
                type="file"
                onChange={handleImageChange}
                accept=".pdf,image/*"
                className="hidden"
                id={`file-upload-${fileKey}`}
              />
              <label htmlFor={`file-upload-${fileKey}`}>
                <Image
                  src={uploadIcon}
                  width={20}
                  height={20}
                  preview={false}
                />
              </label>
            </>
          )}
          {display && (
            <>
              {fileState ? (
                <Image
                  src={fileState}
                  width={20}
                  height={15}
                  className="relative top-1"
                />
              ) : (
                <Image
                  src={viewIcon}
                  width={20}
                  height={15}
                  className="relative top-1"
                />
              )}
            </>
          )}
          {download && fileState && (
            <Image
              src={downloadIcon}
              width={20}
              height={20}
              preview={false}
              className="cursor-pointer"
              onClick={handleDownload} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default FileAction;
