(function () {
    const plan = [
        ["Pfizer",0,138937,180375,213037,240000,240000,240000,250000,250000,250000,0,0,0],
        ["Moderna",0,40000,40000,40000,139000,139000,139000,139000,139000,139000,0,0,0],
        ["AstraZeneca",0,0,100000,200000,250000,450000,200000,300000,0,0,0,0,0],
        ["Curevac",0,0,0,0,11000,11000,11000,29000,29000,29000,36500,36500,36500],
        ["J&J",0,0,0,0,185000,185000,185000,400000,400000,400000,83000,83000,83000]
      ]
    
    const data = [];
    plan.forEach((row) => {
        const cumSum = ((sum) => value => sum += value)(0);
        data.push({
            name: row[0],
            data: row.slice(1,).map(cumSum),
        })
    })

    data.push(
        {
            name: 'Skutečně naočkovaní',
            data: [[1610560800000, 70680]],
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

    const chart = Highcharts.chart('covi_vak_plan', {
        chart: {
            type: 'area',
            spacingLeft: 0,
            spacingRight: 0,
        },
        credits: {
            href: 'https://koronavirus.mzcr.cz/wp-content/uploads/2020/12/Strategie_ockovani_proti_covid-19_aktual_221220.pdf',
            text: 'Zdroj: očkovací strategie',
        },
        colors: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', 'lightgray', '#b15928', 'black', '#01665e', '#542788'],
        title: {
        text: 'Plánované počty naočkovaných',
        align: 'left',
        style: {
            fontWeight: 'bold',
        },
        },
        subtitle: {
        text: `Počty plánovaně naočkovaných se vztahují ke konci předchozího měsíce. Aktualizováno jednou týdně ve čtvrtek`,
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
                text: 'počet osob',
            },
        },
        tooltip: {
            backgroundColor: '#ffffffee',
            headerFormat: '<span style="font-size:0.8rem"><b>Celkem v měsíci {point.key}</b></span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
                            + '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
            footerFormat: '</table>',
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
  }());
  