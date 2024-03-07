import React, { useState, useEffect } from "react";
import { Input } from "antd";
import { VscTrash } from "react-icons/vsc";
import Button from "../../Common/Button";

import { deleteQA } from "../../../services/product/productService";
import { toast } from "react-hot-toast";

const ProductQA = ({ edit, setQuestionAnswers, questionAns }) => {
  const [QAns, setQAns] = useState([]);

  useEffect(() => {
    setQAns(questionAns);
  }, [questionAns]);

  const handleMoreQAns = () => {
    let size = Object.keys(QAns).length;
    let indexing = `Q${size + 1}`;
    let sampleQns = {
      name: indexing,
      question: "",
      ans: "",
      suffixQ: indexing,
      suffixA: `A${size + 1}`,
      key: size + 1,
      id: 0,
    };

    setQAns([...QAns, sampleQns]);
  };

  return (
    <div className="ml-10">
      {QAns.map((x, index) => {
        return (
          <>
            <div key={index}>
              <Question
                name={x["name"]}
                suffixQ={x["suffixQ"]}
                suffixA={x["suffixA"]}
                QuestionAns={x}
                index={index}
                setQAns={setQAns}
                QAns={QAns}
                edit={edit}
                setQuestionAnswers={setQuestionAnswers}
              />
            </div>
          </>
        );
      })}

      <Button
        onClick={(e) => {
          e.preventDefault();
          handleMoreQAns();
        }}
        disabled={!edit}
        btnName="Add more Q&A"
      />
    </div>
  );
};

const Question = ({
  QuestionAns,
  name,
  suffixQ,
  suffixA,
  setQAns,
  QAns,
  edit,
  index,
  setQuestionAnswers,
}) => {
  const handleChange = (e, key) => {
    let quesAns = {
      ...QuestionAns,
      [key]: e.target.value,
    };
    let newObj = QAns.filter((qa) => qa.name !== QuestionAns.name);
    newObj.push(quesAns);

    setQAns(newObj.sort((a, b) => a.key - b.key));
    setQuestionAnswers(newObj);
  };

  const handleDelete = (QuestionAns) => {
    QuestionAns.id !== 0 &&
      deleteQA(QuestionAns.id)
        .then((res) => {
          toast.success("deleted successfully", {
            position: "bottom-right",
          });
        })
        .catch((err) => {
          toast.success("deleted unsuccessfully", {
            position: "bottom-right",
          });
        });

    let newObj = QAns.filter((qa) => qa.key !== QuestionAns.key);
    newObj.map((x, index) => {
      x["key"] = index + 1;
      x["name"] = `Q${index + 1}`;
      x["suffixQ"] = `Q${index + 1}`;
      x["suffixA"] = `A${index + 1}`;

      return x;
    });

    setQAns(newObj);
    setQuestionAnswers(newObj);
  };

  return (
    <div className="my-10 flex flex-col" key={index}>
      <div className="flex space-x-3">
        <Input
          name={name}
          prefix={<span className="text-[#AA00FF]">{suffixQ}</span>}
          onChange={(e) => handleChange(e, "question")}
          style={{
            width: "50%",
            padding: "5px",
          }}
          value={QuestionAns.question}
          disabled={!edit}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleDelete(QuestionAns);
          }}
          disabled={!edit}
        >
          <VscTrash size={20} />
        </button>
      </div>
      <Input
        name={name}
        prefix={<span className="text-[#AA00FF]">{suffixA}</span>}
        className="my-2"
        onChange={(e) => handleChange(e, "ans")}
        style={{
          width: "50%",
          padding: "5px",
        }}
        value={QuestionAns.ans}
        disabled={!edit}
      />
    </div>
  );
};

export default ProductQA;
