(function () {

    function nice(val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }

    fetch('https://data.irozhlas.cz/covid-uzis/ockovani_aktual.json')
        .then((response) => response.json())
        .then((curr) => {
            const plan = [
                ["Pfizer",0,277875,360750,426075,480000,480000,480000,500000,500000,500000,0,0,0],
                ["Moderna",0,80000,80000,80000,278000,278000,278000,278000,278000,278000,0,0,0],
                ["AstraZeneca",0,0,200000,400000,500000,900000,400000,600000,0,0,0,0,0],
                ["Curevac",0,0,0,0,22000,22000,22000,58000,58000,58000,73000,73000,73000],
                ["J&J",0,0,0,0,185000,185000,185000,400000,400000,400000,83000,83000,83000],
            ]
            
            const data = [];
            plan.forEach((row) => {
                const cumSum = ((sum) => value => sum += value)(0);
                data.push({
                    name: row[0],
                    data: row.slice(1,).map(cumSum),
                })
            })

            let current;
            let src = '';
            if (Date.parse(curr.offic.upd) >= Date.parse(curr.gray.upd)) {
                current = [Date.parse(curr.offic.upd), curr.offic.val];
            } else {
                current = [Date.parse(curr.gray.upd), curr.gray.val];
                src = ', ' + curr.gray.source;
            }

            data.push(
                {
                    name: 'Naočkované dávky',
                    data: [current],
                    color: '#de2d26',
                    visible: true,
                    type: 'scatter',
                    marker: {
                        symbol: 'circle'
                    }
                }
            )

            Highcharts.setOptions({
                lang: {
                    numericSymbols: [' tis.', ' mil.'],
                    months: ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec']
                },
            });

            const czMonths = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

            const chart = Highcharts.chart('covi_vak_plan', {
                chart: {
                    type: 'area',
                    spacingLeft: 0,
                    spacingRight: 0,
                },
                credits: {
                    href: 'https://koronavirus.mzcr.cz/wp-content/uploads/2020/12/Strategie_ockovani_proti_covid-19_aktual_221220.pdf',
                    text: 'Zdroj: očkovací strategie' + src,
                },
                colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', 'lightgray', '#b15928', 'black', '#01665e', '#542788'],
                title: {
                text: 'Plánované počty očkování',
                align: 'left',
                style: {
                    fontWeight: 'bold',
                },
                },
                subtitle: {
                    text: `Počty plánovaných očkování se vztahují ke konci měsíce. Počet naočkovaných dávek se aktualizuje automaticky.`,
                    align: 'left',
                    useHTML: true,
                },
                xAxis: {
                    type: "datetime",
                    dateTimeLabelFormats: {
                        month: '%B' 
                    }
                },
                yAxis: {
                    title: {
                        text: 'počet dávek',
                    },
                },
                tooltip: {
                    backgroundColor: '#ffffffee',
                    formatter: function() {
                        console.log(this)
                        if (this.color === '#de2d26') { // skutečný stav naočkovaných
                            const dte = new Date(this.x);
                            return `Aktuálně naočkovaných vakcín ${this.y} (${dte.getDate()}. ${dte.getMonth() + 1}.)`
                        }
                        let brands = ``;
                        let suma = 0;
                        this.points.forEach((p) => {
                            brands += `${p.point.series.options.name}: ${nice(p.y)}<br>`
                            suma += p.y
                        })
                        const dte = new Date(this.points[0].x)
                        let mnt = dte.getMonth()
                        if ((mnt === 0) & (dte.getFullYear() === 2021)) { return 'Očkování začalo na přelomu roku' }
                        if ((mnt === 0) & (dte.getFullYear() === 2022)) { mnt = 12; }
                        return `Během <b>${czMonths[mnt - 1]}</b> plánováno <b>celkem ${nice(suma)}</b> očkování:<br> ${brands}` 
                    },
                    shared: true,
                    useHTML: true,
                    style: {
                        fontSize: '0.8rem',
                    },
                },
                plotOptions: {
                    series: {
                        pointStart: Date.UTC(2021, 0, 1),
                        pointIntervalUnit: 'month'
                    },
                area: {
                    stacking: 'normal',
                    //step: 'left',
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                    },
                },
                },
                series: data,
            });
        })
  }());
  