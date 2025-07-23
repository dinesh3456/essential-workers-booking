import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@googlemaps/google-maps-services-js';

interface Coordinates {
  lat: number;
  lng: number;
}

interface GeocodeResult {
  address: string;
  coordinates: Coordinates;
  city: string;
  state: string;
  zipCode: string;
}

@Injectable()
export class LocationService {
  private googleMapsClient: Client;

  constructor(private configService: ConfigService) {
    this.googleMapsClient = new Client({});
  }

  async geocodeAddress(address: string): Promise<GeocodeResult> {
    try {
      const response = await this.googleMapsClient.geocode({
        params: {
          address,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      });

      if (response.data.results.length === 0) {
        throw new BadRequestException('Address not found');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      // Extract address components
      const components = result.address_components;
      let city = '';
      let state = '';
      let zipCode = '';

      components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
          zipCode = component.long_name;
        }
      });

      return {
        address: result.formatted_address,
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
        city,
        state,
        zipCode,
      };
    } catch (error) {
      throw new BadRequestException(`Geocoding failed: ${error.message}`);
    }
  }

  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult> {
    try {
      const response = await this.googleMapsClient.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      });

      if (response.data.results.length === 0) {
        throw new BadRequestException('Location not found');
      }

      const result = response.data.results[0];
      const location = result.geometry.location;

      // Extract address components
      const components = result.address_components;
      let city = '';
      let state = '';
      let zipCode = '';

      components.forEach((component) => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
          state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
          zipCode = component.long_name;
        }
      });

      return {
        address: result.formatted_address,
        coordinates: {
          lat: location.lat,
          lng: location.lng,
        },
        city,
        state,
        zipCode,
      };
    } catch (error) {
      throw new BadRequestException(`Reverse geocoding failed: ${error.message}`);
    }
  }

  calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(point2.lat - point1.lat);
    const dLng = this.degreesToRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(point1.lat)) * 
      Math.cos(this.degreesToRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async findNearbyWorkers(coordinates: Coordinates, radius: number = 25) {
    // This would typically query the database for workers within the specified radius
    // Implementation depends on your database setup (PostGIS for advanced geo queries)
    
    const query = `
      SELECT w.*, u.*, 
             ( 6371 * acos( cos( radians(${coordinates.lat}) ) 
               * cos( radians( (w.location->>'lat')::float ) ) 
               * cos( radians( (w.location->>'lng')::float ) - radians(${coordinates.lng}) ) 
               + sin( radians(${coordinates.lat}) ) 
               * sin( radians( (w.location->>'lat')::float ) ) ) 
             ) AS distance
      FROM workers w
      INNER JOIN users u ON w.user_id = u.id
      WHERE w.is_available = true
        AND w.status = 'approved'
      HAVING distance < ${radius}
      ORDER BY distance;
    `;

    // This would be executed against your database
    // Return workers within the specified radius
  }
}