"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Star } from "lucide-react"
import Swal from "sweetalert2"
import axios from "axios"
import { Apis } from "@/app/configs/proyectCurrent"
import { Controller, useForm } from "react-hook-form"
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Stack,
    RadioGroup,
    Radio,
    TableContainer,
    Paper,
    Box,
    Typography,
} from "@mui/material";

interface Question {
    id: number
    type: "stars" | "textarea" | "boolean"
    question: string
    required?: boolean
}

const questions: Question[] = [
    {
        id: 1,
        type: "boolean",
        question: "¿El técnico se presentó adecuadamente indicando su nombre?",
        required: true,
    },
    {
        id: 2,
        type: "boolean",
        question: "¿El técnico llegó uniformado y aseado correctamente?",
        required: true,
    },
    {
        id: 3,
        type: "boolean",
        question: "¿El técnico llegó puntual a su servicio?",
        required: true,
    },
    {
        id: 4,
        type: "boolean",
        question: "¿El técnico le explicó sobre el servicio que realizará y el insumo que aplicará hoy en sus instalaciones?",
        required: true,
    },
    {
        id: 5,
        type: "boolean",
        question: "¿El técnico hizo una inspección previa antes de ejecutar el servicio?",
        required: true,
    },
]

const StarRating = ({
    value,
    onChange,
    disabled = false,
}: { value: number; onChange: (rating: number) => void; disabled?: boolean }) => {
    const [hoverValue, setHoverValue] = useState(0)

    const labels = ["Muy malo", "Malo", "Regular", "Bueno", "Excelente"]

    return (
        <div className="space-y-4">
            <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={disabled}
                        className={`p-2 transition-all duration-200 ${disabled ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
                        onMouseEnter={() => !disabled && setHoverValue(star)}
                        onMouseLeave={() => !disabled && setHoverValue(0)}
                        onClick={() => !disabled && onChange(star)}
                    >
                        <Star
                            className={`w-8 h-8 transition-colors duration-200 ${star <= (hoverValue || value)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                                }`}
                        />
                    </button>
                ))}
            </div>
            {(hoverValue || value) > 0 && (
                <p className="text-center text-lg font-medium text-gray-700">{labels[(hoverValue || value) - 1]}</p>
            )}
        </div>
    )
}

export default function SurveyPage() {

    const { control, formState: { errors } } = useForm<Record<string, any>>({
        defaultValues: {
            1: undefined,
            2: undefined,
            3: undefined,
            4: undefined,
            5: undefined,
        },
    })

    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<{ [key: string]: any }>({})
    const [isCompleted, setIsCompleted] = useState(false)

    const currentQuestion = questions[currentStep]
    const progress = ((currentStep + 1) / questions.length) * 100

    const handleAnswer = (questionId: number, answer: string | number) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }))
    }

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep((prev) => prev + 1)
        } else {
            setIsCompleted(true)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const canProceed = () => {
        if (!currentQuestion.required) return true
        const answer: any = answers[currentQuestion.id]

        if (currentQuestion.type === "stars") {
            return answer && answer > 0
        }

        if (currentQuestion.type === "boolean") {
            // permitir "0" y "1"
            return answer !== undefined && answer !== null && answer !== ""
        }

        return String(answer).trim() !== ""
    }

    const handleSubmit = () => {
        console.log("Respuestas de la encuesta:", answers)
        // Swal.fire({
        //     title: "¡Reclama tu vaso de chicha GRATIS 🍹!",
        //     text: "Muestra este mensaje a la persona que te atendió (no salgas ni actualices la página)",
        //     icon: "success",
        //     // confirmButtonText: "Listo",
        //     showCancelButton: false,
        //     showConfirmButton: false,
        //     allowOutsideClick: false
        //     // customClass: {
        //     //     confirmButton: "bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 text-lg",
        //     // },
        // }).then(() => {
        //     console.log("¡Gracias por completar la encuesta! Reclama en caja tu vaso de chicha GRATIS 🍹")
        // })

        console.log("Enviando encuesta...", answers)

        const jsonSend = {
            pregunta1: answers["1"],
            pregunta2: answers["2"],
            pregunta3: answers["3"],
            pregunta4: answers["4"],
            pregunta5: answers["5"],
            local: "biohazard",
        }

        const response = axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV}/api/encuestas/newEncuesta`, {
            jsonSend,
        }).then(() => {
            console.log("Encuesta enviada correctamente")
            Swal.fire({
                title: "¡GRACIAS!",
                // text: "Muestra este mensaje a la persona que te atendió (no salgas ni actualices la página)",
                icon: "success",
                // confirmButtonText: "Listo",
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: false
                // customClass: {
                //     confirmButton: "bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 text-lg",
                // },
            }).then(() => {
                console.log("¡Gracias por completar la encuesta! Reclama en caja tu vaso de chicha GRATIS 🍹")
            })
        }).catch((error) => {
            console.error("Error al enviar la encuesta:", error)
        })

    }

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
                {/* Logo */}
                <div className="flex justify-center pt-8 pb-4">
                    <img
                        src={"/logobiohazard.jpg"}
                        alt="Logo biohazard"
                        className="h-20 w-auto object-contain"
                    />
                </div>

                {/* Completion Message */}
                <div className="flex-1 flex items-center justify-center px-4">
                    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-8 text-center">
                            <div className="mb-6">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Encuesta Completada!</h2>
                                {/* <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                                    <p className="text-orange-800 font-semibold text-lg">🍹 ¡Tu vaso de chicha GRATIS te espera!</p>
                                    <p className="text-orange-700 text-sm mt-1">Reclámalo en caja presentando esta pantalla</p>
                                </div>
                                <p className="text-gray-600">
                                    Gracias por ayudarnos a mejorar. Tu opinión es muy valiosa para La Cabañita.
                                </p> */}
                            </div>
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 text-lg"
                            >
                                ¡Listo! Muchas gracias
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex flex-col">
            {/* Header con título */}
            <div className="text-center pt-8 pb-4">
                <img
                    src={"/logobiohazard.jpg"}
                    alt="Logo de La Cabañita"
                    className="h-20 w-auto object-contain mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Encuesta de Satisfacción</h1>
                <p className="text-orange-700 font-semibold">TU OPINIÓN NOS IMPORTA MUCHO</p>
                {/* <p className="text-sm text-gray-600 uppercase font-bold">Reclama tu vaso de chicha sin sorteos</p>  */}
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-1">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">
                            Pregunta {currentStep + 1} de {questions.length}
                        </span>
                        <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>
            </div>

            {/* Question Card */}
            <div className="flex-1 flex items-center justify-center px-4">
                <Card className="w-full max-w-2xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardContent className="px-8 py-0">
                        <div className="mb-8 -mt-4">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-relaxed text-center">
                                {currentQuestion.question}
                            </h2>
                            {currentQuestion.required && <p className="text-sm text-red-500 text-center">* Campo obligatorio</p>}
                        </div>

                        <div className="mb-8 -mt-6">
                            {currentQuestion.type === "stars" && (
                                <StarRating
                                    value={Number(answers[currentQuestion.id]) || 0}
                                    onChange={(rating) => handleAnswer(currentQuestion.id, rating)}
                                />
                            )}

                            {
                                currentQuestion.type === "boolean" && (
                                    <Controller
                                        name={`question_${currentQuestion.id}`}
                                        // CORRECCIÓN: Cambiar defaultValue de null a undefined para que no haya selección inicial
                                        defaultValue={undefined}
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RadioGroup
                                                // row
                                                // CORRECCIÓN: Cambiar defaultValue de null a "" para que no haya selección inicial
                                                defaultValue=""
                                                // CORRECCIÓN: Usar string vacío cuando no hay respuesta seleccionada
                                                value={answers[currentQuestion.id] !== undefined ? String(answers[currentQuestion.id]) : ""}
                                                onChange={(e) => {
                                                    // CORRECCIÓN: Convertir el string a booleano
                                                    const val: any = e.target.value === "true";
                                                    onChange(val);
                                                    handleAnswer(currentQuestion.id, val);
                                                }}
                                                className="justify-center items-center gap-2"
                                            >
                                                <FormControlLabel
                                                    value="true"
                                                    control={<Radio color="success" />}
                                                    label="SI"
                                                />
                                                <FormControlLabel
                                                    value="false"
                                                    control={<Radio color="success" />}
                                                    label="NO"
                                                />
                                            </RadioGroup>
                                        )}
                                    />
                                )
                            }

                            {currentQuestion.type === "textarea" && (
                                <div className="space-y-4 -mt-6">
                                    <Textarea
                                        value={String(answers[currentQuestion.id] || "")}
                                        onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                                        placeholder="Escribe tu sugerencia aquí..."
                                        className="text-base p-4 min-h-[100px] resize-none"
                                    />
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <p className="font-medium">Ejemplos:</p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>"Le faltó un poco de sal al caldito"</li>
                                            <li>"La pollada debería freírse un poco más"</li>
                                            <li>"No me trajeron la canchita cuando la pedí"</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 0}
                                className="px-6 py-3 bg-transparent border-orange-300 text-orange-700 hover:bg-orange-50"
                            >
                                Anterior
                            </Button>

                            <Button
                                onClick={currentStep === questions.length - 1 ? handleSubmit : handleNext}
                                disabled={!canProceed()}
                                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium disabled:bg-gray-300"
                            >
                                {currentStep === questions.length - 1 ? "Finalizar" : "Siguiente"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
