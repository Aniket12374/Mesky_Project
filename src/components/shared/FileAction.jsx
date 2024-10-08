import React, { useState } from "react";
import uploadIcon from "../../../public/uploadIcon.png";
import downloadIcon from "../../../public/downloadIcon.png";
import viewIcon from "../../../public/viewIcon.png";
import tickMark from "../../../public/tickMark.png";
import { Image } from "antd";

function FileAction({ name, upload, display, download }) {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  

  const handleImageChange = (e) => {    
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setFile(fileUrl);
      setFileType(selectedFile.type);
    }
  };

  return (
    <div>
      <div className="w-48 border border-gray rounded-md shadow-md py-2">
        <p className="flex justify-center pt-1">
          <div className="text-center text-xs font-semibold w-32">{name}</div>
          {upload && (
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
                id="file-upload" 
              />
              <label htmlFor="file-upload">
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
              {fileType.startsWith("image/") ? (
                <Image
                  src={file}
                  width={20}
                  height={15}
                  className="relative top-1"
                />
              ) : fileType === "application/pdf" ? (
                <a href={file} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={viewIcon}
                    width={20}
                    height={15}
                    className="relative top-1"
                  />
                </a>
              ) : null}
            </>
          )}
          {download && (
            <Image src={downloadIcon} width={20} height={20} preview={false} />
          )}
        </div>
      </div>
    </div>
  );
}

export default FileAction;
