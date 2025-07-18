import { ref } from 'vue'
import type { PlaceAutocompleteResult, Place } from '../models/place.model'

export function useGooglePlaces() {
  const isScriptLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Load Google Places API script
  async function loadGoogleScript(apiKey: string): Promise<void> {
    if (isScriptLoaded.value) return

    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.defer = true

      script.onload = () => {
        isScriptLoaded.value = true
        resolve()
      }

      script.onerror = () => {
        reject(new Error('Failed to load Google Places API'))
      }

      document.head.appendChild(script)
    })
  }

  // Search for places using autocomplete
  async function searchPlaces(
    query: string,
    apiKey: string
  ): Promise<PlaceAutocompleteResult[]> {
    if (!isScriptLoaded.value) {
      await loadGoogleScript(apiKey)
    }

    return new Promise((resolve, reject) => {
      const service = new google.maps.places.AutocompleteService()

      service.getPlacePredictions(
        {
          input: query,
          types: ['address'],
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const results: PlaceAutocompleteResult[] = predictions.map((p) => ({
              place_id: p.place_id,
              description: p.description,
              structured_formatting: p.structured_formatting,
              types: p.types,
            }))
            resolve(results)
          } else {
            reject(new Error(`Places search failed: ${status}`))
          }
        }
      )
    })
  }

  // Get place details by place_id
  async function getPlaceDetails(
    placeId: string,
    apiKey: string
  ): Promise<Place> {
    if (!isScriptLoaded.value) {
      await loadGoogleScript(apiKey)
    }

    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      )

      service.getDetails(
        {
          placeId,
          fields: [
            'place_id',
            'formatted_address',
            'name',
            'geometry',
            'address_components',
            'types',
          ],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve(place as Place)
          } else {
            reject(new Error(`Place details failed: ${status}`))
          }
        }
      )
    })
  }

  return {
    // State
    isScriptLoaded,
    isLoading,
    error,

    // Methods
    loadGoogleScript,
    searchPlaces,
    getPlaceDetails,
  }
}
