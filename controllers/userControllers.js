import UserToken from "../models/userToken.js";
import axios from "axios";
import { CronJob } from "cron";


let job = new CronJob('0 */8 * * *', ()=>{
    UserToken.updateOne({}, {$unset : {token : 1}}).exec();
});

job.start();

export const CreateSearch = async (req, res) => {
    try {
        const options = {
            method: 'POST',
            url: 'https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/create',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '1b36ac4e46msh9c9d8c83b49c50ap114021jsn14e58e8aa2a3',
                'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
            },
            data: {
                query: {
                    market: 'UK',
                    locale: 'en-GB',
                    currency: 'EUR',
                    queryLegs: [
                        {
                            originPlaceId: { iata: 'LHR' },
                            destinationPlaceId: { iata: 'DXB' },
                            date: {
                                year: 2023,
                                month: 9,
                                day: 20
                            }
                        }
                    ],
                    cabinClass: 'CABIN_CLASS_ECONOMY',
                    adults: 2,
                    childrenAges: [3, 9]
                }
            }
        };

        const response = await axios.request(options);
        const data = response.data.sessionToken;

        // update sessiontoken in the same entry 
        const checkdata=await UserToken.findOne({}).exec();
        if(checkdata){
            checkdata.token=data;
            await checkdata.save();
            return res.send("Token has been updated successfully.")
        }
                
        const token = new UserToken({
            token: data
        });
        await token.save();
        return res.send("Token has been created successfully.");
    } catch (error) {
        return res.send(error);
    }
}


export const PollSearch = async (req, res) => {
    try {
        const { _id } = req.body;
        const response = await UserToken.find({ _id }).exec();
        const token = response[0].token;
        console.log(token);
        const options = {
            method: 'GET',
            url: `https://skyscanner-api.p.rapidapi.com/v3/flights/live/search/poll/${token}`,
            headers: {
                'X-RapidAPI-Key': '1b36ac4e46msh9c9d8c83b49c50ap114021jsn14e58e8aa2a3',
                'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
            }
        };

        const response1 = await axios.request(options);
        res.send(response1.data);
    } catch (error) {
        return res.send(error);
    }
}