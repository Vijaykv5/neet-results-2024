import qs from 'qs';
import cheerio from 'cheerio'; 
import axios from 'axios';

interface IRequest {
    candidateName?: string;
    allIndiaRank?: string;
    solved: boolean;
    marks?: string;
}

export function sendRequest(day: string, month: string, year: string, applicationNumber: string): Promise<IRequest>{
    return new Promise((resolve, reject) => {

        let data = qs.stringify({
            '_csrf-frontend': 'Ve8UtapBrxQVNl-d0IXSIdb6_ytZNBQvZiQuKZn-5RYGnyDhyXHbYCRmD8uf7YsSj8uaZDRBbWoBEUUYroTUXw==',
            'Scorecardmodel[ApplicationNumber]': applicationNumber,
            'Scorecardmodel[Day]': day,
            'Scorecardmodel[Month]': month,
            'Scorecardmodel[Year]': year
        });

        let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
        headers: { 
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8', 
            'Cache-Control': 'max-age=0', 
            'Connection': 'keep-alive', 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Cookie': 'advanced-frontend=lsv6jcctueu8r89vd25t2i1mr8; _csrf-frontend=3dc15392e694749451ce9f2e024ba1ce5f751774ff6cb661e3b427f8e6bc0681a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22Sp4Tc0tt1PPVOhY3Y1eOmuyEg5k17z1I%22%3B%7D', 
            'Origin': 'null', 
            'Sec-Fetch-Dest': 'document', 
            'Sec-Fetch-Mode': 'navigate', 
            'Sec-Fetch-Site': 'same-origin', 
            'Sec-Fetch-User': '?1', 
            'Upgrade-Insecure-Requests': '1', 
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', 
            'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"macOS"'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {
            const htmlContent = JSON.stringify(response.data);
            if (htmlContent.includes('Please check your photo and QR code on your scorecard')) {
                resolve({
                    solved: false
                })
                return;
            }
            const $ = cheerio.load(htmlContent);
            const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'N/A';

            // Find the candidate's name
            const candidateName = $('td:contains("Candidate’s Name")').next().text().trim() || 'N/A';
            
            // Find the All India Rank
            const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';

            const marks = $('td:contains("Total Marks Obtained (out of 720)")').next('td').text().trim() || 'N/A';
            
            console.log(`Application Number: ${applicationNumber}`);
            console.log(`Candidate's Name: ${candidateName}`);
            console.log(`All India Rank: ${allIndiaRank}`); 
            console.log(`Marks: ${marks}`);
            resolve({
                candidateName,
                allIndiaRank,
                solved: true,
                marks
            });

        })
        .catch((error) => {
        console.log(error);
        resolve({
            solved: false
        });
        });

    });

}
