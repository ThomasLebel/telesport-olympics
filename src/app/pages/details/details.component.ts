import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, of, Subject, takeUntil } from 'rxjs';
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
export class DetailsComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null | undefined> = of(undefined);
  public currentCountry!: Olympic | undefined;
  public nbMedals!: number;
  public nbAthletes!: number;
  public lineChartData!: LineChartData;
  public minYAxis: number = Infinity;
  public isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initProperties();
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        if (data) {
          this.initCountryData(data);
        } else {
          this.openErrorSnackBar();
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.router.navigateByUrl('/not-found');
    }
  }

  /**
   * Permet de set les données des compteurs et du graphique en ligne
   * @param country
   */
  setStatsAndSeriesData(country: Olympic): void {
    this.nbMedals = 0;
    this.nbAthletes = 0;
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

  openErrorSnackBar(): void {
    this._snackBar.open(
      'Une erreur réseau est surveune, réessayez plus tard',
      'Fermer',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      }
    );
  }
}
