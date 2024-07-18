import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userLocationPinia = defineStore(
  'userLocation',
  () => {
    const myPosition = ref({
      longitude: null,
      latitude: null
    })

    function setLocation(latitude, longitude) {
      myPosition.value.latitude = latitude
      myPosition.value.longitude = longitude
    }

    async function fetchLocation() {
      if (
        navigator.geolocation &&
        myPosition.value.latitude === null &&
        myPosition.value.longitude === null
      ) {
        navigator.geolocation.getCurrentPosition(position => {
          setLocation(position.coords.latitude, position.coords.longitude)
        })
      }
    }

    return {
      myPosition,
      fetchLocation
    }
  },
  { persist: true }
)
