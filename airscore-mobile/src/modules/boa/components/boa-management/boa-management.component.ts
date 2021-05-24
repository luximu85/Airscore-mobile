import {Component, OnInit} from '@angular/core';
import {FileUtils} from "@shared/utils/file.utils";
import {WaypointGroupModel, WaypointModel} from "@shared/model/waypoint/waypoint.model";
import {parseWPTToJson} from "@shared/utils/wpt.utils";
import {StorageService} from "@shared/services/storage.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {validateFormControls} from "@shared/utils/form.utils";

@Component({
  selector: 'skg-boa-management',
  templateUrl: './boa-management.component.html',
  styleUrls: ['./boa-management.component.scss']
})
export class BoaManagementComponent implements OnInit {

  form: FormGroup = new FormGroup({
    nameG: new FormControl('Norma', Validators.required),
    versionG: new FormControl('2020', Validators.required)
  })

  uploadedFiles: any[] = [];

  fileContent: string | ArrayBuffer | null = '';

  waypoints: Array<WaypointModel> = [];

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
  }

  onUploadBoe(event: any) {
    this.uploadedFiles = event.files;
    for(let file of event.files) {
      const fileUtils = new FileUtils();
      fileUtils.fileContent.subscribe(value => {
        this.fileContent = value;
        this.waypoints = parseWPTToJson(value);
      });
      fileUtils.readFileTxtUtil(file);
    }
  }

  onDeleteFile() {
    this.uploadedFiles = [];
    this.fileContent = '';
    this.waypoints = [];
  }

  onSaveWaypoint() {
    validateFormControls(this.form);
    if (this.form.valid) {
      const name = this.form.controls.nameG.value;
      const version = this.form.controls.versionG.value;
      this.storageService.setInStore('WAY_POINT_GROUP', new WaypointGroupModel(name, version, this.waypoints))
    }
  }

}
