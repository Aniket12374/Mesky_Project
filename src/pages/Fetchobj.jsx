import { isArray } from "lodash";
import React, { createContext, useEffect, useState } from "react";

const Fetchobj = () => {
  const [apiData, setApiData] = useState([]);

  // useEffect(()=>{
  //   const handledata = async()=>{
  //     try{
  //     const response = await updateDeliveryInstructions();
  //     console.log('Api response:',response);
  //     const first_name = response?.data.first_name
  //     setApiData(first_name);
  //   }catch(error){
  //     console.log('error handling:',error)
  //   }

  // }
  // handledata();
  // },[apiData])

  // useEffect(()=>{
  //   const handleapi = ()=>{
  //     updateDeliveryInstructions()
  //     .then((res)=>{
  //       console.log(res)
  //     }).catch((error)=>{
  //       console.log('error',error)

  //     })
  //   }
  //   handleapi();
  // },[])

  const obj = [
    {
      data: {
        name: "aniket",
        age: 25,
      },
    },
  ];

const [data,setData] = useState([1,2,3]);

const component = ({item})=>{
  return(
    <div>
      if{Array.isArray(item) ? (
        <ul>
        {data.map((item,index)=>{
          return <li key={index}>{item}</li>

})}
      
      </ul>
      ) : (
        <ul>
          return 'No data Available'
          
        </ul>
      )}
      
    </div>
  )
}


// const [data,setData] = useState([]);
// const [isLoading,setIsLoading] = useState(false);
// const [error,setError] = useState();

// useEffect(()=>{
//   const handleapi = async()=>{
//     try{
//     const response = await ('/api/delivery/portal/dashboard_stats')
//     const result = await response.json();
//     setData(result);
  
//   }catch(error){
//     setError(error.messeage);

//   }
// }
//   handleapi();
// },[data])

// if (isLoading){
//   return <div>...isLoading</div>
// }
// if(error){
//   return <div>...error</div>

// }






  



// function abc(name,age){
//   console.log(`Hello my ${name} is ${age} old`);


// }

// const obj = ({name,age})

// abc.call(obj,'Aniket', 25);
// abc.apply(obj,['Aniket'], 25)
// const newbound = abc.bind(obj,'Aniket')
// newbound()
      
      
      
  return (
    <div>
      {apidata && apidata.length > 0 ? (
        <div>
          {apidata.map((item, index) => {
            return <li key={index}>{item.name}</li>;
          })}
        </div>
      ) : (
        <h1>No data render</h1>
      )}
    </div>
  );
};

export default Fetchobj;
