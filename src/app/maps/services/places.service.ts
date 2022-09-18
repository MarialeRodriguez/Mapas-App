
import { Injectable } from '@angular/core';
import { PlacesApiClient } from '../api';
import { Feature, PlacesResponse } from '../interfaces/places';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public useLocation: [number, number] | undefined;
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];
  

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  constructor(private placesApi: PlacesApiClient,
              private mapService: MapService) {
    this.getUserLocation();
   }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise( ( resolve, reject ) =>{

      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.useLocation = [ coords.longitude, coords.latitude ];
        resolve([ coords.longitude, coords.latitude ]);
        },
        ( err ) => {
          alert('No se pudo obtener la geolocalizacion')
          console.log(err);
          reject();
        } 
      );

    });

  }

  getPlacesByQuery( query: string = '' ) {
    if( query.length === 0 ){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if( !this.useLocation ) return;
    
    this.isLoadingPlaces = true;

    this.placesApi.get<PlacesResponse>(`/${query}.json`,{
      params: {
        proximity: this.useLocation.join(',')
      }
    })
      .subscribe( resp => {
        this.isLoadingPlaces = false;
        this.places = resp.features;

        this.mapService.createMarkersFromPlaces( this.places, this.useLocation! );
      });
  }

  deletePlaces(){
    this.places = [];
  }

}
