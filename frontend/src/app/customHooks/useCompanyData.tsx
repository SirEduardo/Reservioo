import { BusinessInfo } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { apiUrl } from '../api/apiUrl'

export function useCompanyData(slug: string) {
  const [companyData, setCompanyData] = useState<BusinessInfo | null>(null)

  // Obtener datos de la empresa basándose en el slug
  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/book/${slug}/data`)

      if (response.ok) {
        const data = await response.json()
        setCompanyData(data)
        console.log('companyData', data)
      } else {
        const errorText = await response.text()
        console.error(
          'Error en fetchCompanyData:',
          response.status,
          response.statusText,
          errorText
        )
      }
    } catch (error) {
      console.error('Error al cargar datos de la empresa:', error)
    }
  }, [slug])

  useEffect(() => {
    fetchCompanyData()
  }, [fetchCompanyData])

  return { companyData }
}
