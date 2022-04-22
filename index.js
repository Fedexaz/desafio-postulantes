const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.sii.cl/servicios_online/1047-nomina_inst_financieras-1714.html');

    let data = await page.evaluate(() => {
        let results = [];
        let pArray = [];
        let cabeceras = document.querySelector('thead').querySelectorAll('th');
        let items = document.querySelector('tbody').querySelectorAll('tr');
        let titulo = document.querySelector('.title').innerHTML.replace('<script type=\"text/javascript\">menuSOL.escribeLink(1715, \"\", \"\", \"\")</script>', '').trimStart().trimEnd();
        let parrafo = document.querySelector('.contenido').querySelectorAll('p');
        
        parrafo.forEach((p, i) => {
            if(i === 1) {
                pArray.push(p.innerText);
            }
        });
        
        let datos = {
            titulo,
            parrafo: pArray[0]
        };
        
        results.push(datos);
        
        items.forEach(item => {
            const objeto = {};
            const datosArray = [];
            const datos = item.querySelectorAll('td');
            datos.forEach(el => datosArray.push(el.innerText));
            cabeceras.forEach((cabecera, i) => {
                objeto[cabecera.innerText] = datosArray[i];
            });
            results.push(objeto);
        })
        return results;
    })


    fs.writeFileSync(__dirname + '/datos.json', JSON.stringify(data), 'utf-8');
    await browser.close();
})();