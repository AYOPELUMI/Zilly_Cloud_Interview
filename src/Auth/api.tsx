import axios from "axios";



  
export const createAccount = async (data:unknown) => {
    try {
        const response = await axios.post(
            "https://zam.zilytst.com/api/v1/register/",
            data,
            {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  
                }
                ,}

        );
        
        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
}

export const signIn = async (data:unknown) => {
  try {
      const response = await axios.post(
          "https://zam.zilytst.com/api/v1/login/",
          data
          ,{
            headers: {
              'Content-Type': 'multipart/form-data',
              
            }
            ,}
      );

      if (response.status === 200) {

          return response.data;
      }
  } catch (error) {
      console.log(error);
  }
};