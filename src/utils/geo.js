// Reverse geocoding helper using OpenStreetMap Nominatim
export async function reverseGeocode(lat, lng) {
  const coordStr = `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4500)

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'Accept-Language': 'en',
        },
        signal: controller.signal,
      }
    )
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error('Geocoding service unavailable')
    const data = await res.json()

    if (data && data.address) {
      const a = data.address
      // Extract specific landmark or street
      const specific = a.amenity || a.building || a.shop || a.leisure || a.tourism || ''
      const street = a.road || a.pedestrian || a.suburb || a.neighbourhood || ''
      const city = a.city || a.town || a.village || a.district || a.county || 'Meerut'

      const parts = [specific, street, city].filter(Boolean)
      if (parts.length > 0) {
        return `${parts.join(', ')} (${coordStr})`
      }
    }

    if (data && data.display_name) {
      const shortDisplay = data.display_name.split(',').slice(0, 3).join(',').trim()
      return `${shortDisplay} (${coordStr})`
    }
  } catch (err) {
    console.warn('[FoodResQ] Reverse geocoding fallback to coordinates:', err.message)
  }

  // Fallback to exact coordinates
  return coordStr
}
