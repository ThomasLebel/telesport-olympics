import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Olympic } from 'src/app/core/models/Olympic';
import { PieChartData } from 'src/app/core/models/PieChartData';
import { PieChartEvent } from 'src/app/core/models/PieChartEvent';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[] | null> = of(null);
  public nbJOs: number = 0;
  public nbCountries: number = 0;
  public diagramData: PieChartData[] = [];
  public isLoading: boolean = false;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.setProperties(data);
      }
    });
  }

  /**
   * Permet d'initialiser les propriétés dynamiques du composant
   * @param olympics
   */
  setProperties(olympics: Olympic[]) {
    this.nbCountries = olympics.length;
    this.nbJOs = olympics[0].participations.length;
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
}
