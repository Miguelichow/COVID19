import { Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { CovidService } from '../../services/covid.service';
import { Router } from '@angular/router';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [CovidService],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

  allData: any[];
  paises: any[];
  dates: string[];
  deaths: number[] = [];
  confirmed: number[] = [];
  recovered: number[] = [];
  lastDeath: number;
  lastConfirmed: number;
  lastRecovered: number;
  seleccionado: any;
  elegido: boolean = false;
  anio: Date = new Date();
  numbers: number[] = [1, 5, 10, 15, 30, 60];

  public lineChartLabels: Label[] = [];

  public lineChartData: ChartDataSets[] = [];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    legend: { labels: {
                fontSize: 10,
                usePointStyle: true
              }         
            },
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [   
    { 
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'red',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'red'
    }   
  ];

  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  constructor(private servicio: CovidService, private router: Router) {
    this.servicio.getPaises().subscribe((data: any) => {
      this.allData = data;
      console.log(this.allData);

      this.paises = Object.keys(data);
      this.paises.sort((a, b) => a.localeCompare(b));
    });
  }

  paisSeleccionado(event) {
    this.resetChart();

    console.log(event.target.value);
    this.seleccionado = event.target.value;
    this.elegido = true;

    this.getDeaths();
    this.pintarDeaths();
    this.getFechas();
  }

  getDeaths() {
    for(let i = 0; i < this.allData[this.seleccionado].length; i+=10) {
      this.deaths.push(this.allData[this.seleccionado][i].deaths);
      this.recovered.push(this.allData[this.seleccionado][i].recovered);
      this.confirmed.push(this.allData[this.seleccionado][i].confirmed);
    }
    this.lastDeath = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].deaths;
    this.lastRecovered = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].recovered;
    this.lastConfirmed = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].confirmed;
    
    this.deaths.push(this.lastDeath);
    this.recovered.push(this.lastRecovered);
    this.confirmed.push(this.lastConfirmed);
  }

  pintarDeaths() {
    this.lineChartData.push({data: this.deaths, label: 'Deaths'});
    this.lineChartData.push({data: this.recovered, label: 'Recovered'});
    this.lineChartData.push({data: this.confirmed, label: 'Confirmed'});
  }

  getFechas() {
    for(let i = 0; i < this.allData[this.seleccionado].length; i+=10) {
      this.lineChartLabels.push(this.allData[this.seleccionado][i].date);
    }
    this.lineChartLabels.push(this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].date);
  }

  showAllData() {
    this.resetChart();

    for(let i = 0; i < this.allData[this.seleccionado].length; i++) {
      this.deaths.push(this.allData[this.seleccionado][i].deaths);
      this.recovered.push(this.allData[this.seleccionado][i].recovered);
      this.confirmed.push(this.allData[this.seleccionado][i].confirmed);
    }

    this.lastDeath = this.deaths[this.deaths.length-1];
    this.lastRecovered = this.recovered[this.recovered.length-1];
    this.lastConfirmed = this.confirmed[this.confirmed.length-1];

    this.deaths.push(this.lastDeath);
    this.recovered.push(this.lastRecovered);
    this.confirmed.push(this.lastConfirmed);    

    this.pintarDeaths();

    this.pintarAll();
  }

  pintarAll() {
    for(let i = 0; i < this.allData[this.seleccionado].length; i++) {
      this.lineChartLabels.push(this.allData[this.seleccionado][i].date);
    }
    this.lineChartLabels.push(this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].date);
  }

  showDailyData() {
    this.resetChart();

    this.deaths.push(this.allData[this.seleccionado][0].deaths);
    this.recovered.push(this.allData[this.seleccionado][0].recovered);
    this.confirmed.push(this.allData[this.seleccionado][0].confirmed);

    for(let i = 1; i < this.allData[this.seleccionado].length; i++) {
      let p = this.allData[this.seleccionado][i].deaths;
      let c = this.allData[this.seleccionado][i - 1].deaths;
      let daily = p - c;

      let p2 = this.allData[this.seleccionado][i].recovered;
      let c2 = this.allData[this.seleccionado][i - 1].recovered;
      let daily2 = p2 - c2;

      let p3 = this.allData[this.seleccionado][i].confirmed;
      let c3 = this.allData[this.seleccionado][i - 1].confirmed;
      let daily3 = p3 - c3;

      if(daily < 0) {
        daily = daily * (-1);
      }
      this.deaths.push(daily);

      if(daily2 < 0) {
        daily2 = daily2 * (-1);
      }
      this.recovered.push(daily2);

      if(daily3 < 0) {
        daily3 = daily3 * (-1);
      }
      this.confirmed.push(daily3);
    }

    this.lineChartData.push({data: this.deaths, label: 'Deaths'});
    this.lineChartData.push({data: this.recovered, label: 'Recovered'});
    this.lineChartData.push({data: this.confirmed, label: 'Confirmed'});

    for(let i = 0; i < this.allData[this.seleccionado].length; i++) {
      this.lineChartLabels.push(this.allData[this.seleccionado][i].date);
    }
  }

  pintarDaily() {
    for(let i = 0; i < this.allData[this.seleccionado].length; i++) {
      this.lineChartLabels.push(this.allData[this.seleccionado][i].date);
    }
    this.lineChartLabels.push(this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].date);
  }

  // SEGUNDO DROPDOWN CON EL NÚMERO DE DÍAS A ELEGIR
  send(event) {
    let num: number = Number(event.target.value);

    this.resetChart();

    for(let i = Number(this.allData[this.seleccionado].length - num); i <= this.allData[this.seleccionado].length - 1; i++) {
      console.log(i);
      this.deaths.push(this.allData[this.seleccionado][i].deaths);
      this.recovered.push(this.allData[this.seleccionado][i].recovered);
      this.confirmed.push(this.allData[this.seleccionado][i].confirmed);
    }
    this.lastDeath = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].deaths;
    this.lastRecovered = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].recovered;
    this.lastConfirmed = this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].confirmed;
    
    this.deaths.push(this.lastDeath);
    this.recovered.push(this.lastRecovered);
    this.confirmed.push(this.lastConfirmed);
    
    this.pintarDeaths();    

    for(let i = Number(this.allData[this.seleccionado].length - num); i <= this.allData[this.seleccionado].length; i++) {
      this.lineChartLabels.push(this.allData[this.seleccionado][i].date);
    }
    this.lineChartLabels.push(this.allData[this.seleccionado][this.allData[this.seleccionado].length-1].date);
  }

  resetChart() {
    this.deaths.length = 0;
    this.recovered.length = 0;
    this.confirmed.length = 0;
    this.lineChartData = [];
    this.lineChartLabels = [];
  }

}
