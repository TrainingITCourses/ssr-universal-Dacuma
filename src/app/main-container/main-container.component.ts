import { Component, OnInit } from '@angular/core';
import { AgenciesService } from '../services/agencies.service';
import { StatusService } from '../services/status.service';
import { MissionService } from '../services/mission.service';
import { LaunchService } from '../services/launch.service';
import { forkJoin } from 'rxjs';
import { Options } from '../options';

@Component({
  selector: 'dcm-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent implements OnInit {

  public agencies;
  public missions;
  public statuses;
  isLoading: boolean;

  public values = [];
  public launches = [];

  private selectedOption: Options;

  constructor(private _agenciesService: AgenciesService,
    private _missionService: MissionService,
    private _statusService: StatusService,
    private _launchService: LaunchService) { }

  ngOnInit() {
    this.isLoading = true;
    forkJoin(
      this._agenciesService.getAgencies(),
      this._missionService.getMissions(),
      this._statusService.getStatuses()
    ).subscribe(
      data => {
        this.agencies = data[0].agencies;
        this.missions = data[1].types;
        this.statuses = data[2].types;

        // Inicio los valores por defecto con los de estado
        this.selectedOption = Options.status;
        this.values = this.statuses;
        this.isLoading = false;
      },
      err => console.error(err)
    );
  }

  optionChange(option: Options) {
    switch (option) {
      case Options.mission:
        this.values = this.missions;
        break;
      case Options.agency:
        this.values = this.agencies;
        break;
      case Options.status:
        this.values = this.statuses;
        break;
    }
    this.selectedOption = option;
  }

  valueChange(value) {
    if (!value) { return; }

    switch (this.selectedOption) {
      case Options.mission:
        this._launchService.getByMisssion(value).subscribe(values => {
          this.launches = values;
        });
        break;
      case Options.agency:
        this._launchService.getByAgency(value).subscribe(values => {
          this.launches = values;
        });
        break;
      case Options.status:
        this._launchService.getByStatus(value).subscribe(values => {
          this.launches = values;
        });
        break;
    }
  }

}
