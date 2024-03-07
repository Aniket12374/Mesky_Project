import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { MdDelete } from "react-icons/md";
import DroppableFix from "./DroppableFix/DroppableFix";
import { AiOutlinePlus } from "react-icons/ai";
import { httpCreators, httpVendor } from "../../../services/api-client";
import { useEffect, useState } from "react";
import _ from "lodash";
import classNames from "classnames";
import { LoaderIcon } from "react-hot-toast";

/* 
preview: Array of { id: String, name: String, thumb: link, type: string }
setPreview: Fn
setImageLinks: []
onImageChange: () => {}
*/
const DragDropImage = ({
  preview,
  setPreview,
  setImageLinks,
  label = "",
  disabled,
  allow,
  onImageChange = (imgs) => {},
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const images = preview && preview.map((image) => image.thumb);
    setImageLinks(images);
    onImageChange(images);
    setLoading(false);
  }, [preview]);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(preview);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPreview(items);
  }

  const removeImage = (id) => {
    const existingData = [...preview];
    const index = existingData.findIndex((char) => char.id === id);
    existingData.splice(index, 1);
    setPreview(existingData);
  };

  const onFileChange = (event) => {
    setLoading(true);
    let images = Object.values(event.target.files);
    const maxFileSize = 70 * 1024 * 1024;
    const imageMaxFileSize = 20 * 1024 * 1024;
    const formData = new FormData();

    images.map((img) => {
      if (img.type.includes("image") && img.size > imageMaxFileSize) {
        alert("Image file size exceeds the allowed limit of 10MB.");
        return;
      }

      if (img.type.includes("video") && img.size > maxFileSize) {
        alert("Video file size exceeds the allowed limit of 10MB.");
        return;
      }
      img.type.includes("image")
        ? formData.append(`files`, img, img.name)
        : null;
      img.type.includes("video")
        ? formData.append(`files`, img, img.name)
        : null;
    });

    const identity = new Date().valueOf().toString();

    httpVendor
      .post("/api/upload/multiple-image", formData)
      .then((res) => {
        const links = res.data.links;
        links.map((link) => {
          setPreview((prev) => [
            ...prev,
            {
              id: identity,
              name: identity,
              thumb: link,
              type: link.includes("mp4") ? "video" : "image",
            },
          ]);
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="w-full" id={label}>
      {loading ? <LoaderIcon /> : null}
      {/* upload */}
      {preview && preview.length > 0 && (
        <div
          className="border-2 p-4 rounded-md flex-wrap flex items-center overflow-auto"
          style={{ height: "200px", width: "100%" }}
        >
          <DragDropContext onDragEnd={handleOnDragEnd} id={label}>
            <DroppableFix droppableId={`preview_${label}`}>
              {(provided) => (
                <ul
                  className="preview flex justify-center space-x-10"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {preview.map(({ id, name, thumb, type }, index) => {
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {type && type.includes("image") ? (
                              <>
                                <div
                                  className="relative"
                                  style={{ height: "100px", width: "100px" }}
                                >
                                  <span
                                    className={classNames(
                                      "relative w-5 h-5 float-right z-10 text-white bg-red-600 rounded-full flex justify-center items-center",
                                      {
                                        hidden: disabled,
                                      }
                                    )}
                                    onClick={() => removeImage(id)}
                                  >
                                    x
                                  </span>
                                  <img
                                    src={thumb}
                                    alt={name ? name : "image"}
                                    className="absolute rounded-xl"
                                    style={{
                                      borderRadius: "10px",
                                      maxHeight: "200px",
                                      minHeight: "100px",
                                    }}
                                  />
                                </div>
                              </>
                            ) : (
                              <div
                                style={{ height: "200px", width: "200px" }}
                                className="relative"
                              >
                                <span
                                  className={classNames(
                                    "relative w-5 h-5 float-right z-10 text-white bg-red-600 rounded-full flex justify-center items-center",
                                    {
                                      hidden: disabled,
                                    }
                                  )}
                                  onClick={() => removeImage(id)}
                                >
                                  x
                                </span>
                                <video width="650" height="650" controls>
                                  <source src={thumb} alt="video url" />
                                </video>
                              </div>
                            )}
                          </li>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </ul>
              )}
            </DroppableFix>
          </DragDropContext>
        </div>
      )}

      {/* select file */}
      <div className="border rounded-md mt-5" id={label}>
        <div className="select-label">{label}</div>
        <div className="my-5">
          <label htmlFor={`file-input_${label}`}>
            <AiOutlinePlus
              size={80}
              color="gray"
              className="cursor-pointer mx-auto border-4 border-dashed"
            />
          </label>
        </div>

        <input
          // id="file-input"
          id={`file-input_${label}`}
          type="file"
          className="hidden"
          accept={allow}
          multiple
          disabled={disabled}
          onChange={onFileChange}
        />
      </div>
    </div>
  );
};

export default DragDropImage;
