"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, Clock, MessageSquare } from "lucide-react"
import axios from "axios"
import { Apis } from "@/app/configs/proyectCurrent"
import { useEffect, useState } from "react"

// Datos de ejemplo que representan las respuestas guardadas en la base de datos
// const surveyResponses = [
//     {
//         id: 1,
//         timestamp: "2024-01-15T14:30:00Z",
//         responses: {
//             1: 5, // ¿Cómo te atendió nuestro equipo de atención (mozos/azafata)?
//             2: 4, // ¿Qué te pareció el sabor de nuestros platos?
//             3: 5, // ¿Qué opinas de la limpieza del local?
//             4: "Excelente servicio, solo sugiero que tengan más variedad de postres",
//         },
//     },
//     {
//         id: 2,
//         timestamp: "2024-01-15T16:45:00Z",
//         responses: {
//             1: 4,
//             2: 5,
//             3: 4,
//             4: "Todo muy rico, pero el tiempo de espera fue un poco largo",
//         },
//     },
//     {
//         id: 3,
//         timestamp: "2024-01-15T18:20:00Z",
//         responses: {
//             1: 5,
//             2: 5,
//             3: 5,
//             4: "Perfecto todo, seguiré viniendo. La chicha estaba deliciosa!",
//         },
//     },
//     {
//         id: 4,
//         timestamp: "2024-01-16T12:15:00Z",
//         responses: {
//             1: 3,
//             2: 4,
//             3: 4,
//             4: "El mozo se demoró en tomar mi pedido, pero la comida estuvo buena",
//         },
//     },
//     {
//         id: 5,
//         timestamp: "2024-01-16T13:30:00Z",
//         responses: {
//             1: 5,
//             2: 3,
//             3: 5,
//             4: "Le faltó un poco de sal al caldito, pero el ambiente está muy bonito",
//         },
//     },
//     {
//         id: 6,
//         timestamp: "2024-01-16T19:45:00Z",
//         responses: {
//             1: 4,
//             2: 5,
//             3: 4,
//             4: "Muy buena atención, solo sugiero mejorar la música del ambiente",
//         },
//     },
// ]


export default function DashboardPage() {

    const [surveyResponses, setSurveyResponses] = useState<any[]>([])
    const [totalRespuestas, setTotalRespuestas] = useState(0)
    const [ultimaSugerencia, setUltimaSugerencia] = useState("")

    const fetchEncuestas = async () => {
        try {
            const response = await axios.get(
                `${Apis.URL_APOIMENT_BACKEND_DEV}/api/encuestas/getEncuestas`,
                {
                    params: {
                        local: Apis.PROYECTCURRENT,
                    },
                }
            );
            console.log("Encuestas:", response)
            setTotalRespuestas(response.data.data.encuestasLimit.length)
            setUltimaSugerencia(response.data.data.ultimaSugerencia)
            if (response.status === 201) {
                // setSurveyResponses(response.data)
                const surveyResponsesAll = response?.data?.data?.encuestasLimit?.map((item: any, index: any) => ({
                    id: index + 1,
                    timestamp: item.createdAt,
                    responses: {
                        1: item.pregunta1,
                        2: item.pregunta2,
                        3: item.pregunta3,
                        4: item.pregunta4,
                        5: item.pregunta5,
                    }
                }));
                setSurveyResponses(surveyResponsesAll)
            }
        } catch (error) {
            console.error("Error al obtener las encuestas:", error)
        }
    }

    useEffect(() => {
        console.log("useEffect")
        fetchEncuestas()
    }, [])

    useEffect(() => {
        console.log("useEffect", surveyResponses)
    }, [surveyResponses])

    const questions = [
        "¿El técnico se presentó adecuadamente indicando su nombre?",
        "¿El técnico llegó uniformado y aseado correctamente?",
        "¿El técnico llegó puntual a su servicio?",
        "¿El técnico le explicó sobre el servicio que realizará y el insumo que aplicará hoy en sus instalaciones?",
        "¿El técnico hizo una inspección previa antes de ejecutar el servicio?",
    ]

    const StarDisplay = ({ rating }: { rating: number }) => {
        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">({rating}/5)</span>
            </div>
        )
    }

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getRatingLabel = (rating: number) => {
        const labels = ["", "Muy malo", "Malo", "Regular", "Bueno", "Excelente"]
        return labels[rating] || ""
    }

    const getAverageRating = (questionIndex: number) => {
        const ratings = surveyResponses
            ?.map((response: any) => response.responses[questionIndex + 1])
            .filter((rating) => typeof rating === "number") as number[]

        if (ratings?.length === 0) return 0
        return (ratings?.reduce((sum, rating) => sum + rating, 0) / ratings?.length).toFixed(1)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-100">
            {/* Header */}
            <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-green-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <img
                                src={"logobiohazard.jpg"}
                                alt="Logo de La Cabañita"
                                className="h-12 w-auto object-contain"
                            />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Resumen de Encuestas</h1>
                                <p className="text-gray-600">Respuestas de satisfacción del cliente</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                            Encuestas Totales: {totalRespuestas}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Resumen de calificaciones promedio */}
                {/* <div className="text-lg font-semibold text-gray-800 mb-1">
                    Promedios generales de las preguntas:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {questions.map((question, index) => (
                        <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium text-gray-600 leading-tight">{`Pregunta ${index + 1}: ${question}`}</CardTitle>
                            </CardHeader>
                            {
                                index < 3 ?
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="text-4xl font-bold text-orange-600">{getAverageRating(index)}</div>
                                            <StarDisplay rating={Math.round(Number(getAverageRating(index)))} />
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Promedio general</p>
                                    </CardContent>
                                    :
                                    <CardContent>
                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-bold text-orange-600">{ultimaSugerencia}</div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">Última Sugerencia</p>
                                    </CardContent>

                            }
                        </Card>
                    ))}
                </div> */}

                {/* Tabla de respuestas */}
                <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            <span>Todas las Respuestas</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-50 border-b border-green-200">
                                    <tr>
                                        <th className="text-left p-4 font-semibold text-gray-700 min-w-[120px]">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>Fecha</span>
                                            </div>
                                        </th>
                                        <th className="text-left p-4 font-semibold text-gray-700 min-w-[80px]">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Hora</span>
                                            </div>
                                        </th>
                                        {questions.map((question, index) => (
                                            <th key={index} className="text-left p-4 font-semibold text-gray-700 min-w-[200px]">
                                                <div className="text-sm leading-tight">{question}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {surveyResponses?.map((response: any, responseIndex: any) => (
                                        <tr
                                            key={response.id}
                                            className={`border-b border-gray-100 hover:bg-green-25 transition-colors ${responseIndex % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                                        >
                                            <td className="p-4 text-sm font-medium text-gray-900">{formatDate(response.timestamp)}</td>
                                            <td className="p-4 text-sm text-gray-600">{formatTime(response.timestamp)}</td>
                                            {[1, 2, 3, 4, 5].map((respuesta: any, index: any) => (
                                                <th key={index} className={`text-left p-4 font-semibold text-gray-700 min-w-[200px] ${response?.responses?.[respuesta] == "true" ? "text-green-500" : "text-red-500"}`}>
                                                    <div className="text-sm leading-tight">{response?.responses?.[respuesta] == "true" ? "Sí" : "No"}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
