import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DiagramData } from 'src/app/core/models/DiagramData';
import { Olympic } from 'src/app/core/models/Olympic';
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
  public diagramData: DiagramData[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.nbCountries = data.length;
        this.nbJOs = data[0].participations.length;
        this.diagramData = this.initDiagramData(data);
      }
    });
  }

  initDiagramData(data: Olympic[]): DiagramData[] {
    let result = [];
    for (let country of data) {
      let nbMedals = 0;
      for (let participation of country.participations) {
        nbMedals += participation.medalsCount;
      }
      result.push({
        country: country.country,
        nbMedals,
      });
    }
    return result;
  }
}
