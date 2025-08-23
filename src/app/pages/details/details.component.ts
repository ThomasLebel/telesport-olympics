import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import {
  LineChartData,
  SerieChartData,
} from 'src/app/core/models/LineChartData';
import { Olympic } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  public currentCountry!: Olympic | undefined;
  public nbMedals!: number;
  public nbAthletes!: number;
  public lineChartData!: LineChartData;
  public minYAxis: number = Infinity;
  public isLoading: boolean = false;

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initProperties();
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.initCountryData(data);
      }
    });
  }

  /**
   * Permet de set les valeurs des propriétés par défaut
   */
  initProperties(): void {
    this.isLoading = true;
    this.nbMedals = 0;
    this.nbAthletes = 0;
    this.currentCountry = undefined;
  }

  /**
   * Permet de rechercher les informations du pays dans les data et de set les données des compteurs et du graphique en ligne
   * @param olympicsData
   */
  initCountryData(olympicsData: Olympic[]): void {
    this.currentCountry = olympicsData.find(
      (country) => country.country === this.route.snapshot.params['country']
    );
    if (this.currentCountry) {
      this.setStatsAndSeriesData(this.currentCountry);
    } else {
      this.router.navigateByUrl('**');
    }
  }

  /**
   * Permet de set les données des compteurs et du graphique en ligne
   * @param country
   */
  setStatsAndSeriesData(country: Olympic) {
    let series: SerieChartData[] = [];
    for (let participation of country.participations) {
      this.nbMedals += participation.medalsCount;
      this.nbAthletes += participation.athleteCount;
      if (this.minYAxis + 10 > participation.medalsCount) {
        this.minYAxis = participation.medalsCount - 10;
      }
      series.push({
        name: participation.year.toString(),
        value: participation.medalsCount,
      });
    }
    this.lineChartData = { name: country.country, series };
    this.isLoading = false;
  }

  /**
   * Permet de naviguer vers la page d'acceuil
   */
  onArrowBackClick(): void {
    this.router.navigateByUrl('');
  }
}
