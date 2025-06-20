'use client'
import { useRouter } from 'next/navigation'
import type React from 'react'
import { useState } from 'react'
import { apiUrl } from '@/app/api/apiUrl'

export default function AdminRegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)

  const businessTypes = [
    'Consultoría',
    'Salud y Bienestar',
    'Belleza y Estética',
    'Educación',
    'Servicios Profesionales',
    'Fitness y Deporte',
    'Otro'
  ]

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'El nombre del negocio es requerido'
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Tu nombre es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Selecciona el tipo de negocio'
    }
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return

    setIsLoading(true)

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (!res.ok) {
        const errorData = await res.json()
        setErrors({ form: errorData.message || 'Error en el registro' })
        setIsLoading(false)
        return
      }
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('companyId', data.admin.id)
      window.location.href = '/dashboard'
    } catch {
      setErrors({ form: 'Error de conexión con el servidor' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ReservaYa</h1>
          <p className="text-gray-600">Crea tu cuenta empresarial</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                1
              </div>
              <div className="w-16 h-1 mx-2 bg-gray-300">
                <div
                  className={`h-full transition-all duration-300 ${
                    step >= 2 ? 'bg-blue-600 w-full' : 'bg-gray-300 w-0'
                  }`}
                ></div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Información básica</span>
            <span>Configuración</span>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {step === 1
                  ? 'Información del negocio'
                  : 'Configuración de cuenta'}
              </h2>
              <p className="text-gray-600">
                {step === 1
                  ? 'Cuéntanos sobre tu negocio'
                  : 'Configura tu acceso y preferencias'}
              </p>
            </div>

            <form
              onSubmit={
                step === 1
                  ? (e) => {
                      e.preventDefault()
                      handleNextStep()
                    }
                  : handleRegister
              }
              className="space-y-6"
            >
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="businessName"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Nombre del negocio
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Ej: Clínica Dental Sonrisa"
                      className={`text-gray-800 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.businessName
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-600 text-sm">
                        {errors.businessName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="ownerName"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Tu nombre completo
                    </label>
                    <input
                      id="ownerName"
                      name="ownerName"
                      type="text"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Ej: Dr. Juan Pérez"
                      className={`text-gray-800 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.ownerName
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {errors.ownerName && (
                      <p className="text-red-600 text-sm">{errors.ownerName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@negocio.com"
                      className={`text-gray-800 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.email
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+34 123 456 789"
                      className={`text-gray-800 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.phone
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-sm">{errors.phone}</p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <label
                      htmlFor="businessType"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Tipo de negocio
                    </label>
                    <select
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`text-gray-800 w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                        errors.businessType
                          ? 'border-red-300 focus:border-red-500'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Selecciona tu tipo de negocio</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {errors.businessType && (
                      <p className="text-red-600 text-sm">
                        {errors.businessType}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Mínimo 6 caracteres"
                        className={`text-gray-800 w-full px-3 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.password
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-600 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repite tu contraseña"
                        className={`text-gray-800 w-full px-3 py-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.confirmPassword
                            ? 'border-red-300 focus:border-red-500'
                            : 'border-gray-300 focus:border-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">
                        Acepto los{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          términos y condiciones
                        </button>{' '}
                        y la{' '}
                        <button
                          type="button"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          política de privacidad
                        </button>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-red-600 text-sm">
                        {errors.acceptTerms}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-4">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Anterior
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creando cuenta...
                    </div>
                  ) : step === 1 ? (
                    'Continuar'
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <div className="text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => router.push('/admin/login')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Inicia sesión aquí
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
