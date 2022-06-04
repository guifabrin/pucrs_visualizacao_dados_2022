let dataChoropleth = null
let dataCustom = null
let dataBarLines = null

const yearsChoroplethEl = document.querySelector('#yearsChoropleth')
const seasonsChoroplethEl = document.querySelector('#seasonsChoropleth')

const yearsCustomEl = document.querySelector('#yearsCustom')
const seasonsCustomEl = document.querySelector('#seasonsCustom')

const yearsBarLinesEl = document.querySelector('#yearsBarLines')
const seasonsBarLinesEl = document.querySelector('#seasonsBarLines')

const elWoman = document.querySelector('#Woman')
const elMan = document.querySelector('#Man')

function doFetch(url, yearsEl, callback) {
    fetch(url).then((response) => response.json()).then(obj => {
        callback(obj)
        const years = Object.keys(obj)
        for (const year of years.sort()) {
            const option = document.createElement('option')
            option.value = year
            option.innerText = year
            yearsEl.append(option)
        }
        yearsEl.onchange()
    })
}

function changeSeasons(selfEl, seasonsEl, data) {
    while (seasonsEl.children.length) {
        seasonsEl.removeChild(seasonsEl.children[0])
    }
    for (const season of Object.keys(data[selfEl.value])) {
        const option = document.createElement('option')
        option.value = season
        option.innerText = season
        seasonsEl.append(option)
    }
    seasonsEl.onchange()
}

function filterAllChoropleth() {
    filterChoropleth('Participants')
    filterChoropleth('Participants_M', 'Male Participants')
    filterChoropleth('Participants_F', 'Female Participants')
    filterChoropleth('GoldMedals', 'Gold Medals', 'GoldMedalsChoropleth')
    filterChoropleth('SilverMedals', 'Silver Medals', 'SilverMedalsChoropleth')
    filterChoropleth('BronzeMedals', 'Bronze Medals', 'BronzeMedalsChoropleth')
}

function filterChoropleth(type = 'Participants', title = null, id = null) {
    if (!title) {
        title = type
    }
    if (!id) {
        id = type
    }
    const year = yearsChoroplethEl.value
    const season = seasonsChoroplethEl.value
    if (!year || !season) {
        return
    }
    Plotly.newPlot(id, [{
        type: 'choropleth',
        locations: dataChoropleth[year][season].map(item => item.NOC),
        z: dataChoropleth[year][season].map(item => item[type]),
        autocolorscale: true
    }], {
        title: `${title} of ${year} - ${season}`,
        geo: {
            projection: {
                type: 'robinson'
            }
        }
    }, {showLink: false});
}

function filterCustom(el, data, base_img) {
    if (data) {
        el.style.display = ''
        el.querySelector('.number').innerText = data.AvgWeight.toFixed(2) + ' lbs'
        el.querySelector('.needle').style.transform = `rotate(${data.AvgWeight.toFixed(2) * 2}deg)`
        el.querySelector('.height').style.bottom = ((data.AvgHeight / 3 + 25).toFixed(0)) + '%'
        el.querySelector('.height span').innerText = '  Avg Height: ' + (data.AvgHeight).toFixed(0) + ' cm'
        el.querySelector('img.persona').src = `./images/${base_img}/age-${Math.ceil(data.AvgAge / 100 / 7 * 100)}.png`
        el.querySelector('.age').innerText = `Avg age: ${Math.ceil(data.AvgAge)} years`
        el.querySelector('.gold-medal span').innerText = data.GoldMedals
        el.querySelector('.silver-medal span').innerText = data.SilverMedals
        el.querySelector('.bronze-medal span').innerText = data.BronzeMedals
        const max = Math.max.apply(null, [data.GoldMedals, data.SilverMedals, data.BronzeMedals])
        el.querySelector('.gold-medal').style.top = (115 - data.GoldMedals * 100 / max) + '%'
        el.querySelector('.silver-medal').style.top = (115 - data.SilverMedals * 100 / max) + '%'
        el.querySelector('.bronze-medal').style.top = (115 - data.BronzeMedals * 100 / max) + '%'
    } else {
        el.style.display = 'none'
    }
}

function filterAllCustom() {
    const items = dataCustom[yearsCustomEl.value][seasonsCustomEl.value]
    const male = items.find(item => item.Sex === 'M')
    const female = items.find(item => item.Sex === 'F')
    filterCustom(elMan, male, 'man')
    filterCustom(elWoman, female, 'woman')
}

function showMain(selector) {
    [...document.querySelectorAll('.main')].forEach((item) => {
        item.style.display = 'none'
    })
    document.querySelector(selector).style.display = ''

    filterAllChoropleth()
    filterAllCustom()
    filterAllBarLines()
}

function changeYearAuto(index, yearsEl) {
    if (yearsEl.children[index]) {
        yearsEl.value = yearsEl.children[index].value
        yearsEl.onchange()
        setTimeout(() => {
            changeYearAuto(index + 1, yearsEl)
        }, 500)
    }
}


doFetch('./choropleth_participants_by_country.json', yearsChoroplethEl, (data) => {
    dataChoropleth = data
})

doFetch('./custom_participants_by_country.json', yearsCustomEl, (data) => {
    dataCustom = data
})

doFetch('./bar_lines_participants_by_sports.json', yearsBarLinesEl, (data) => {
    dataBarLines = data
})

function filterAllBarLines() {
    const data = dataBarLines[yearsBarLinesEl.value][seasonsBarLinesEl.value]
    Plotly.newPlot('bar_lines_container_all', [{
        x: data.map(item => item.Sport),
        y: data.map(item => item.Participants),
        type: 'scatter',
        name: 'Participants'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.GoldMedals),
        type: 'bar',
        name: 'Gold medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.SilverMedals),
        type: 'bar',
        name: 'Silver medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.BronzeMedals),
        type: 'bar',
        name: 'Bronze medals'
    }]);

    Plotly.newPlot('bar_lines_container_male', [{
        x: data.map(item => item.Sport),
        y: data.map(item => item.Participants_M),
        type: 'scatter',
        name: 'Participants'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.GoldMedals_M),
        type: 'bar',
        name: 'Gold medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.SilverMedals_M),
        type: 'bar',
        name: 'Silver medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.BronzeMedals_M),
        type: 'bar',
        name: 'Bronze medals'
    }]);


    Plotly.newPlot('bar_lines_container_female', [{
        x: data.map(item => item.Sport),
        y: data.map(item => item.Participants_F),
        type: 'scatter',
        name: 'Participants'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.GoldMedals_F),
        type: 'bar',
        name: 'Gold medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.SilverMedals_F),
        type: 'bar',
        name: 'Silver medals'
    },{
        x: data.map(item => item.Sport),
        y: data.map(item => item.BronzeMedals_F),
        type: 'bar',
        name: 'Bronze medals'
    }]);
}

showMain('#custom_view')