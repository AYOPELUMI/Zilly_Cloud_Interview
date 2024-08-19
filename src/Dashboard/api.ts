import axios from 'axios';

        export const fetchProfile = () =>{
    
        const data= axios.get("https://zam.zilytst.com/api/v1/images")
        .then(response => {console.log(response.data)
            const data = response.data;
            console.log(data)
            return data
            })
            .catch(error => {console.log(error)
            });
        
            console.log({data})
            return data
        }