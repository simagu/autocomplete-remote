const express = require('express');
const delay = require('delay');
const app = express();
const port = 3000;

app.use(async (req, res, next) => {
    const ms = Math.floor(Math.random() * 100 + 300);
    await delay(ms);
    next();
});

app.get('/api/cities', (req, res) => {
    const term = req.query.term ?? '';
    const pageSize = req.query.pageSize ?? 10;
    const page = req.query.page ?? 1;
    if (isNaN(pageSize))
        pageSize = 10;
    if (isNaN(page)) 
        page = 1;
    const cities = [
        'CHY嘉義縣',
        'CWH彰化縣',
        'CWS彰化市',
        'CYI嘉義市',
        'GNI綠島',
        'HSC新竹市',
        'HSH新竹縣',
        'HWA花蓮縣',
        'HWC花蓮市',
        'ILC宜蘭市',
        'ILN宜蘭縣',
        'KHH高雄市',
        'KLU基隆市',
        'KMN金門縣',
        'KYD蘭嶼',
        'LNN連江縣',
        'MAC苗栗市',
        'MAL苗栗縣',
        'MZG馬公市',
        'MZW馬祖',
        'NHD南海島',
        'NTC南投市',
        'NTO南投縣',
        'PCH屏東縣',
        'PEH澎湖縣',
        'TIT中壢市',
        'TNN台南市',
        'TPE台北市',
        'TPH新北市',
        'TSA松山',
        'TTC台東市',
        'TTT台東縣',
        'TXG台中市',
        'TYC桃園市',
        'YUN雲林縣'
    ]
    
    let filterCities = [];
    if (term !== '') 
        filterCities = cities.filter(v => v.indexOf(term.toUpperCase()) >= 0);
    else
        filterCities = cities;

    const cityCodeBegin = 0, cityCodeEnd = 3;
    let results = filterCities.map(x => ({
        data: { 
            cityName: x.substring(cityCodeEnd),
            cityCode: x.substring(cityCodeBegin, cityCodeEnd)
        },
        text: x.substring(cityCodeEnd ),
        label: `${x.substring(cityCodeBegin, cityCodeEnd)}-${x.substring(cityCodeEnd)}`,
        value: x.substring(cityCodeBegin, cityCodeEnd)
    }));
    const resultsPagination = results.slice((page - 1) * pageSize, page * pageSize);
    let resultsObject = {
        total: results.length,
        items: resultsPagination
    };

    res.set({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }).send(JSON.stringify(resultsObject));
});

app.listen(port, () => {
    console.log(`testing api listening at http://localhost:${port}`)
});