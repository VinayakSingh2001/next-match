import { differenceInYears } from "date-fns"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { ZodIssue } from "zod"

export const calculateAge = (dob: Date) =>{
    return differenceInYears(new Date(), dob)
}

export function handleFormServerErrors<TFliedValues extends FieldValues>(
    errorResponse: {error: string | ZodIssue[]},
    setError: UseFormSetError<TFliedValues>
){
    if(Array.isArray(errorResponse.error)){
        errorResponse.error.forEach((e)=>{
          const fieldName = e.path.join(".") as Path<TFliedValues>;
          setError(fieldName, {message: e.message})
        })
      }else{
        setError('root.serverError', {message: errorResponse.error})
      }
}