import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent {

  constructor( private mapService: MapService,
              private PlacesService: PlacesService ) { }

  goToMyLocation() {

    if( !this.PlacesService.isUserLocationReady ) throw Error('No hay ubicacion de usuario');
    if( !this.mapService.isMapReady ) throw Error('No se ha inicializado el mapa');
    
    this.mapService.flyTo( this.PlacesService.useLocation!);
  
  }


}
