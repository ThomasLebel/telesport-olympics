import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { filter, Observable, of, Subject, takeUntil } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { PieChartEvent } from 'src/app/core/models/PieChartEvent';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Olympic[] | null | undefined> = of(undefined);
  public nbJOs: number = 0;
  public nbCountries: number = 0;
  public diagramData: PieChartData[] | undefined = undefined;
  public isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private olympicService: OlympicService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => data !== undefined)
      )
      .subscribe((data) => {
        if (data && data.length) {
          this.setProperties(data);
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
   * Permet d'initialiser les propriétés dynamiques du composant
   * @param olympics
   */
  setProperties(olympics: Olympic[]) {
    this.nbCountries = olympics.length;
    let josDates: Number[] = [];
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        if (!josDates.includes(participation.year)) {
          josDates.push(participation.year);
        }
      });
    });
    this.nbJOs = josDates.length;
    this.diagramData = this.initDiagramData(olympics);
    this.isLoading = false;
  }

  /**
   * Permet d'initialiser les données du diagramme circulaire
   * @param olympics
   * @returns
   */
  initDiagramData(olympics: Olympic[]): PieChartData[] {
    let result = [];
    for (let country of olympics) {
      let nbMedals = 0;
      for (let participation of country.participations) {
        nbMedals += participation.medalsCount;
      }
      result.push({
        name: country.country,
        value: nbMedals,
      });
    }
    return result;
  }
  /**
   * Permet de naviguer vers la route "details" avec le nom du pays sélectionné via une url dynamique
   * @param event
   */
  onCountryClick(event: PieChartEvent): void {
    this.router.navigateByUrl(`/details/${event.name}`);
  }

  /**
   *Permet d'afficher une snackbar avec un message d'erreur
   */
  openErrorSnackBar() {
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
