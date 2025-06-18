export interface Theme {
    id: string
    name: string
    description: string
    businessType: string
    colors: {
      primary: string
      primaryHover: string
      primaryLight: string
      primaryDark: string
      secondary: string
      accent: string
      background: string
      surface: string
      border: string
      text: string
      textSecondary: string
      success: string
      warning: string
      error: string
    }
    gradients: {
      primary: string
      secondary: string
      background: string
    }
  }
  
  // Solo mantenemos el tema de Salud y Bienestar
  export const themes: Theme[] = [
    {
      id: "healthcare",
      name: "Salud y Bienestar",
      description: "Ideal para clínicas, fisioterapeutas, dentistas",
      businessType: "healthcare",
      colors: {
        primary: "rgb(59, 130, 246)", // blue-500
        primaryHover: "rgb(37, 99, 235)", // blue-600
        primaryLight: "rgb(219, 234, 254)", // blue-100
        primaryDark: "rgb(30, 64, 175)", // blue-800
        secondary: "rgb(16, 185, 129)", // emerald-500
        accent: "rgb(99, 102, 241)", // indigo-500
        background: "rgb(249, 250, 251)", // gray-50
        surface: "rgb(255, 255, 255)", // white
        border: "rgb(229, 231, 235)", // gray-200
        text: "rgb(17, 24, 39)", // gray-900
        textSecondary: "rgb(107, 114, 128)", // gray-500
        success: "rgb(34, 197, 94)", // green-500
        warning: "rgb(245, 158, 11)", // amber-500
        error: "rgb(239, 68, 68)", // red-500
      },
      gradients: {
        primary: "linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241))",
        secondary: "linear-gradient(135deg, rgb(16, 185, 129), rgb(5, 150, 105))",
        background: "linear-gradient(135deg, rgb(249, 250, 251), rgb(243, 244, 246))",
      },
    },
  ]
  
  export const getThemeById = (id: string): Theme => {
    return themes[0] // Siempre devuelve el tema de healthcare
  }
  
  export const getThemeByBusinessType = (businessType: string): Theme => {
    return themes[0] // Siempre devuelve el tema de healthcare
  }
  