import React, { useState } from "react";
import uploadIcon from "../../../public/uploadIcon.png";
import downloadIcon from "../../../public/downloadIcon.png";
import viewIcon from "../../../public/viewIcon.png";
import tickMark from "../../../public/tickMark.png";
import { Image, Modal } from "antd";
import { httpVendorUpload } from "../../services/api-client"; // Import your API client

function FileAction({
  name,
  upload,
  display,
  download,
  fileKey,
  fileState, // This holds the current state of the file (URL)
  setFormData, // Function to update form state
  // handleUpload, // External upload handler
}) {
  const [isUploading, setIsUploading] = useState(false); // Track upload state

  // Helper function to update form data
  const setFile = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Upload file and update form data
  const handleFileUpload = async (event, key) => {
    const files = event.target.files;
    if (files?.length === 0) return; // No file selected

    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    // Validate file type and extension
    if (
      !allowedTypes?.includes(fileType) ||
      !["pdf", "jpeg", "jpg", "png"].includes(fileExtension)
    ) {
      toast.error("Please upload PDF, JPEG, JPG, or PNG files only.");
      return;
    }

    // Start upload process
    setIsUploading(true);

    const formData = new FormData();
    formData.append("files", file, fileName);

    try {
      const res = await httpVendorUpload.post(
        "/api/upload/multiple-image",
        formData
      );
      const uploadedLinks = res.data.links;

      if (uploadedLinks?.length > 0) {
        setFile(key, uploadedLinks[0]); // Update form with the uploaded file URL
      }
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("File upload error:", err);
      toast.error("File upload failed");
    } finally {
      setIsUploading(false); // Stop loading state
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileState;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = () => {
    if (fileState) {
      // Show the file in a modal with preview
      Modal.info({
        title: "File Preview",
        width: "800px",
        height: "800px",
        content: (
          <Image
            src={fileState} // Assuming fileState holds the file URL
            width={400} // Adjust width as needed
            height={300} // Adjust height as needed
            preview // Enable Ant Design's default preview behavior
          />
        ),
        onOk() {}, // You can provide an OK button action if needed
      });
    }
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
                onChange={(e) => handleFileUpload(e, fileKey)} // Handle file upload
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
                  className={
                    isUploading
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </label>
            </>
          )}
          {display && upload && (
            <>
              {fileState && (
                <Image
                  src={viewIcon}
                  width={20}
                  height={15}
                  className="relative top-1"
                  preview={false} // Disable the default preview
                  onClick={handleViewFile}
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
